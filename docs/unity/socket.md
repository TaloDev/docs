---
sidebar_position: 14
description: Talo Channels add instant interactivity to your game. Channels can be used for player chats, sending event-based messages and more.
---

# Talo Socket

The Talo Socket is the underlying server that powers services like [channels](./channels.md) and handles connections, messages and events.

You can learn more about how the socket works [here](../sockets/intro.md).

## Usage

Ideally you should never need to use the socket directly because individual services like players and channels should send the correct data on your behalf. However, the Talo Socket exposes a few public methods and signals for custom logic like handling errors and re-connecting to the server if the connection is closed.

The socket connection is automatically established (this can disabled by setting `autoConnectSocket` to `false` in your config). When a player gets identified, they also get automatically identified with the socket server.

## Receiving messages

The `OnMessageReceived` event provides you with a [response](../sockets/responses.md) and payload. For example, if you were building a chat system, you would connect a function similar to the one below to listen for new chat messages:

```csharp
private void Start()
{
	Talo.Socket.OnMessageReceived += OnMessageReceived;
}

private void OnDestroy()
{
	Talo.Socket.OnMessageReceived -= OnMessageReceived;
}

...

private void OnMessageReceived(SocketResponse response)
{
	if (response.GetResponseType() == "v1.channels.message")
	{
		var data = response.GetData<ChannelMessageResponse>();
		if (data.channel.id == activeChannelId)
		{
			AddMessage($"[{data.channel.name}] {data.playerAlias.identifier}: {data.message}");
		}
	}
}
```

## Sending messages

Generally, sending messages is handled by functions in services like `Talo.Channels.SendMessage()` where the correct data is prepared and sent for you. You can also use the `Talo.Socket.Send()` function to send your own [requests](../sockets/requests.md):

```csharp
public void SendMessage(int channelId, string message)
{
	Talo.IdentityCheck();

	var payload = new ChannelMessageRequest
	{
		channel = new ChannelMessageRequest.ChannelStub { id = channelId },
		message = message
	};

	Talo.Socket.Send(new SocketRequest<ChannelMessageRequest>("v1.channels.message", payload));
}
```

## Handling connection closures

The socket server can disconnect for a number of reasons such as the player going offline or being [rate limited](../sockets/common-errors.md#rate-limit-exceeded). The socket will emit a `OnConnectionClosed` event with a status code and reason.

The recommended way of re-establishing a connection is calling `Talo.Socket.OpenConnection()` and then re-identifying your player. This is the same logic that gets used internally when your game opens.

## Closing the connection

You can choose to manually end the socket connection using `Talo.Socket.CloseConnection()`.
