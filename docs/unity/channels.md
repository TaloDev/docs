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
var res = await Talo.Channels.GetChannels(page)
var channels: Channel[] = res.channels
var count: int = res.count
var isLastPage: bool = res.isLastPage
```

## Listing subscribed channels

You can use `Talo.Channels.GetSubscribedChannels()` which returns a `Channel[]` to find out which channels the current player is subscribed to.

## Creating a channel

To create a channel, call `Talo.Channels.Create()` with a channel name and (optionally) the auto cleanup value and/or props. When auto cleanup is enabled, the channel will be deleted when the owner or the last subscribed member leaves. Props (a dictionary of string key/value pairs) are a way of adding arbitrary data to your channels in the same way as you would for events, players and leaderboards.

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
