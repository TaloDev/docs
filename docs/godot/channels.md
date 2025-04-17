---
sidebar_position: 15
description: Talo Channels add instant interactivity to your game. Channels can be used for player chats, sending event-based messages and more.
---

# Channels

Talo Channels are a way of passing messages between players that are subscribed to a specific topic. Channels can be used for player chats, sending arbitrary JSON to various groups and pushing game updates directly to clients.

You can learn more about channel [here](https://trytalo.com/channels).

## Listing channels

To get all available channels for your game, use the `Talo.channels.get_channels()` function. This is a paginated function which takes a single `page` parameter.

This function returns an array with 3 items: the channels, the total number of channels (if they weren't paginated) and if this is the last page.

```gdscript
var page := 0
var res := await Talo.channels.get_channels(page)
var channels: Array[GameChannel] = res.channels
var count: int = res.count
var is_last_page: bool = res.is_last_page
```

## Listing subscribed channels

You can use `Talo.channels.get_subscribed_channels()` to find out which channels the current player is subscribed to. This returns an array of `TaloChannel`.

## Creating a channel

To create a channel, call `Talo.channels.create()` with a channel name and (optionally) the auto cleanup value and/or props. When auto cleanup is enabled, the channel will be deleted when the owner or the last subscribed member leaves. Props (a dictionary of string key/value pairs) are a way of adding arbitrary data to your channels in the same way as you would for events, players and leaderboards.

```gdscript
var channel := await Talo.channels.create("channel name", true, {})

print(channel.name) # channel name
print(channel.auto_cleanup) # true
print(channel.props) # {}
```

## Joining and leaving channels

To join or leave a channel, use `Talo.channels.join()` and `Talo.channels.leave()` respectively. Both functions take the ID of the channel as the only parameter. If you attempt to join a channel and the current player is already in that channel, nothing will happen. Leaving a channel also follows the same pattern.

## Finding a channel

You can find a channel by its ID using `Talo.channels.find()`. This function takes a channel ID integer and returns a `TaloChannel` object.

## Updating channels

The owner of a channel can update the channel using `Talo.channels.update()`. The name and owner of the channel can be updated using this function.

To transfer ownership of the channel, you should specify the ID of the player alias that will own the channel. The new owner of the channel must be a member first before ownership can be transferred.

You can also update the props of the channel: keys will be overrided with new values and keys with a value of `null` will be deleted.

## Deleting channels

The owner of a channel can delete the channel using `Talo.channels.delete()`. All other members of the channel will be unsubscribed automatically.

## Private channels

You can also create an invite-only private channels by providing `Talo.channels.create()` with a last parameter set to `true`:

```gdscript
var channel := await Talo.channels.create("channel name", true, {}, true)
print(channel.private) # true
```

Private channels will not be listed when using `Talo.channels.get_channels()`. They also cannot be joined in the same way: the channel owner must invite players to a private channel.

### Channel invites

To create a channel invite, use `Talo.channels.invite()` with a channel ID and player alias ID.

Invited players will automatically join the channel.

```gdscript
var channel := await Talo.channels.create("channel name", true, {}, true)
await Talo.channels.invite(channel.id, invitee_player_alias.id)
```

Note: you can use invites for public channels too.

## Listening for messages

To listen for messages, you can use the `Talo.channels.message_received` signal. This signal will return the `TaloPlayerChannel`, the sender's`TaloPlayerAlias` and the message.

Here's an example of how to use this signal to update a chat UI:

```gdscript
func _ready():
	Talo.channels.message_received.connect(_on_message_received)

func _on_message_received(channel: TaloChannel, player_alias: TaloPlayerAlias, message: String) -> void:
	if channel.id == _active_channel_id:
		_add_chat_message("[%s] %s: %s" % [channel.name, player_alias.identifier, message])

```

### Listening for other events

You can also listen for the following signals:
- `player_joined`: Emitted when a player joins a channel. Returns the `TaloChannel` and the `TaloPlayerAlias` that joined.
- `player_left`: Emitted when a player leaves a channel. Returns the `TaloChannel` and the `TaloPlayerAlias` that left.
- `channel_ownership_transferred`: Emitted when channel ownership is transferred. Returns the `TaloChannel` and the new owner's `TaloPlayerAlias`.
- `channel_deleted`: Emitted when a channel is deleted. Returns the `TaloChannel` that was deleted.
- `channel_updated`: Emitted when a channel is updated. Returns the `TaloChannel` that was updated and an `Array[String]` of properties that were changed.
