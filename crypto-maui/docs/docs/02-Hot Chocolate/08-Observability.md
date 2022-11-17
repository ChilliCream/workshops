# Observability

As we have learned during this workshop, GraphQL provides great flexibility and ease of use for the API consumer. The flexibility for the consumer also comes with complexity for the back-end.

How do we evaluate if our GraphQL endpoint is doing well? How do we spot issues where our resolvers may be causing performance issues? With REST, we could test all our requests and ensure they will perform well, but with GraphQL, the consumer defines the requests.

In this chapter, we will try to identify and solve some issues in our coin service implementation.

## Inspection

The first step in solving our issues is identifying them. Our client has a couple of queries, and we have found that depending on the component in our client, we have some high pressure on the back-end. We identified that we mainly get high pressure on our system whenever we navigate to our price charts. Further, we found that listing the top gainers of the day will strain our system.

We identified the two GraphQL requests that are issued by the components.

**GetTopGainerPrices**

```graphql
query GetTopGainerPrices {
  assets(order: {price: {change24Hour: DESC}}) {
    nodes {
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
query GetChartData {
  assets(order: {price: {change24Hour: DESC}}) {
    nodes {
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

There are a couple of approaches to analyzing the performance issues. We could inspect each resolver and try to reason out the impact on our system. This approach might be working on a small solution but becomes difficult in cases where we have a large graph with maybe hundreds of different requests.

We also could use something like Apollo Tracing and analyze the resolver impact. Again this approach might be good for smaller solutions but does not scale. Further, we do not get a sense of the impact our service has on other downstream systems. In our case, we are using a REST service for some requests, and the REST service might be the one causing the issues in at least one of the requests.

Instead of manually probing or monitoring our system, we want to use observability to get informed whenever our system exposes characteristics that are out of place. True observability was quite a complex topic in the past since we would need to combine tracing, logging, and metrics from different systems. Further, we need to make sure that we correlate all of these data correctly. This is where OpenTelemetry comes in to help us.

## OpenTelemetry

OpenTelemetry is a set of APIs, SDKs, tooling, and integrations that are designed for the creation and management of telemetry data such as traces, metrics, and logs. The project provides a vendor-agnostic implementation that can be configured to send telemetry data to the back-end (s) of your choice. It supports a variety of popular open-source projects, including Jaeger, Prometheus, and Elastic.

OpenTelemetry supports exporting data to a variety of open-source and commercial back-ends. It provides a pluggable architecture so additional technology protocols and formats can be easily added.

OpenTelemetry is not an observability solution itself but allows us to instrument components in a standardized way and correlate traces, logs, and metrics so that we can feed them into an observability solution.

## Hot Chocolate Instrumentation

Let's start and instrument our coin service. We have already added the needed packages to our service for **OpenTelemetry** and the **Hot Chocolate** instrumentation.

Head over to the `Program.cs` and add the **OpenTelemetry** service description at the top of the file.

```csharp
var api = ResourceBuilder.CreateEmpty()
    .AddService("Coin-API", "Demo", "2.0.0")
    .AddAttributes(new KeyValuePair<string, object>[]
    {
        new("deployment.environment", "development"),
        new("telemetry.sdk.name", "dotnet"),
        new("telemetry.sdk.version", "2.0.0")
    });
```

Next, we need to register the **OpenTelemetry** services for tracing and metrics.

```csharp
builder.Services
    .AddOpenTelemetryTracing(
        b =>
        {
            b.AddHttpClientInstrumentation();
            b.AddAspNetCoreInstrumentation();
            b.AddHotChocolateInstrumentation();
            b.SetResourceBuilder(api);
            b.AddOtlpExporter();
        })
    .AddOpenTelemetryMetrics(
        b =>
        {
            b.AddHttpClientInstrumentation();
            b.AddAspNetCoreInstrumentation();
            b.SetResourceBuilder(api);
            b.AddOtlpExporter();
        });
```

We added listeners for `HttpClient`, `AspNetCore` and `HotChocolate` instrumentation events.

Further, we need to instrument the schema so that **Hot Chocolate** will raise diagnostic events.

```csharp
builder.Services
    .AddGraphQLServer()
    .AddQueryType()
    .AddMutationType()
    .AddSubscriptionType()
    .AddAssetTypes()
    .AddType<UploadType>()
    .AddGlobalObjectIdentification()
    .AddMutationConventions()
    .AddFiltering()
    .AddSorting()
    .AddInMemorySubscriptions()
    .AddInstrumentation(o => // <----
    {
        o.RenameRootActivity = true;
        o.IncludeDocument = true;
    })
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);
```

We specified two options for our instrumentation events.

`RenameRootActivity` will rename the root instrumentation span to include the GraphQL operation name. In our case, the root instrumentation span would be the ASP.NET Core HTTP event, which is an HTTP Post to the `/graphql` route in almost all cases. By rewriting the name of the root span, we make it more useful for our observability back-end.

`IncludeDocument` will report the full GraphQL query as metadata of the GraphQL instrumentation events.

The **Hot Chocolate** instrumentation events can be enriched with more information. In our case, we want to customize how the root activity is renamed. More specifically, we want to remove the route information since it is always `/graphql`.

Create a new file located at the project's root called `CustomActivityEnricher.cs`.

```csharp title="/Types/CustomActivityEnricher.cs"
using System.Diagnostics;
using System.Text;
using HotChocolate.Diagnostics;
using Microsoft.Extensions.ObjectPool;

namespace Demo;

public class CustomActivityEnricher : ActivityEnricher
{
    public CustomActivityEnricher(ObjectPool<StringBuilder> stringBuilderPoolPool, InstrumentationOptions options)
        : base(stringBuilderPoolPool, options)
    {
    }

    protected override string CreateRootActivityName(Activity activity, Activity root, string displayName)
    {
        if (root.GetCustomProperty("originalDisplayName") is not string)
        {
            root.SetCustomProperty("originalDisplayName", root.DisplayName);
        }
        return displayName;
    }
}
```

Next, we need to register our activity enricher as a service.

```csharp
builder.Services.AddSingleton<ActivityEnricher, CustomActivityEnricher>();
```

Our `Program.cs` should now look like the following.

```csharp
using HotChocolate.Diagnostics;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var api = ResourceBuilder.CreateEmpty()
    .AddService("Coin-API", "Demo", "2.0.0")
    .AddAttributes(new KeyValuePair<string, object>[]
    {
        new("deployment.environment", "development"),
        new("telemetry.sdk.name", "dotnet"),
        new("telemetry.sdk.version", "2.0.0")
    });

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddHttpContextAccessor()
    .AddCors()
    .AddHelperServices();

builder.Services
    .AddPooledDbContextFactory<AssetContext>(o => o.UseSqlite("Data Source=assets.db"));

builder.Services
    .AddHttpClient(Constants.PriceInfoService, c => c.BaseAddress = new("https://ccc-workshop-eu-functions.azurewebsites.net"));

builder.Services
    .AddOpenTelemetryTracing(
        b =>
        {
            b.AddHttpClientInstrumentation();
            b.AddAspNetCoreInstrumentation();
            b.AddHotChocolateInstrumentation();
            b.SetResourceBuilder(api);
            b.AddOtlpExporter();
        })
    .AddOpenTelemetryMetrics(
        b =>
        {
            b.AddHttpClientInstrumentation();
            b.AddAspNetCoreInstrumentation();
            b.SetResourceBuilder(api);
            b.AddOtlpExporter();
        })
    .AddSingleton<ActivityEnricher, CustomActivityEnricher>();

builder.Services
    .AddGraphQLServer()
    .AddQueryType()
    .AddMutationType()
    .AddSubscriptionType()
    .AddAssetTypes()
    .AddType<UploadType>()
    .AddGlobalObjectIdentification()
    .AddMutationConventions()
    .AddFiltering()
    .AddSorting()
    .AddInMemorySubscriptions()
    .AddInstrumentation(o =>
    {
        o.RenameRootActivity = true;
        o.IncludeDocument = true;
    })
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);

var app = builder.Build();

app.UseWebSockets();
app.UseCors(c => c.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseStaticFiles();
app.MapGraphQL();

app.Run();
```

With this, our service is set up and ready to report **OpenTelemetry** events. We have configured our service to export events with the `OTLP` protocol exporter.

## Elastic APM

We will use **Elastic APM** to analyze telemetry data. We have prepared an elastic cluster with `docker compose`.

Head over to the `./crypto/back-end/playground/example7/elastic` directory and use docker compose to run the cluster on your system.

```bash
cd ./crypto/backend/playground/example7/elastic
docker compose up
```

Once the cluster is up and running, head over to `http://localhost:5601/` and ensure that you can log in.

:::info

URL: **http://localhost:5601/**

Username: **admin**

Password: **elastic**

:::

Now, that our ..
