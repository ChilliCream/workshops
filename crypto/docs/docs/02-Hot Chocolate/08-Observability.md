# Observability

As we have learned during this workshop, GraphQL provides great flexibility and ease of use for the API consumer. The flexibility for the consumer also comes with complexity for the backend in the production system.

How do we evaluate if our GraphQL endpoint is doing well? How do we spot issues where our resolvers may be causing performance issues.

In this chapter we will try to identify and solve some issues in our coin service implementation.

The first step in solving our issues is identifying them.


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

## OpenTelemetry

## Elastic APM

