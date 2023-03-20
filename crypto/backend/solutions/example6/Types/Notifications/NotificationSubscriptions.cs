using HotChocolate.Subscriptions;

namespace Demo.Types.Notifications;

[SubscriptionType]
public static class NotificationSubscriptions
{
    [Subscribe(With = nameof(CreateOnNotificationStream))]
    public static NotificationUpdate OnNotification(
        [EventMessage] NotificationUpdate message)
        => message;

    public static IAsyncEnumerable<NotificationUpdate> CreateOnNotificationStream(
        [GlobalState] string username,
        [Service] ITopicEventReceiver receiver,
        [Service] IServiceProvider services)
        => new OnNotificationUpdateStream(username, receiver, services);

    private sealed class OnNotificationUpdateStream : IAsyncEnumerable<NotificationUpdate>
    {
        private readonly string _username;
        private readonly ITopicEventReceiver _receiver;
        private readonly IServiceProvider _services;

        public OnNotificationUpdateStream(
            string username,
            ITopicEventReceiver receiver,
            IServiceProvider services)
        {
            _username = username;
            _receiver = receiver;
            _services = services;
        }

        public async IAsyncEnumerator<NotificationUpdate> GetAsyncEnumerator(CancellationToken cancellationToken = default)
        {
            if (_username is null)
            {
                throw new GraphQLException("You need to be signed in for this subscription!");
            }

            await using (var scope = _services.CreateAsyncScope())
            {
                await using var context = scope.ServiceProvider.GetRequiredService<AssetContext>();
                {
                    if (await context.Notifications.AnyAsync(t => t.Username == _username, cancellationToken))
                    {
                        yield return new();
                    }
                }
            }

            var stream = await _receiver.SubscribeAsync<NotificationUpdate>(
                Constants.OnNotification(_username),
                cancellationToken);

            await foreach (NotificationUpdate message in
                stream.ReadEventsAsync().WithCancellation(cancellationToken))
            {
                yield return message;
            }
        }
    }
}