# Fake it till you make it

Yes, our last step was just kinda "fake", because we are doing a data driven app. Let's go ahead.

## Fetch GraphQL (without Relay)

We'll start with a common approach to fetching data in React, calling our fetch function after the component mounts.

:::caution

Later we'll see some limitations of this approach and a better alternative that works with React Concurrent Mode and Suspense.

:::

1. Modify the `@/scenes/Greetings.js'. Just replace the existing code by this enhanced version.

   ```jsx title="@/scenes/Greetings.js"
   import {useEffect, useState} from 'react';

   const fetchGraphQL = async (query, variables) => {
     const response = await fetch('http://localhost:5000/graphql', {
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

   export default function Greetings() {
     const [greetings, setGreetings] = useState(null);

     useEffect(() => {
       let mounted = true;

       fetchGraphQL(`
         query GreetingsQuery {
           greetings
         }
       `)
         .then((response) => {
           if (!mounted) {
             setGreetings(response.data.greetings);
           }
         })
         .catch((error) => {
           console.error(error);
         });

       return () => {
         mounted = false;
       };
     }, []);

     return <div>{greetings}</div>;
   }
   ```

1. See the results.

   :::note Ta-da!

   You should have reached the GraphQL server and received the data matching your first query.

   :::

### What's going on?

It might be that you are familiar with the pattern used in code above. It is common for apps that need to fetch some data, for example from a REST endpoint.

We have:

- A `fetcher` function that makes a request passing some variables, later on the `json()` method of the received response resolves with the result of parsing the body text as [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON).

- By using `useEffect` you tell React that your component needs to do something after render, more exactly to fetch the data.

- After our async operation is done, it is either resolved with `data` or rejected with `error`.

- If in the meantime the component has not been dismounted (see flag `mounted`), we set the internal state with the received value and it triggers a rerender of the component.

At this point we can fetch data with GraphQL and render it with React. This is a reasonable solution that can be sufficient for many apps. However, this approach doesn't necessarily scale. As our app grows in size and complexity, or the number of people working on the app grows, a simple approach like this can become limiting.

## Fetch GraphQL (with Relay)

Relay provides a number of features designed to help keep applications fast and reliable even as they grow in size and complexity: colocating data dependencies in components with GraphQL fragments, data consistency, mutations, etc. Check out [Thinking in GraphQL](https://relay.dev/docs/principles-and-architecture/thinking-in-graphql/) and [Thinking in Relay](https://relay.dev/docs/principles-and-architecture/thinking-in-relay/) for an overview of how Relay makes it easier to work with GraphQL.

### Adding Relay To Our Project

Relay is comprised of three key pieces: a compiler (`relay-compiler`, which is used at build time), a core runtime (`relay-runtime`, that is React agnostic), and a React integration layer (`react-relay`).

1. Include dependencies.

   All of the above mentioned dependencies were ahead of time added to our project and you did install them in the former steps, otherwise you should run:

   ```sh
   yarn add react-relay
   yarn add --dev relay-compiler
   ```

   :::note Dependencies

   Relay docs mention `relay-runtime`, which is already a dependency of `react-relay` and `babel-plugin-relay` that we are not including because in this project is the Next compiler, written in Rust using [SWC](http://swc.rs/), taking care of the work done by such plugin, allowing us to build faster for production and get instant feedback in local development. More on this topic, [Relay](https://nextjs.org/docs/advanced-features/compiler#relay).

   :::

1. Configure Relay Compiler.

   Let's [configure Relay compiler](https://github.com/facebook/relay/tree/main/packages/relay-compiler).

   We'll need a copy of the schema as a `.graphql` file.

   - You could copy it over into `/schema/server.graphql`.

   - Or you can use the preintalled [`graphql-codegen`](https://www.graphql-cli.com/codegen) that together with its configuration file `codegen.yml` will generate your GraphQL schema.

     ```sh
     yarn run graphql-codegen
     ```

   We'll need to tweak some settings into `relay.config.js`, no worry, it was ahead of time added to our project and also included into the Next config.

   There are several possible ways to trigger a compilation. For example:

   - You could just invoke it as:

     ```sh
     yarn run relay-compiler
     ```

   - But we added a script into `package.json` that downloads the schema and compiles.

     ```json title="package.json"
     {
       "scripts": {
         "relay": "graphql-codegen && relay-compiler"
       }
     }
     ```

   :::note Script

   After making edits to your application files, just run the `relay` script to generate new compiled artifacts:

   ```sh
   yarn relay
   ```

   :::

1. Configure Relay Runtime.

   Now that the compiler is configured we can set up the runtime - we have to tell Relay how to connect to our GraphQL server.
   An Environment encapsulates how to talk to our server (a Relay Network) with a cache of data retrieved from that server.

   ```jsx title="/pages/index.js"
   import {Environment, Network, RecordSource, Store} from 'relay-runtime';
   import {RelayEnvironmentProvider} from 'react-relay';
   import {Suspense} from 'react';

   import {default as Greetings} from '@/scenes/Greetings';

   const fetchGraphQL = async (query, variables) => {
     const response = await fetch('http://localhost:5000/graphql', {
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

   const environment = new Environment({
     network: Network.create(fetchFn),
     store: new Store(new RecordSource()),
   });

   export default function Main() {
     return (
       <RelayEnvironmentProvider environment={environment}>
         <Suspense fallback="Loading...">
           <Greetings />
         </Suspense>
       </RelayEnvironmentProvider>
     );
   }
   ```

1. Fetching a Query With Relay.

   Now that Relay is installed and configured in the context within we will render our `scenes`, we can use a hook to fetch a GraphQL query during render.

   The `graphql` template tag provided by Relay serves as the mechanism to write queries, fragments, mutations and subscriptions in the GraphQL language.

   Note that `graphql` template tags are **never executed at runtime**. Instead, they are compiled ahead of time by the Relay compiler into generated artifacts that live alongside your source code, and which Relay requires to operate at runtime.

   ```jsx title="@/scenes/Greetings.js"
   import {graphql, useLazyLoadQuery} from 'react-relay';

   export default function Greetings() {
     const data = useLazyLoadQuery(
       graphql`
         query GreetingsQuery {
           greetings
         }
       `,
       {},
     );
   }

   return <div>{data.greetings}</div>;
   ```

   :::caution

   Did you see that we have named the file `Greetings` in place of lowercase `greetings`?
   It is because we must follow some naming conventions required by the compiler in order to generate our graphql artifacts.
   This is a bit contribed specially when it is maintream to use `kebab-case` for file naming by other best practices.

   :::

1. Running the compiler.

   The Relay Compiler is responsible for generating code as part of a build step which can then be referenced at runtime. By building the query ahead of time, the Relay's runtime is not responsible for generating a query string, and various optimizations can be performed on the query that could be too expensive at runtime (for example, fields that are duplicated in the query can be merged during the build step, to improve efficiency of processing the GraphQL response).

   ```sh
   yarn relay
   ```

1. See the Results.

The browser should automatically refresh and display the updated page.

#### Behavior

- It is expected for `useLazyLoadQuery` to have been rendered under a [`RelayEnvironmentProvider`](https://relay.dev/docs/api-reference/relay-environment-provider/), in order to access the correct Relay environment, otherwise an error will be thrown.

- Calling `useLazyLoadQuery` will fetch and render the data for this query, and it may [suspend](https://relay.dev/docs/guided-tour/rendering/loading-states/) while the network request is in flight, depending on the specified `fetchPolicy`, and whether cached data is available, or if it needs to send and wait for a network request. If `useLazyLoadQuery` causes the component to suspend, you'll need to make sure that there's a `Suspense` ancestor wrapping this component in order to show the appropriate loading state.

  - For more details on `Suspense`, see the [Loading States with Suspense](https://relay.dev/docs/guided-tour/rendering/loading-states/) guide.

- The component is automatically subscribed to updates to the query data: if the data for this query is updated anywhere in the app, the component will automatically re-render with the latest updated data.

- After a component using `useLazyLoadQuery` has committed, re-rendering/updating the component will not cause the query to be fetched again.

  - If the component is re-rendered with _different query variables_, that will cause the query to be fetched again with the new variables, and potentially re-render with different data.

  - If the component _unmounts and remounts_, that will cause the current query and variables to be refetched (depending on the `fetchPolicy` and the state of the cache).

### Let's make it better

The `useLazyLoadQuery` hook allow us to pass `variables` and `options`. In the example above we just passed `{}` which means kinda "no vars" and we could use it to do more interesting things.

```jsx title="@/scenes/Greetings.js"
import {graphql, useLazyLoadQuery} from 'react-relay';

export default function Greetings({name}) {
  const data = useLazyLoadQuery(
    graphql`
      query GreetingsQuery @argumentDefinitions(name: {type: "String"}) {
        greetings(name: $name)
      }
    `,
    {name},
  );
}

return <div>{data.greetings}</div>;
```

Now we are able to pass the name into the query, allowing us to something like:

```jsx
<Greetings name="Luke" />
```

Lets see what's going on here:

- By default, when the component renders, Relay will fetch the data for this query (if it isn't already cached), and return it as a the result of the `useLazyLoadQuery` call.

- Note that if you re-render your component and pass different query variables than the ones originally used, it will cause the query to be fetched again with the new variables, and potentially re-render with different data.

- Finally, make sure you're providing a Relay environment using a [Relay Environment Provider](https://relay.dev/docs/api-reference/relay-environment-provider/) at the root of your app before trying to render a query.

### Recap

We explored how to get started with Relay, although in a naive way, there is nothing wrong about it, but we will continue introducing other concepts and possibilities.
