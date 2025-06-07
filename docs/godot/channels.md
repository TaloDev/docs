---
sidebar_position: 15
description: Talo Channels add instant interactivity to your game. Channels can be used for player chats, sending event-based messages and more.
---

# Channels

Talo Channels are a way of passing messages between players that are subscribed to a specific topic. Channels can be used for player chats, sending arbitrary JSON to various groups and pushing game updates directly to clients.

You can learn more about channel [here](https://trytalo.com/channels).

## Listing channels

To get all available channels for your game, use the `Talo.channels.get_channels()` function. This is a paginated function which takes a single `options` parameter.

This function returns an array with 3 items: the channels, the total number of channels (if they weren't paginated) and if this is the last page.

```gdscript
var options := Talo.channels.GetChannelsOptions.new()
options.page = 0
var res := await Talo.channels.get_channels(options)

var channels: Array[GameChannel] = res.channels
var count: int = res.count
var is_last_page: bool = res.is_last_page
```

### Filtering by prop keys and values

The following code will only fetch channels that have the "guildId" key:

```gdscript
var options := Talo.channels.GetChannelsOptions.new()
options.page = 0
options.prop_key = "guildId"
var res := await Talo.channels.get_channels(options)
```

You can also filter by a prop value. This code will now make sure there is a "guildId" key and its value is "157":

```gdscript
var options := Talo.channels.GetChannelsOptions.new()
options.page = 0
options.prop_key = "guildId"
options.prop_value = "157"
var res := await Talo.channels.get_channels(options)
```

## Listing subscribed channels

You can use `Talo.channels.get_subscribed_channels()` to find out which channels the current player is subscribed to. This returns an array of `TaloChannel`.

### Filtering by prop keys and values

Similar to `get_channels()`, you can filter by prop keys and values by providing options:

```gdscript
var options := Talo.channels.GetSubscribedChannelsOptions.new()
options.prop_key = "guildId"
options.prop_value = "157"
var res := await Talo.channels.get_subscribed_channels(options)
```

## Creating a channel

To create a channel, call `Talo.channels.create()` with a channel name and (optionally) the auto cleanup value and/or props. When auto cleanup is enabled, the channel will be deleted when the owner or the last subscribed member leaves. Props (a dictionary of string key/value pairs) are a way of adding arbitrary data to your channels in the same way as you would for events, players and leaderboards.

```gdscript
var options := Talo.channels.CreateChannelOptions.new()
options.name = "channel name"
options.auto_cleanup = true
options.props = {}
var channel := await Talo.channels.create(options)

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

You can also create an invite-only private channels using the `private` option:

```gdscript
var options := Talo.channels.CreateChannelOptions.new()
options.name = "channel name"
options.auto_cleanup = true
options.private = true

var channel := await Talo.channels.create(options)
print(channel.private) # true
```

Private channels will not be listed when using `Talo.channels.get_channels()`. They also cannot be joined in the same way: the channel owner must invite players to a private channel.

### Channel invites

To create a channel invite, use `Talo.channels.invite()` with a channel ID and player alias ID.

Invited players will automatically join the channel.

```gdscript
var options := Talo.channels.CreateChannelOptions.new()
options.name = "channel name"
options.auto_cleanup = true
options.private = true

var channel := await Talo.channels.create(options)
await Talo.channels.invite(channel.id, invitee_player_alias.id)
```

Note: you can use invites for public channels too.

## Temporary membership channels

If players should only be members of a channel while they're online, you can choose to the enable the `temporary_membership` option when creating your channel:

```gdscript
var options := Talo.channels.CreateChannelOptions.new()
options.name = "channel name"
options.temporary_membership = true

var channel := await Talo.channels.create(options)
```

Any player that joins the channel and then goes offline will automatically be removed from the channel. The `Talo.channels.player_left` signal will fire with the reason `Talo.channels.ChannelLeavingReason.TEMPORARY_MEMBERSHIP`.

## Getting channel members

You can fetch a list of channel members using `Talo.channels.get_members()`. This will return an `Array[TaloPlayerAlias]`:

```gdscript
var members := await Talo.channels.get_members(id)
print(members.map((func (member): return member.identifier)))
```

## Listening for messages

To listen for messages, you can use the `Talo.channels.message_received` signal. This signal will return the `TaloPlayerChannel`, the sender's `TaloPlayerAlias` and the message.

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
- `Talo.channels.player_joined`: Emitted when a player joins a channel. Returns the `TaloChannel` and the `TaloPlayerAlias` that joined.
- `Talo.channels.player_left`: Emitted when a player leaves a channel. Returns the `TaloChannel`, the `TaloPlayerAlias` that left and a `Talo.channels.ChannelLeavingReason`.
- `Talo.channels.channel_ownership_transferred`: Emitted when channel ownership is transferred. Returns the `TaloChannel` and the new owner's `TaloPlayerAlias`.
- `Talo.channels.channel_deleted`: Emitted when a channel is deleted. Returns the `TaloChannel` that was deleted.
- `Talo.channels.channel_updated`: Emitted when a channel is updated. Returns the `TaloChannel` that was updated and an `Array[String]` of properties that were changed.

## Channel storage

Channel storage is a shared pool of props (key/value pairs) that can be read, created, updated and deleted by all members of the channel. In an open world game, you could store a reference to all the gatherable resources using channel storage. When a resource is gathered, other players in the same channel can be automatically notified so their world can be synced with the global world state.

### Getting storage props

To get a prop, use `Talo.channels.get_storage_prop()`. In the example below, we're finding a channel for the player's guild and fetching the shared gold pool:

```gdscript
var options := Talo.channels.GetSubscribedChannelsOptions.new()
options.prop_key = "guildId"
options.prop_value = "157"
var res := await Talo.channels.get_subscribed_channels(options)

var channel := res[0]
var prop := await Talo.channels.get_storage_prop(channel.id, "shared-gold")
```

After fetching a prop, you can access the `value`, `created_by_alias`, `last_updated_by_alias` (and more) from the `TaloChannelStorageProp` class.

### Updating storage props

Any player can update the global store using `Talo.channels.set_storage_props()`:

```gdscript
await Talo.channels.set_storage_props(channel.id, {
	prop1: "value1",
	prop2: "value2"
})
```

This method accepts a dictionary of prop keys and values. You can set a prop value to `null` to delete it.

### Listening for storage updates

The `Talo.channels.channel_storage_props_updated` signal will fire when a storage update is received. It will list the channel, upserted (inserted or updated) props and deleted props:

```gdscript
func _ready() -> void:
	Talo.channels.channel_storage_props_updated.connect(_on_channel_props_updated)

func _on_channel_props_updated(channel: TaloChannel, upserted_props: Array[TaloChannelStorageProp], deleted_props: Array[TaloChannelStorageProp]) -> void:
	if channel.id != demo_channel.id:
		return

	for prop in upserted_props:
		# e.g. "shared-gold: 80 upserted by jim"
		print("%s:%s upserted by %s" % [prop.key, prop.value, prop.last_updated_by_alias.identifier])

	for prop in deleted_props:
		# e.g. "shared-gold deleted by jim, previous value was 80"
		print("%s deleted by %s, previous value was %s" % [prop.key, prop.last_updated_by_alias.identifier, prop.value])

```
