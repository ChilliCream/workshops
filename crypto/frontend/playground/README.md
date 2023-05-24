# Examples

The purpose of these examples is to introduce some topics and use them as a guide throughout the workshop. You’ll find them in the folders `playground`.

We’ll guide you _step-by-step_ and we’ll iterate several times to cover each topic.

In order to start an example we’ll copy some folders (e.g., client, generated, pages, scenes, schema) into the root using the following command:

```sh
yarn goto playground/1-hello.1
```

You can also create your own folders and use the same `goto` script to setup the sandbox:

```sh
yarn goto playground/mysandbox
```

Due to the time constraints of the workshop and the different knowledge levels of the attendees, we recommend that you follow the already prepared examples just reading the code and interacting with the application and maybe then you can practice re-writing some blocks, but if you prefer you can write it all from scratch or copy only some parts, such as presentation details or scaffolding files.

## Outline

- Preparations

  - Prerequisites

  - Requirements

  - Setup

  - Examples

  - Preflight Checklist

- Hello, World!

  - Getting Started

    → React Components

    → Next.js Routing, `App` and `Document`

    → Next.js in Development Mode

  - Fetching without Relay

  - Fetching with Relay

    - Adding Relay to Our Project

      → Include Dependencies

      → Configure Relay Compiler

      → Configure Relay Runtime

    - Executing a Query

      → Loading States with `Suspense`

      → Refreshing and Refetching

  - Recap

    → Fetching Patterns

- On-Demand Data

  - Rethinking Data Fetching

    - Specifying the Data Requirements of a Component

      → `useFragment`

      → `useRefetchableFragment` and `@refetchable`

      → **PRO-TIP** Accessible Colors

    - Composing Fragments into Queries

      → `useLazyLoadQuery`

    - Data Masking

    - Data Flow

  - Rendering Lists

    - Pagination

      → `usePaginationFragment` and `@refetchable`

      → `refetch` and `@refetchable`

    - Sorting and Filtering

  - Advanced Rendering

    - Transitions Are Everywhere

      → `useTransition`

      → `useDeferredValue`

    - Composing at Scale

      → `SuspenseList` and `@defer`

- Mutating Data

  - Writing Mutations

    → Optimistic and Regular Updaters

    - File Upload

- Real-Time Data

  - Writing Subscriptions

    → Optimistic and Regular Updaters

- Add-Ons

  - Testing
