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
var page = 0
var res = await Talo.channels.get_channels(page)
var channels: Array[GameChannel] = res[0]
var count: int = res[1]
var is_last_page: bool = res[2]
```

## Listing subscribed channels

You can use `Talo.channels.get_subscribed_channels()` to find out which channels the current player is subscribed to. This returns an array of `TaloChannel`.

## Creating a channel

To create a channel, call `Talo.channels.create()` with a channel name and (optionally) the auto cleanup value and/or props. When auto cleanup is enabled, the channel will be deleted when the owner or the last subscribed member leaves. Props (a dictionary of string key/value pairs) are a way of adding arbitrary data to your channels in the same way as you would for events, players and leaderboards.

## Joining and leaving channels

To join or leave a channel, use `Talo.channels.join()` and `Talo.channels.leave()` respectively. Both functions take the ID of the channel as the only parameter. If you attempt to join a channel and the current player is already in that channel, nothing will happen. Leaving a channel also follows the same pattern.

## Updating channels

The owner of a channel can update the channel using `Talo.channels.update()`. The name and owner of the channel can be updated using this function.

To transfer ownership of the channel, you should specify the ID of the player alias that will own the channel. The new owner of the channel must be a member first before ownership can be transferred.

You can also update the props of the channel: keys will be overrided with new values and keys with a value of `null` will be deleted.

## Deleting channels

The owner of a channel can delete the channel using `Talo.channels.delete()`. All other members of the channel will be unsubscribed automatically.
