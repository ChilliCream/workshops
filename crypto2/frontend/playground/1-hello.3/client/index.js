import {useMemo} from 'react';
import {Environment, Network, RecordSource, Store} from 'relay-runtime';

const fetchGraphQL = async (query, variables) => {
  const response = await fetch(process.env.NEXT_PUBLIC_HTTP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  return await response.json();
};

const fetchFn = (params, variables) => fetchGraphQL(params.text, variables);

const createEnvironment = () =>
  new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
  });

export const useEnvironment = () => useMemo(createEnvironment, []);
