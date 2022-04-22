using HotChocolate.Diagnostics;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

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

builder.Services
    .AddSingleton<ActivityEnricher, CustomActivityEnricher>();

var api = ResourceBuilder.CreateEmpty()
    .AddService("Coin-API", "Demo", "2.0.0")
    .AddAttributes(new KeyValuePair<string, object>[]
    {
        new("deployment.environment", "development"),
        new("telemetry.sdk.name", "dotnet"),
        new("telemetry.sdk.version", "2.0.0")
    });

builder.Services.AddOpenTelemetryTracing(
    b =>
    {
        b.AddHttpClientInstrumentation();
        b.AddAspNetCoreInstrumentation();
        b.AddHotChocolateInstrumentation();
        b.SetResourceBuilder(api);
        b.AddOtlpExporter(c =>
        {
        });
    });

builder.Services.AddOpenTelemetryMetrics(
    b =>
    {
        b.AddHttpClientInstrumentation();
        b.AddAspNetCoreInstrumentation();
        b.SetResourceBuilder(api);
        b.AddOtlpExporter(c =>
        {
        });
    });

var app = builder.Build();

app.UseWebSockets();
app.UseCors(c => c.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseStaticFiles();
app.MapGraphQL();

app.Run();
