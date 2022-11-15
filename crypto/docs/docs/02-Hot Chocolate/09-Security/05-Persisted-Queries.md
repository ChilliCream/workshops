# Persisted Queries

Most often you hear about persisted queries when we are talking about performance. There are in general two flavors of persisted queries. 

## Standard Persisted Queries

The standard persisted queries Facebook came up with are stored on the server at deployment time. Essentially, the GraphQL client will use a compiler to strip queries from the client code and replace it with a query identifier. The stripped GraphQL queries are then uploaded to the server.

The server can be configured to only allow persisted queries at runtime creating a secure and highly optimized server.

Example for this kind of setup are Facebook or Twitter.

## Automatic Persisted Queries

Automatic persisted queries stay in the client code, and the GraphQL client will probe the server for persisted queries and dynamically upload them when they do not exist on the server.

Automatic persisted queries do not come with the security benefits of the standard persisted queries but allow for reducing the request size for the standard use case.

## Further Reading

- [Why you should consider using persisted queries.](https://www.youtube.com/watch?v=ZZ5PF3_P_r4)
- [Relay Documentation](https://relay.dev/docs/guides/persisted-queries)
