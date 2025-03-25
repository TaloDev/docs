---
sidebar_position: 14
description: Talo Channels add instant interactivity to your game. Channels can be used for player chats, sending event-based messages and more.
---

# Talo Socket

The Talo Socket is the underlying server that powers services like [channels](./channels.md) and handles connections, messages and events.

You can learn more about how the socket works [here](../sockets/intro.md).

## Usage

Ideally you should never need to use the socket directly because individual services like players and channels should send the correct data on your behalf. However, the Talo Socket exposes a few public methods and signals for custom logic like handling errors and re-connecting to the server if the connection is closed.

The socket connection is automatically established (this can disabled by setting `auto_connect_socket` to `false` in your config). When a player gets identified, they also get automatically identified with the socket server.

## Obtaining a socket ticket

To connect to the socket server, you need to obtain a socket ticket. This is done by calling `Talo.socket_tickets.create_ticket()`. Opening a socket connection using `Talo.socket.open_connection()` will automatically obtain a ticket and pass it as a query parameter to the socket URL.

## Receiving messages

The `message_received` signal provides you with a [response](../sockets/responses.md) and payload. For example, if you were building a chat system, you would connect a function similar to the one below to listen for new chat messages:

```gdscript
func _ready() -> void:
	Talo.socket.message_received.connect(_on_message_received)

func _on_message_received(res: String, data: Dictionary) -> void:
	if res == "v1.channels.message":
		if data.channel.id == _active_channel_id:
			var alias := TaloPlayerAlias.new(data.playerAlias)
			_add_chat_message("[%s] %s: %s" % [data.channel.name, alias.identifier, data.message])
```

## Sending messages

Generally, sending messages is handled by functions in services like `Talo.channels.send_message()` where the correct data is prepared and sent for you. You can also use the `Talo.socket.send(req, data)` function to send your own [requests](../sockets/requests.md):

```gdscript
func send_message(channel_id: int, message: String) -> void:
	if Talo.identity_check() != OK:
		return

	Talo.socket.send("v1.channels.message", {
		channel = {
			id = channel_id
		},
		message = message
	})
```

## Handling connection closures

The socket server can disconnect for a number of reasons such as the player going offline or being [rate limited](../sockets/common-errors.md#rate-limit-exceeded). The socket will emit a `connection_closed` signal with a status code and reason.

The recommended way of re-establishing a connection is calling `Talo.socket.open_connection()` and then re-identifying your player. This is the same logic that gets used internally when your game opens.

## Closing the connection

You can choose to manually end the socket connection using `Talo.socket.close_connection(status_code, reason)`.

## Error handling

The Talo Socket exposes an `error_received` signal that is emitted when a `v1.error` response is received. You can check the error code (using the `TaloSocketError.ErrorCode` enum), message and original request through the `TaloSocketError` object that is sent with the signal:

```gdscript
Talo.socket.error_received.connect(
	func (err: TaloSocketError):
		print("%s %s %s %s" % [err.req, err.code, err.message, err.cause])

		match err.code:
			TaloSocketError.ErrorCode.NO_PLAYER_FOUND:
				print("Player not identified yet!")
			TaloSocketError.ErrorCode.RATE_LIMIT_EXCEEDED:
				print("Rate limited!")
)
```
