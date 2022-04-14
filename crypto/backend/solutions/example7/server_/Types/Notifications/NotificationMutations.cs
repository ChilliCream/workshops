using Demo.Types.Errors;
using HotChocolate.Subscriptions;
using static Demo.Constants;

namespace Demo.Types.Notifications;

[ExtendObjectType(OperationTypeNames.Mutation)]
public sealed class NotificationMutations
{
    [Error<InvalidTargetPriceException>]
    [Error<UnknownCurrencyException>]
    [UseMutationConvention(PayloadFieldName = "createdAlert")]
    public async Task<Alert?> CreateAlertAsync(
        CreateAlertInput input,
        [GlobalState] string username,
        AssetContext context,
        AssetPriceBySymbolDataLoader assetPriceBySymbol,
        CancellationToken cancellationToken)
    {
        if (input.TargetPrice <= 0)
        {
            throw new InvalidTargetPriceException(input.TargetPrice);
        }

        if (!input.Currency.Equals("USD"))
        {
            throw new UnknownCurrencyException(input.Currency);
        }

        var price = await assetPriceBySymbol.LoadAsync(input.Symbol, cancellationToken);
        double change = input.TargetPrice - price.LastPrice;
        double percentageChange = change / price.LastPrice;

        var alert = new Alert
        {
            AssetId = price.AssetId,
            PercentageChange = percentageChange,
            TargetPrice = input.TargetPrice,
            Currency = input.Currency,
            Recurring = input.Recurring,
            Username = username
        };

        context.Alerts.Add(alert);
        await context.SaveChangesAsync(cancellationToken);

        return alert;
    }

    [Error<EntityNotFoundException>]
    [UseMutationConvention(PayloadFieldName = "deletedAlert")]
    public async Task<Alert?> DeleteAlertAsync(
        [ID(nameof(Alert))] int alertId,
        AssetContext context,
        CancellationToken cancellationToken)
    {
        var alert = await context.Alerts.FirstOrDefaultAsync(t => t.Id == alertId, cancellationToken);

        if (alert is null)
        {
            throw new EntityNotFoundException(alertId);
        }

        context.Alerts.Remove(alert);
        await context.SaveChangesAsync(cancellationToken);

        return alert;
    }
}
