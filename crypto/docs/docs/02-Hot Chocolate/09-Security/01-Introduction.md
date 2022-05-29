# Introduction

In this chapter we will have a look at a couple of security concepts. There are a couple of fundamental decision we need to do before choosing which security concepts are needed for a GraphQL server.

First we need to decide if we have a public API or a private API. A public API is an API where we allow others to use it. 

So what does a public API mean?

Think about GitHub, GitHub has a public GraphQL API so that people can write extensions on top of GitHub and can automate things.

Most companies however really only have a private GraphQL API, meaning a GraphQL API that is only used by themselves. Facebook for instance has a private GraphQL API. Although, the GraphQL API is used by Facebook, Instagram, Whats App and so on its private in the sense that only Facebook developers can use the GraphQL API to build things with it. The Graph API of Facebook that developers outside of Facebook use is actually a REST API.

Same goes for Netflix, while the Netflix frontend uses GraphQL, the GraphQL API is private in the sense that only Netflix developers can use it.

Depending on whether you want to create an API for external users or only for users within your company we can use different security concepts.

## Security Concepts for Public GraphQL APIs

