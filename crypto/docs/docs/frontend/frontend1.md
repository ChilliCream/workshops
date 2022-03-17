# A Developer’s Guide to GraphQL

_Introduction: Why Relay_

## Why use GraphQL?

GraphQL is a query language that sits on top of multiple APIs and provides a complete description of data requested by an application.

With GraphQL, an app can specify the exact data it needs, aggregate the data from multiple sources and return only what was requested, resulting in highly performant and robust APIs.

- **Highly Performant**:
  Construct specific, hierarchical queries and deliver the results lightning fast.

- **Ahead-of-time Safety**:
  Increase developer productivity through ahead of time validation and type checking.

- **Unified API**:
  Unify multiple microservices and third-party APIs in one GraphQL API gateway.

- **Version Free**:
  Update data structure without affecting existing queries and phase out obsolete structures over time.

## How to GraphQL?

Relay is a GraphQL client library maintained by Facebook and enables rapid client-side data fetching in React applications. Relay is designed for high performance at any scale.

- **Keeps Iteration Quick**:
  Relay is data-fetching turned declarative. Components declare their data dependencies, without worrying about how to fetch them. Relay guarantees that the data each component needs is fetched and available.

- **Automatic Optimizations**:
  Relay’s compiler aggregates and optimizes the data requirements for your entire app, so that they can be efficiently fetched in a single GraphQL request.

- **Data Consistency**:
  Relay automatically keeps all of your components up to date when data that affects them changes, and efficiently updates them only when strictly necessary. This means no unnecessary re-renders.
