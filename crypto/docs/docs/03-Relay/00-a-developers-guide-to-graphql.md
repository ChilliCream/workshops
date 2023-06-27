# A Developer’s Guide to GraphQL

Thousands of products now use GraphQL APIs. The largest internet companies in the world like Facebook, Twitter, Netflix, and GitHub are all running on top GraphQL.

GraphQL has proven itself to be a strong choice when building frontend apps. They just scale and it often makes the code more readable and maintainable.

---

## Why Use GraphQL?

GraphQL is a data query language designed for API. The language is meant to be declarative, strongly typed and exhaustive.

With GraphQL, an app can specify the exact data it needs, aggregate the data from multiple sources and return only what was requested, resulting in highly performant and robust APIs.

- **Highly Performant**:
  Clients have the power to ask for what they need and get exactly that, nothing more and nothing less, which leads to better UX especially on slow network connections.
- **Ahead-Of-Time Safety**:
  GraphQL has a type system in its core principles. We can use it to make type-safe API calls by propagating our backend types to the frontend.
- **Unified API**:
  Typical REST APIs require loading from multiple URLs, with GraphQL APIs we get all the data needed in a single request.
- **Version Free**:
  While there is nothing that prevents a GraphQL service from being versioned just like any other REST API, you can avoid versioning by providing new capabilities via new types and fields without creating a breaking change.

---

## How to GraphQL?

[Relay](https://relay.dev/) is a GraphQL client library maintained by Meta and enables rapid client-side data fetching in React applications. Relay is designed for high performance at any scale.

- **Keeps Iteration Quick**:
  Relay is data-fetching turned declarative. Components declare their data dependencies, without worrying about how to fetch them. Relay guarantees that the data each component needs is fetched and available. Furthermore, each component can only access the fields it has requested and nothing else (aka data masking).
- **Automatic Optimisations**:
  Relay handles the heavy lifting to ensure the data declared by your components is fetched in the most efficient way. For example, by deduplicating identical fields, and precomputing information used at runtime, among other optimisations.
- **Data Consistency**:
  Relay automatically keeps all of your components up to date when data that affects them changes, and efficiently updates them only when strictly necessary. This means no unnecessary re-renders.
- **Type Emission**:
  Relay generates Flow or TypeScript types for each of your React components that use Relay, which represent the data that each component receives, so you can make changes more quickly and safely while knowing that correctness is guaranteed.

---
