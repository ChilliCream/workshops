# Observability

As we have learned during this workshop, GraphQL provides great flexibility and ease of use for the API consumer. The flexibility for the consumer also comes with complexity for the backend in the production system.

How do we evaluate if our GraphQL endpoint is doing well? How do we spot issues where our resolvers may be causing performance issues.

In this chapter we will try to identify and solve some issues in our coin service implementation.

## Inspection

The first step in solving our issues is identifying them. Our client has a couple of queries and we have found that depending of the component in our client we have some high pressure on the backend. We identified that we mainly get high pressure on our system whenever we navigate to a list of charts. Further, we found that listing the top gainers of the day will put a strain on our system.

We identified the two GraphQL requests that are issued by the components.

**GetTopGainerPrices**

```graphql
query GetTopGainerPrices{
  assets(order: { price: { change24Hour: DESC} }) {
    nodes{
      symbol
      name
      description
      imageUrl
      price {
        lastPrice
        change24Hour
      }
    }
  }
}
```

**GetChartData**

```graphql
query GetChartData{
  assets(order: { price: { change24Hour: DESC} }) {
    nodes{
      symbol
      name
      description
      imageUrl
      price {
        lastPrice
        change24Hour
        day: change(span: DAY) {
          percentageChange
          history {
            nodes {
              epoch
              price
            }
          }
        }
        week: change(span: WEEK) {
          percentageChange
          history {
            nodes {
              epoch
              price
            }
          }
        }
        month: change(span: MONTH) {
          percentageChange
          history {
            nodes {
              epoch
              price
            }
          }
        }
      }
    }
  }
}
```

There are a couple of approaches towards analyzing the performance issues. We could inspect each resolver and try to reason out the impact on our system. This approach might be working on a small solution but becomes difficult in cases where we have a large graph with maybe hundreds of different requests.

We also could use something like Apollo Tracing and analyze the resolver impact. Again this approach might be good for smaller solutions but does not scale. Further, we do not really get a sense of the impact we have on other systems. In our case we are using a REST service for some requests and the REST service might be the one causing the issues in at least one of the requests.

Instead of manually probing or monitoring our system we want to use observability to get informed whenever our system exposes characteristics that are out of place. True observability was quite a complex topic in the past since we would need to combine tracing, logging and metrics from different systems. Further we would need to make sure that we correlate all of these data correctly.

## OpenTelemetry

OT INTRODUCTION.




## Elastic APM

