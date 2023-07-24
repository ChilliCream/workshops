using Demo.Types.Assets;
using Demo.Types.Errors;
using HotChocolate.Subscriptions;

namespace Demo.Types.Notifications;

[MutationType]
public static class NotificationMutations
{
    [Error<InvalidTargetPriceException>]
    [Error<UnknownCurrencyException>]
    [UseMutationConvention(PayloadFieldName = "createdAlert")]
    public static async Task<Alert?> CreateAlertAsync(
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
    public static async Task<Alert?> DeleteAlertAsync(
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

    [Error<UnknownNotificationException>]
    [UseMutationConvention(PayloadFieldName = "readNotification")]
    public static async Task<Notification?> MarkNotificationReadAsync(
        [ID(nameof(Notification))] int notificationId,
        [GlobalState] string username,
        AssetContext context,
        [Service] ITopicEventSender eventSender,
        CancellationToken cancellationToken)
    {
        var notification = await context.Notifications.FirstOrDefaultAsync(
            t => t.Id == notificationId && t.Username == username,
            cancellationToken);

        if (notification is null)
        {
            throw new UnknownNotificationException(notificationId);
        }

        notification.Read = true;
        await context.SaveChangesAsync(cancellationToken);

        await eventSender.SendAsync<NotificationUpdate>(Constants.OnNotification(username), new(), cancellationToken);

        return notification;
    }

    [Error<UnknownNotificationException>]
    [UseMutationConvention(PayloadFieldName = "readNotifications")]
    public static async Task<IReadOnlyList<Notification>?> MarkNotificationsReadAsync(
        [ID(nameof(Notification))] int[] notificationIds,
        [GlobalState] string username,
        AssetContext context,
        [Service] ITopicEventSender eventSender,
        CancellationToken cancellationToken)
    {
        var notifications = await context.Notifications.Where(
            t => notificationIds.Contains(t.Id) && t.Username == username)
            .ToListAsync(cancellationToken);

        if (notificationIds.Length != notifications.Count)
        {
            throw new UnknownNotificationException(
                notificationIds.Except(notifications.Select(t => t.Id)).ToArray());
        }

        foreach (Notification notification in notifications)
        {
            notification.Read = true;
        }

        await context.SaveChangesAsync(cancellationToken);

        await eventSender.SendAsync<NotificationUpdate>(Constants.OnNotification(username), new(), cancellationToken);

        return notifications;
    }

    [Error<UnknownNotificationException>]
    [UseMutationConvention(PayloadFieldName = "deletedNotification")]
    public static async Task<Notification?> DeleteNotificationAsync(
        [ID(nameof(Notification))] int notificationId,
        [GlobalState] string username,
        AssetContext context,
        [Service] ITopicEventSender eventSender,
        CancellationToken cancellationToken)
    {
        var notification = await context.Notifications.FirstOrDefaultAsync(
            t => t.Id == notificationId && t.Username == username,
            cancellationToken);

        if (notification is null)
        {
            throw new UnknownNotificationException(notificationId);
        }

        notification.Read = true;
        await context.SaveChangesAsync(cancellationToken);

        await eventSender.SendAsync<NotificationUpdate>(Constants.OnNotification(username), new(), cancellationToken);

        return notification;
    }

    [Error<UnknownNotificationException>]
    [UseMutationConvention(PayloadFieldName = "deletedNotifications")]
    public static async Task<List<Notification>?> DeleteNotificationsAsync(
        [ID(nameof(Notification))] int[] notificationIds,
        [GlobalState] string username,
        AssetContext context,
        [Service] ITopicEventSender eventSender,
        CancellationToken cancellationToken)
    {
        var notifications = await context.Notifications.Where(
            t => notificationIds.Contains(t.Id) && t.Username == username)
            .ToListAsync(cancellationToken);

        if (notificationIds.Length != notifications.Count)
        {
            throw new UnknownNotificationException(
                notificationIds.Except(notifications.Select(t => t.Id)).ToArray());
        }

        context.Notifications.RemoveRange(notifications);
        await context.SaveChangesAsync(cancellationToken);

        await eventSender.SendAsync<NotificationUpdate>(Constants.OnNotification(username), new(), cancellationToken);

        return notifications;
    }
}