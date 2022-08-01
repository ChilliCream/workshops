# Hello, World!

The most common way to start any programming course is to display the text “Hello, World!”. Continuing with this tradition, we’ll use React/Relay to display the famous text.

If you want to go straight to the solution, do the following:

:::tip Use the `goto` script as a shortcut

```sh
yarn goto playground/1-hello.3
```

:::

---

## Getting Started

In Next.js, a **page** is a [React Component](https://reactjs.org/docs/components-and-props.html) exported from a `.js`, `.jsx`, `.ts`, or `.tsx` file in the `pages` directory. Each page is associated with a route based on its file name.

For example, if you create `/pages/index.js` that exports a React component like below, it’ll be rendered when the user visits the root of your application.

Next.js has a file-system based router built on the [concept of pages](https://nextjs.org/docs/basic-features/pages). When a file is added to the `pages` directory, it’s automatically available as a route.

For this reason, we’ll use `pages` only for the **routes** while our “views” will be contained into `scenes`.
A scene represents one instance of your app’s user interface, and without an awareness of where (or what route) that scene might render.

1. Create a file at `/scenes/Greetings.js`.

   ```jsx title="@/scenes/Greetings.js"
   export const Greetings = () => <h1>Hello, World!</h1>;
   ```

1. Create a file at `/scenes/index.js`.

   ```jsx title="@/scenes/index.js"
   export * from './Greetings';
   ```

1. Create a file at `/pages/index.js`.

   ```jsx title="@/pages/index.js"
   export {Greetings as default} from '@/scenes';
   ```

Next.js uses the `App` component to initialize pages and the `Document` component to update the `<html>` and `<body>` tags. Both are customizable and have been omitted for brevity. You can find them on the accompanying materials.

:::tip Use the `goto` script as a shortcut

```sh
yarn goto playground/1-hello.1
```

:::

#### Check It Out

Now that we’ve created our code, let’s see our app in action!

1. Open the integrated terminal in Visual Studio Code by selecting `View > Terminal` or by selecting `Ctrl+`. On a Mac, select `Cmd+` instead.

1. Use the following command to start the Next.js development server:

   ```sh
   yarn dev
   ```

1. Open your browser and visit [http://localhost:3000](http://localhost:3000). You should see the message “Hello, World!”.

#### What’s Going On?

At this point we’ve the scaffolding in place.

- A scene defines our view.
- A page setups the routing.
- Custom `_app` and `_document` control the page initialization and environment.

Awesome! But we’re doing a data driven app. Let’s go ahead.

---

## Fetching without Relay

We’ll start with a common approach to fetching data in React, by calling our fetch function when the component is rendered.

:::caution

Later we’ll see some limitations of this approach and a better alternative that works with React Concurrent Mode and Suspense.

:::

1. Modify the `/scenes/Greetings.js`. Just replace the existing code by this enhanced version.

   ```jsx title="@/scenes/Greetings.js"
   import {useEffect, useState} from 'react';

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

   export const Greetings = () => {
     const [greetings, setGreetings] = useState(null);

     useEffect(() => {
       let mounted = true;

       fetchGraphQL(`
          query GreetingsQuery {
            greetings
          }
        `)
         .then((response) => {
           if (mounted) {
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

     return <h1>{greetings}</h1>;
   };
   ```

   It might be that you’re familiar with the pattern used in code above. It’s common for apps that need to fetch some data, for example from a REST endpoint.

:::tip Use the `goto` script as a shortcut

```sh
yarn goto playground/1-hello.2
```

:::

#### Check It Out

1. Open your browser and visit [http://localhost:3000](http://localhost:3000). You should see the message “Hello, World!”.

   :::note Ta-da!

   You should have reached the GraphQL server and received the data matching your first query.

   :::

1. Open the **DevTools** of your browser and select the **Network** panel. Reload the app and look among the resources for the GraphQL request (e.g., filter by `/graphql`). Inspect the details of the resource in different panels.

#### What’s Going On?

At this point we’re already fetching data using GraphQL.

- A `fetcher` function makes a request passing some variables and later on the `json()` method of the received response resolves with the result of parsing the body text as [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON).
- We use `useEffect` to start fetching data after the component has rendered on the screen.
- After our async operation is done, it is either resolved with `data` or rejected with `error`.
- If in the meantime the component has not been dismounted (see flag `mounted`), we set the internal state with the received value and it triggers a rerender of the component.

This is a reasonable solution that can be sufficient for many apps. However, this approach doesn’t necessarily scale. As our app grows in size and complexity, or the number of people working on the app grows, it becomes limiting.

---

## Fetching with Relay

Relay provides a number of features designed to help keep applications fast and reliable even as they grow in size and complexity: collocating data dependencies in components with GraphQL fragments, data consistency, mutations, etc. Check out [Thinking in GraphQL](https://relay.dev/docs/principles-and-architecture/thinking-in-graphql/) and [Thinking in Relay](https://relay.dev/docs/principles-and-architecture/thinking-in-relay/) for an overview of how Relay makes it easier to work with GraphQL.

### Adding Relay to Our Project

Relay is comprised of three key pieces: a compiler (`relay-compiler`, which is used at build time), a core runtime (`relay-runtime`, that is React agnostic), and a React integration layer (`react-relay`).

#### Include Dependencies

All of the above mentioned dependencies were ahead of time added to our project and you did install them in the former steps, otherwise you should run:

```sh
yarn add react-relay
yarn add --dev relay-compiler
```

:::note Dependencies

Relay’s docs mention `babel-plugin-relay` which is only needed for testing, otherwise the Next.js compiler, written in Rust using [SWC](http://swc.rs/), is taking care of the work done by such plugin, allowing us to build faster for production and get instant feedback in local development. More on this topic, [Relay](https://nextjs.org/docs/advanced-features/compiler#relay).

:::

#### Configure Relay Compiler

We’ll need a copy of the schema as a `.graphql` file.

- You could copy it over into `/schema/server.graphql`.
- Or you can use the preintalled [`graphql-codegen`](https://www.graphql-cli.com/codegen) that together with its configuration file `codegen.yml` will generate your GraphQL schema.

  ```sh
  yarn graphql-codegen --require dotenv/config
  ```

We would need to tweak some settings into `relay.config.js`, no worry, it was added to our project ahead of time and included in the Next.js config as well.

There are several possible ways to trigger a compilation. For example:

- You could just invoke it as:

  ```sh
  yarn relay-compiler
  ```

But to make it easier we’ve added some scripts in `package.json`:

```json title="package.json"
{
  "scripts": {
    "codegen": "graphql-codegen --require dotenv/config",
    "relay": "relay-compiler"
  }
}
```

:::note Scripts

Update the schema before starting new features:

```sh
yarn codegen
```

Generate new compiled artifacts after making edits to your application files:

```sh
yarn relay
```

:::

#### Configure Relay Runtime

We’ve to tell Relay how to connect to our GraphQL server. An Environment encapsulates how to talk to our server (a Relay Network) with a cache of data retrieved from that server.

1. Create a file at `/client/index.js`. It exports a hook with the environment.

   ```jsx title="@/client/index.js"
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
   ```

   :::info Coming soon

   We’ll enhance the [Network Layer](https://relay.dev/docs/guides/network-layer/) to handle authentication, multipart responses, file upload and subscriptions.

   :::

1. Modify the `/pages/_app.js`. Just replace the existing code by this enhanced version.

   ```jsx title="@/pages/_app.js"
   import {CacheProvider} from '@emotion/react';
   import {CssBaseline, ThemeProvider} from '@mui/material';
   import {RelayEnvironmentProvider} from 'react-relay';

   import {useEnvironment} from '@/client';
   import {Layout, Metadata, ModeProvider, SlotsProvider} from '@/components';
   import {usePreferredTheme} from '@/hooks';
   import {createEmotionCache} from '@/styles';

   const clientSideEmotionCache = createEmotionCache();

   export default function MyApp({
     Component,
     emotionCache = clientSideEmotionCache,
     pageProps,
   }) {
     const environment = useEnvironment();
     const [theme, mode] = usePreferredTheme();

     return (
       <RelayEnvironmentProvider environment={environment}>
         <CacheProvider value={emotionCache}>
           <ThemeProvider theme={theme}>
             <ModeProvider value={mode}>
               <Metadata />
               <CssBaseline enableColorScheme />
               <SlotsProvider>
                 <Layout variant="splash">
                   <Component {...pageProps} />
                 </Layout>
               </SlotsProvider>
             </ModeProvider>
           </ThemeProvider>
         </CacheProvider>
       </RelayEnvironmentProvider>
     );
   }
   ```

If you make a diff with the previous version, it’s all about a few lines.

A `RelayEnvironmentProvider` is used to set a Relay environment in React Context. Usually, a single instance of this component should be rendered at the very root of the application, in order to set the Relay environment for the whole application.

### Executing a Query

Now that Relay is installed and configured in the context within we’ll render our **scenes**, we can use a hook to fetch a GraphQL query during render.

The `graphql` template tag provided by Relay serves as the mechanism to write queries, fragments, mutations and subscriptions in the GraphQL language.

Note that `graphql` template tags are **never executed at runtime**. Instead, they’re compiled ahead of time by the Relay compiler into generated artifacts that live alongside your source code, and which Relay requires to operate at runtime.

1. Modify the `/scenes/Greetings.js`. Just replace the existing code by this enhanced version.

   ```jsx title="@/scenes/Greetings.js"
   import {Suspense} from 'react';
   import {graphql, useLazyLoadQuery} from 'react-relay';

   export const Greetings = () => {
     const data = useLazyLoadQuery(
       graphql`
         query GreetingsQuery {
           greetings
         }
       `,
       {},
     );

     return <h1>{data.greetings}</h1>;
   };

   export default () => (
     <Suspense fallback={false}>
       <Greetings />
     </Suspense>
   );
   ```

   A `Suspense` boundary will render the provided fallback until all its descendants become “ready” and give us a granular control about how to accumulate loading states for different parts of components’ tree.

   :::caution

   Did you notice that we’ve named the file `Greetings` instead of lowercase `greetings`?
   It’s because we must follow some naming conventions required by the compiler in order to generate our GraphQL artifacts.
   This is a bit contribed specially when it is maintream to use `kebab-case` for file naming by other best practices.

   :::

   Let’s make it better. We can pass variables into the query.

   ```jsx title="@/scenes/Greetings.js"
   import {Suspense} from 'react';
   import {graphql, useLazyLoadQuery} from 'react-relay';

   export const Greetings = () => {
     const data = useLazyLoadQuery(
       graphql`
         query GreetingsQuery($name: String!) {
           greetings(name: $name)
         }
       `,
       {name: 'Luke'},
     );

     return <h1>{data.greetings}</h1>;
   };

   export default () => (
     <Suspense fallback={false}>
       <Greetings />
     </Suspense>
   );
   ```

   Variables are a first-class way to factor dynamic values out of the query, and pass them as a separate dictionary.

   :::note Refreshing and Refetching

   When referring to “refreshing a query”, we mean fetching the exact same data that was originally rendered by the query, in order to get the most up-to-date version of that data from the server.

   If we want to keep our data up to date with the latest version from the server, the first thing to consider is if it appropriate to use any real-time features, which can make it easier to automatically keep the data up to date without manually refreshing the data periodically.

   To refresh a query using the [useLazyLoadQuery](https://relay.dev/docs/api-reference/use-lazy-load-query/) hook, we can use the following options:

   - `fetchKey`: A new fetchKey will ensure that the query is fully re-evaluated and refetched.
   - `fetchPolicy`: to ensure that we always fetch from the network and skip the local data cache.

   ```jsx title="@/scenes/Greetings.js"
   export default function Greetings() {
     const [fetchOptions, setOptions] = useState(undefined);

     const data = useLazyLoadQuery(
       graphql`
         query GreetingsQuery($name: String!) {
           greetings(name: $name)
         }
       `,
       {name: 'Luke'},
       fetchOptions,
     );

     const refresh = useCallback(() => {
       setOptions((prev) => ({
         fetchKey: (prev?.fetchKey ?? 0) + 1,
         fetchPolicy: 'network-only',
       }));
     }, []);

     return (
       <>
         <h1>{data.greetings}</h1>
         {/* ... */}
         <button onClick={refresh}>refresh</button>
       </>
     );
   }
   ```

   When referring to “refetching a query”, we mean fetching the query again for _different_ data than was originally rendered by the query. For example, to render a different list of items than the one being shown, or more generally to transition the currently rendered content to show different content.

   `Suspense` boundary fallbacks allow us to describe our loading placeholders when initially rendering some content, but our applications will also have transitions between different content.

   React, when concurrent rendering is supported, provides an option to avoid hiding already rendered content with a `Suspense` fallback when suspending.

   For more information, read the docs [here](https://reactjs.org/docs/hooks-reference.html#usetransition).

   :::

1. Running the Compiler.

   The Relay Compiler is responsible for generating code as part of a build step which can then be referenced at runtime. Relay validates and optimizes queries, and pre-computes artifacts to achieve faster runtime performance.

   ```sh
   yarn relay
   ```

:::tip Use the `goto` script as a shortcut

```sh
yarn goto playground/1-hello.3
```

:::

#### Check It Out

1. Open your browser and visit [http://localhost:3000](http://localhost:3000). You should see the message “Hello, World!” or “Hello, Luke!” accordingly.

   :::note Ta-da!

   You should have reached the GraphQL server and received the data matching your first query with Relay.

   :::

1. Open the **DevTools** of your browser and select the **Network** panel. Reload the app and look among the resources for the GraphQL request (e.g., filter by `/graphql`). Inspect the details of the resource in different panels.

#### What’s Going On?

At this point we’re already fetching data using Relay.

- By default, when the component renders, Relay will fetch the data for this query, and it may [suspend](https://relay.dev/docs/guided-tour/rendering/loading-states/) while the network request is in flight, depending on the specified `fetchPolicy`, and whether cached data is available.
- The component is automatically subscribed to updates to the query data: if the data for this query is updated anywhere in the app, the component will automatically re-render with the latest updated data.
- After a component using `useLazyLoadQuery` has committed, re-rendering/updating the component will not cause the query to be fetched again.
  - If the component is re-rendered with _different query variables_, that will cause the query to be fetched again with the new variables, and potentially re-render with different data.
  - If the component _unmounts and remounts_, that will cause the current query and variables to be refetched (depending on the `fetchPolicy` and the state of the cache).
- Note that if you re-render your component and pass different query variables than the ones originally used, it’ll cause the query to be fetched again with the new variables, and potentially re-render with different data.
- Finally, make sure you’re providing a Relay environment using a [`RelayEnvironmentProvider`](https://relay.dev/docs/api-reference/relay-environment-provider/) at the root of your app before trying to render a query, otherwise an error will be thrown.

---

## Recap

Relay is data-fetching turned declarative. Components declare their data dependencies, without worrying about how to fetch them. Relay’s compiler aggregates and optimizes the data requirements for your entire app and guarantees that the data each component needs is fetched and available.

:::note Fetching Patterns

Although there are different patterns for fetching data, we prefer the [“render-as-you-fetch”](https://reactjs.org/docs/concurrent-mode-suspense.html#approach-3-render-as-you-fetch-using-suspense) with [React Suspense](https://relay.dev/docs/guided-tour/rendering/loading-states/) powered by Relay over all others.

- **Fetch-on-render** (e.g., fetch in `useEffect`): Start rendering components. Each of these components may trigger data fetching in their effects and lifecycle methods. This approach often leads to “waterfalls”.
- **Fetch-then-render** (e.g., Relay without `Suspense`): Start fetching all the data for the next screen as early as possible. When the data is ready, render the new screen. We can’t do anything until the data arrives.
- **Render-as-you-fetch** (e.g., Relay with `Suspense`): Start fetching all the required data for the next screen as early as possible, and start rendering the new screen immediately — before we get a network response. As data streams in, React retries rendering components that still need data until they’re all ready.

:::

Relay requires a bit more up-front setup and tools, in favour of supporting an architecture of isolated components which can scale with your team and app complexity.

---
