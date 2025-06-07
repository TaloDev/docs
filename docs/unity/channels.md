---
sidebar_position: 15
description: Talo Channels add instant interactivity to your game. Channels can be used for player chats, sending event-based messages and more.
---

# Channels

Talo Channels are a way of passing messages between players that are subscribed to a specific topic. Channels can be used for player chats, sending arbitrary JSON to various groups and pushing game updates directly to clients.

You can learn more about channel [here](https://trytalo.com/channels).

## Listing channels

To get all available channels for your game, use the `Talo.Channels.GetChannels()` function. This is a paginated function which takes a single `page` parameter.

This function returns an array with 3 items: the channels, the total number of channels (if they weren't paginated) and if this is the last page.

```csharp
var page = 0
var res = await Talo.Channels.GetChannels(new GetChannelsOptions { page = page })

var channels: Channel[] = res.channels
var count: int = res.count
var isLastPage: bool = res.isLastPage
```

### Filtering by prop keys and values

The following code will only fetch channels that have the "guildId" key:

```csharp
var options = new GetChannelsOptions() { page = page, propKey = "guildId" }
var res = await Talo.Channels.GetChannels(options)
```

You can also filter by a prop value. This code will now make sure there is a "guildId" key and its value is "157":

```csharp
var options = new GetChannelsOptions() { page = page, propKey = "guildId", propValue = "157" }
var res = await Talo.Channels.GetChannels(options)
```

## Listing subscribed channels

You can use `Talo.Channels.GetSubscribedChannels()` which returns a `Channel[]` to find out which channels the current player is subscribed to.

### Filtering by prop keys and values

Similar to `GetChannels()`, you can filter by prop keys and values by providing options:

```csharp
var options = new GetSubscribedChannelsOptions() { propKey = "guildId", propValue = "157" }
var res = await Talo.Channels.GetSubscribedChannels(options)
```

## Creating a channel

To create a channel, call `Talo.Channels.Create()` with a channel name and (optionally) the auto cleanup value and/or props. When auto cleanup is enabled, the channel will be deleted when the owner or the last subscribed member leaves. Props (a dictionary of string key/value pairs) are a way of adding arbitrary data to your channels in the same way as you would for events, players and leaderboards.

```csharp
var channel = await Talo.Channels.Create(new CreateChannelOptions() { name = channelName, autoCleanup = true }
```

## Finding a channel

You can find a channel by its ID using `Talo.Channels.Find()`. This function takes a channel ID integer and returns a `Channel` object.

## Joining and leaving channels

To join or leave a channel, use `Talo.Channels.Join()` and `Talo.Channels.Leave()` respectively. Both functions take the ID of the channel as the only parameter. If you attempt to join a channel and the current player is already in that channel, nothing will happen. Leaving a channel also follows the same pattern.

## Updating channels

The owner of a channel can update the channel using `Talo.Channels.Update()`. The name and owner of the channel can be updated using this function.

To transfer ownership of the channel, you should specify the ID of the player alias that will own the channel. The new owner of the channel must be a member first before ownership can be transferred.

You can also update the props of the channel: keys will be overrided with new values and keys with a value of `null` will be deleted.

## Deleting channels

The owner of a channel can delete the channel using `Talo.Channels.Delete()`. All other members of the channel will be unsubscribed automatically.

## Private channels

You can also create an invite-only private channels using the `isPrivate` option.

Private channels will not be listed when using `Talo.Channels.GetChannels()`. They also cannot be joined in the same way: the channel owner must invite players to a private channel.

### Channel invites

To create a channel invite, use `Talo.Channels.Invite()` with a channel ID and player alias ID.

Invited players will automatically join the channel.

```csharp
var channel = await Talo.Channels.Create(new CreateChannelOptions() { name = "channel name", isPrivate = true }
await Talo.Channels.Invite(channel.id, inviteePlayerAlias.id);
```

Note: you can use invites for public channels too.

## Temporary membership channels

If players should only be members of a channel while they're online, you can choose to the enable the `temporary_membership` option when creating your channel:

```csharp
var channel = await Talo.Channels.Create(new CreateChannelOptions() { name = "channel name", temporaryMembership = true }
```

Any player that joins the channel and then goes offline will automatically be removed from the channel. The `Talo.Channels.OnChannelLeft` event will fire with the reason `ChannelLeavingReason.TemporaryMembership`.

## Getting channel members

You can fetch a list of channel members using `Talo.Channels.GetMembers()`. This will return a `PlayerAlias[]`:

```csharp
var members = await Talo.Channels.GetMembers(channel.id);
Debug.Log(string.Join(", ", members.Select((m) => m.identifier)));
```

Note: the current player can only fetch channel members for channels they are part of.

## Listening for messages

To listen for messages, you can subscribe to the `Talo.Channels.OnMessageReceived` event. This event provides the `Channel`, the sender's `PlayerAlias` and the message.

Here's an example of how to use this event to update a chat UI:

```csharp
private void Start()
{
    Talo.Channels.OnMessageReceived += OnMessageReceived;
}

private void OnMessageReceived(Channel channel, PlayerAlias sender, string message)
{
	if (channel.id == _activeChannelId)
	{
		AddChatMessage($"[{channel.name}] {sender.identifier}: {message}");
	}
}
```

### Listening for other events

You can also listen for the following events:
- `Talo.Channels.OnChannelJoined`: Emitted when a player joins a channel. Returns the `TaloChannel` and the `TaloPlayerAlias` that joined.
- `Talo.Channels.OnChannelLeft`: Emitted when a player leaves a channel. Returns the `TaloChannel`, the `TaloPlayerAlias` that left and the `ChannelLeavingReason`.
- `Talo.Channels.OnOwnershipTransferred`: Emitted when channel ownership is transferred. Returns the `TaloChannel` and the new owner's `TaloPlayerAlias`.
- `Talo.Channels.OnChannelDeleted`: Emitted when a channel is deleted. Returns the `TaloChannel` that was deleted.
- `Talo.Channels.OnChannelUpdated`: Emitted when a channel is updated. Returns the `TaloChannel` that was updated and a `string[]` of properties that were changed.

## Channel storage

Channel storage is a shared pool of props (key/value pairs) that can be read, created, updated and deleted by all members of the channel. In an open world game, you could store a reference to all the gatherable resources using channel storage. When a resource is gathered, other players in the same channel can be automatically notified so their world can be synced with the global world state.

### Getting storage props

To get a prop, use `Talo.channels.get_storage_prop()`. In the example below, we're finding a channel for the player's guild and fetching the shared gold pool:

```csharp
var options = new GetSubscribedChannelsOptions() { propKey = "guildId", propValue = "157" }
var res = await Talo.Channels.GetSubscribedChannels(options);

var channel = res[0]
var prop = await Talo.Channels.GetStorageProp(channel.id, "shared-gold")
```

After fetching a prop, you can access the `value`, `createdBy`, `lastUpdatedBy` (and more) from the `ChannelStorageProp` class.

### Updating storage props

Any player can update the global store using `Talo.Channels.SetStorageProps()`:

```csharp
await Talo.Channels.SetStorageProps(
	channel.id,
	("prop1", "value1"),
	("prop2", "value2")
)
```

This method accepts any number of prop `(string, string)` tuples. You can set a prop value to `null` to delete it.


### Listening for storage updates

The `Talo.Channels.OnChannelStoragePropsUpdated` event will fire when a storage update is received. It will list the channel, upserted (inserted or updated) props and deleted props:

```csharp
void Start()
{
	Talo.Channels.OnChannelStoragePropsUpdated += OnChannelStoragePropsUpdated;
}

void OnChannelStoragePropsUpdated(Channel channel, ChannelStorageProp[] upsertedProps, ChannelStorageProp[] deletedProps)
{
	foreach (var prop in upsertedProps)
	{
		// e.g. "shared-gold: 80 upserted by jim"
		Debug.Log($"{prop.key}:{prop.value} upserted by {prop.lastUpdatedBy.identifier}")
	}

	foreach (var prop in deletedProps)
	{
		// e.g. "shared-gold deleted by jim, previous value was 80"
		Debug.Log($"{prop.key} deleted by {prop.lastUpdatedBy.identifier}, previous value was {prop.value}")
	}
}
```
