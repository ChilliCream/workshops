# Add-ons

## Relay DevTools

You can inspect data in the store of your Relay apps, and how that data changes over time in response to GraphQL queries, and client mutations by adding the extension [Relay Developer Tools](https://chrome.google.com/webstore/detail/relay-developer-tools/ncedobpgnmkhcmnnkcimnobpfepidadl) to the Chrome Developer Tools.

For more information, read the docs [here](https://relay.dev/docs/debugging/relay-devtools/).

## Persisted Queries

The Relay compiler supports persisted queries. This is useful because:

- The client operation text becomes just an md5 hash which is usually shorter than the real query string. This saves upload bytes from the client to the server.

- The server can now whitelist queries which improves security by restricting the operations that can be executed by a client.

You have the possibility to persist the queries:

- **Remote**: using a sever endpoint that will process and identify the queries.

- **Local**: using a local file where the compiler will write a map for the queries.

For more information, read the docs [here](https://relay.dev/docs/guides/persisted-queries/#executing-persisted-queries-on-the-server) and [here](https://github.com/facebook/relay/tree/main/packages/relay-compiler).

## Type Emission

As part of its normal work, the [Relay Compiler](https://relay.dev/docs/guides/compiler/) will emit type information for your language of choice (i.e. javascript, typescript, flow) that helps you write type-safe application code. These types are included in the artifacts that `relay-compiler` generates to describe your operations and fragments.

For more information, read the docs [here](https://relay.dev/docs/guides/type-emission/).
