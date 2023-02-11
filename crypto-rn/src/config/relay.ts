// @ts-nocheck
import extractFiles from 'extract-files/extractFiles.mjs';
import isExtractableFile from 'extract-files/isExtractableFile.mjs';
// import {createClient as createClientSSE} from 'graphql-sse';
import {createClient as createClientWS} from 'graphql-ws';
import {meros} from 'meros/browser';
import {useMemo} from 'react';
import {
  Environment,
  Network,
  Observable,
  RecordSource,
  Store,
} from 'relay-runtime';

// import {Config} from '@/config';
import {isAsyncIterable, merge} from '@/utils';

let relayEnvironment;

const ErrorMessages = {
  FAILED_FETCH: 'Failed to fetch',
  ERROR_FETCH: 'Error in fetch',
  UNWORKABLE_FETCH: 'Unworkable fetch',
  SOCKET_CLOSED: 'Socket closed',
  GRAPHQL_ERRORS: 'GraphQL error',
};

class NetworkError extends Error {
  constructor(message, options) {
    super(message, options);

    this.name = 'NetworkError';

    if (options) {
      const {cause, ...meta} = options;

      Object.assign(this, meta);
    }
  }
}

const fetchFn = (operation, variables, _cacheConfig, _uploadables) => {
  const httpEndpoint = 'https://api-crypto-workshop.chillicream.com/graphql';
  const authToken = undefined;

  return Observable.create((sink) => {
    const init = {
      method: 'POST',
      headers: {
        Accept: [
          'application/graphql-response+json;charset=utf-8',
          'multipart/mixed;charset=utf-8',
        ],
        Authorization: authToken ? `basic ${authToken}` : undefined,
      },
    };

    const {clone, files} = extractFiles(
      {
        id: operation.id ?? undefined,
        query: operation.text ?? undefined,
        variables,
      },
      isExtractableFile,
    );

    if (files.size) {
      const form = new FormData();

      form.set('operations', JSON.stringify(clone));

      const map = {};
      let i = 0;

      files.forEach((paths) => {
        map[i++] = paths;
      });

      form.set('map', JSON.stringify(map));

      i = 0;
      files.forEach((paths, file) => {
        form.set(`${i++}`, file, file.name);
      });

      merge(init, {
        body: form,
      });
    } else {
      merge(init, {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clone),
      });
    }

    (async () => {
      const request = new Request(httpEndpoint, init);

      try {
        const response = await fetch(request);

        // Status code in range 200-299 inclusive (2xx).
        if (response.ok) {
          try {
            const parts = await meros(response);

            if (isAsyncIterable(parts)) {
              for await (const part of parts) {
                if (!part.json) {
                  sink.error(
                    new NetworkError(ErrorMessages.UNWORKABLE_FETCH, {
                      request,
                      response,
                    }),
                  );
                  break;
                }

                // If any exceptions occurred when processing the request,
                // throw an error to indicate to the developer what went wrong.
                if ('errors' in part.body) {
                  sink.error(
                    new NetworkError(ErrorMessages.GRAPHQL_ERRORS, {
                      request,
                      response,
                    }),
                  );
                  break;
                }

                // DEMO: delay chunked responses
                // await pause(2_000);

                if ('data' in part.body) {
                  sink.next(part.body);
                }

                if ('incremental' in part.body) {
                  for (const chunk of part.body.incremental) {
                    if ('data' in chunk) {
                      sink.next({
                        ...chunk,
                        hasNext: part.body.hasNext,
                      });
                    } else {
                      if (chunk.items) {
                        // All but the non-final path segments refers to the location
                        // of the list field containing the `@stream` directive.
                        // The final segment of the path list is an integer.
                        //
                        // Note: We must "copy" to avoid mutations.
                        const location = chunk.path.slice(0, -1);
                        let index = chunk.path.at(-1);

                        for (const item of chunk.items) {
                          sink.next({
                            ...chunk,
                            path: location.concat(index++),
                            data: item,
                            hasNext: part.body.hasNext,
                          });
                        }
                      } else {
                        sink.next({
                          ...chunk,
                          data: chunk.items,
                          hasNext: part.body.hasNext,
                        });
                      }
                    }
                  }
                }
              }
            } else {
              const json = await response.json();

              // If any exceptions occurred when processing the request,
              // throw an error to indicate to the developer what went wrong.
              if ('errors' in json) {
                sink.error(
                  new NetworkError(ErrorMessages.GRAPHQL_ERRORS, {
                    request,
                    response,
                  }),
                );
              } else {
                // DEMO: delay response
                // await pause(2_000);

                sink.next(json);
              }
            }

            sink.complete();
          } catch (err) {
            sink.error(
              new NetworkError(ErrorMessages.UNWORKABLE_FETCH, {
                cause: err,
                request,
                response,
              }),
              true,
            );
          }
        } else {
          sink.error(
            new NetworkError(ErrorMessages.ERROR_FETCH, {request, response}),
          );
        }
      } catch (err) {
        sink.error(
          new NetworkError(ErrorMessages.FAILED_FETCH, {cause: err, request}),
          true,
        );
      }
    })();
  });
};

/**
 * With `graphql-sse`.
 * @see https://github.com/enisdenjo/graphql-sse
 */
// const subscribeFnWithSSE = (operation, variables) => {
//   const httpEndpoint = 'https://api-crypto-workshop.chillicream.com/graphql';
//   const authToken = undefined;

//   const client = createClientSSE({
//     url: httpEndpoint,

//     /** If you have an HTTP/2 server, it is recommended to use the client in "distinct connections mode" (singleConnection = false) which will create a new SSE connection for each subscribe. */
//     singleConnection: false,

//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: authToken ? `basic ${authToken}` : undefined,
//     },
//   });

//   return Observable.create((sink) =>
//     client.subscribe(
//       {
//         id: operation.id ?? undefined,
//         query: operation.text,
//         variables,
//       },
//       {
//         ...sink,
//         error: (err) => {
//           if (Array.isArray(err)) {
//             return sink.error(
//               new NetworkError(ErrorMessages.ERROR_FETCH, {cause: err}),
//             );
//           }

//           return sink.error(err, true);
//         },
//       },
//     ),
//   );
// };

let wsClient;

/**
 * With `graphql-ws`.
 * @see https://github.com/enisdenjo/graphql-ws
 */
const subscribeFnWithWS = (operation, variables) => {
  const wsEndpoint = 'wss://api-crypto-workshop.chillicream.com/graphql';
  const authToken = undefined;

  const client = (wsClient ??= createClientWS({
    url: wsEndpoint,
    connectionParams: {
      Authorization: authToken ? `basic ${authToken}` : undefined,
    },
  }));

  return Observable.create((sink) =>
    client.subscribe(
      {
        id: operation.id ?? undefined,
        query: operation.text,
        variables,
      },
      {
        ...sink,
        error: (err) => {
          if (Array.isArray(err)) {
            return sink.error(
              new NetworkError(ErrorMessages.ERROR_FETCH, {cause: err}),
            );
          }

          if (err instanceof CloseEvent) {
            return sink.error(
              new NetworkError(ErrorMessages.SOCKET_CLOSED, {cause: err}),
            );
          }

          return sink.error(err, true);
        },
      },
    ),
  );
};

// DEMO: choose one of the implementations
// const subscribeFn = subscribeFnWithSSE;
const subscribeFn = subscribeFnWithWS;

const createEnvironment = (initialRecords) => {
  const source = new RecordSource(initialRecords);

  /**
   * Presence of Data
   * @see https://relay.dev/docs/guided-tour/reusing-cached-data/presence-of-data/
   *
   * - Note that having a buffer size of 0 is equivalent to not having the release buffer, which means that queries will be immediately released and collected.
   * - By default, environments have a release buffer size of 10.
   *
   * @example
   * // last 10 queries
   * gcReleaseBufferSize: 10,
   *
   *
   * Staleness of Data
   * @see https://relay.dev/docs/guided-tour/reusing-cached-data/staleness-of-data/
   *
   * - If the query cache expiration time is not provided, staleness checks only look at whether the referenced records have been invalidated.
   *
   * @example
   * // 1 min
   * queryCacheExpirationTime: 60 * 1_000,
   */
  const options = {};

  const store = new Store(source, options);

  const network = Network.create(fetchFn, subscribeFn);

  return new Environment({
    network,
    store,
  });
};

export const initEnvironment = (initialRecords) => {
  // Create a network layer from the fetch function
  const environment = relayEnvironment ?? createEnvironment(initialRecords);

  // If your page has Next.js data fetching methods that use Relay, the initial records
  // will get hydrated here
  if (initialRecords) {
    environment.getStore().publish(new RecordSource(initialRecords));
  }
  // For SSG and SSR always create a new Relay environment
  if (typeof window === 'undefined') return environment;
  // Create the Relay environment once in the client
  if (!relayEnvironment) relayEnvironment = environment;

  return relayEnvironment;
};

export const useEnvironment = (initialRecords) =>
  useMemo(() => initEnvironment(initialRecords), [initialRecords]);
