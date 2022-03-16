---
sidebar_position: 2
---

# Creating a GraphQL Server

In this chapter we will create a basic GraphQL server with Hot Chocolate and write our first GraphQL query to ensure that our server works properly.

## Prerequisites

Before we can start lets ensure that out computer is setup properly.

1. Install .NET 6 (https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
3. Install Visual Studio Code (https://code.visualstudio.com)

## Creating a Hello World GraphQL Server

First lets create a directory where we can put our GraphQL server.

```bash
mkdir BasicServer
```

In order to ensure that we use the correct version of .NET in our demo server we will generate a `global.json`.

```bash
dotnet new globaljson
```

Ensure, that version 6.0.100 or above is being used. The `global.json` file should look something like the following:

```json
{
  "sdk": {
    "version": "6.0.100",
    "rollForward": "minor"
  }
}
```

Before we can generate our server project, we need to install the Hot Chocolate templates.

```bash
dotnet new -i HotChocolate.Templates::13.0.0-preview.12
```

Now that we have everything in place we can generate the actual server project.

```bash
dotnet new graphql
dotnet restore
```

With this we already have a working GraphQL server that we could already query.