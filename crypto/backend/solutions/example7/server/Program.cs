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
    .AddHttpClient(
        Constants.PriceInfoService, 
        c => c.BaseAddress = new("https://ccc-workshop-eu-functions.azurewebsites.net"));

builder.Services
    .AddDbContextPool<AssetContext>(o => o.UseSqlite("Data Source=assets.db"));

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
    .AddTypes()
    .AddUploadType()
    .AddFiltering()
    .AddSorting()
    .AddGlobalObjectIdentification()
    .AddMutationConventions()
    .AddInMemorySubscriptions()
    .AddInstrumentation(o =>
    {
        o.RenameRootActivity = true;
        o.IncludeDocument = true;
    })
    .RegisterDbContext<AssetContext>()
    .ModifyOptions(o => o.EnableDefer = true);

var app = builder.Build();

app.UseWebSockets();
app.UseCors(c => c.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseStaticFiles();
app.MapGraphQL();

app.RunWithGraphQLCommands(args);
