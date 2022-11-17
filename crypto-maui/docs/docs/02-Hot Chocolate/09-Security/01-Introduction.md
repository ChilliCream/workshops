# Introduction

In this chapter, we will look at a couple of security concepts for GraphQL servers. We need to make a fundamental decision before choosing which security concepts are the best for our environment.

We need to decide if we have a public GraphQL API or a private GraphQL API.

**So, what does a public GraphQL API mean?**

Think about GitHub; GitHub has a public GraphQL API so that people can write extensions on top of GitHub to automate things like builds and whatnot.

However, most companies only have private GraphQL APIs, meaning a GraphQL API that is only used by themselves.

Meta, for instance, has a private GraphQL API. Although Meta uses its GraphQL API for Facebook and Instagram, it is a private GraphQL API because only Facebook's developers can use the GraphQL API to build things with it. The Graph API of Facebook that developers outside of Facebook can use is actually a REST API.

The same goes for Netflix; while the Netflix frontend uses GraphQL, the GraphQL API is private because only Netflix developers can use it.

Whether you want to create an API for external users or only for users within your company, define which security concepts are the best for your environment.

## Public GraphQL APIs

When we expose a GraphQL endpoint to external users, we have no control over what requests they will craft. In this scenario, we need to make sure that our servers do not get overwhelmed by overly large or complex requests. To ensure that we can control the pressure on the servers, we can do the following things.

1. Securing Introspection
2. Controlling Query Depth
3. Controlling Query Complexity

## Private GraphQL APIs

When we only use our GraphQL API within our own company to build tools, frontends, and whatnot, we actually can simplify security quite a lot.

There is a concept of advanced persisted queries which we can use to make communication with our server much more resilient and more performant.

We will explore each of the concepts mentioned here in the following exercises.
