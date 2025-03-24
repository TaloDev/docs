---
sidebar_position: 16
description: With Talo's presence API, you can automatically track the presence of players in your game. Presence allows you to easily build social features like friends lists.
---

# Player presence

The player presence API allows you to automatically track the presence of players in your game. You can use this to show if a player is online or offline, set custom statuses and build social features like friends lists.

## Getting a player's presence

To get a player's presence, use the `Talo.player_presence.get_presence()` function. This function has a single argument which is the ID of the player you want to get the presence of.

```gdscript
var presence := await Talo.player_presence.get_presence(player_id)
```

This function returns a `TaloPlayerPresence` object:

```gdscript
class_name TaloPlayerPresence extends Node

var online: bool
var custom_status: String
var player_alias: TaloPlayerAlias
var updated_at: String
```

The `player_alias` represents the last alias used to update the player's presence. The `updated_at` timestamp represents the last time the player's presence was updated. Custom statuses can be used to show a player's current activity or to represent other states beyond simply online or offline.

## Updating a player's presence

To update a player's presence, use the `Talo.player_presence.update_presence()` function. You can provide the new `online` status and an optional `custom_status`.

```gdscript
var res := await Talo.player_presence.update_presence(online, custom_status)
```

This function returns a `TaloPlayerPresence` object.

## Subscribing to presence updates

You can use the `Talo.player_presence.presence_changed` signal to subscribe to player presence updates. This signal will return a `TaloPlayerPresence` object and information about what changed. Here's an example of how to use this signal to update a friends list:

```gdscript
func _ready() -> void:
	Talo.player_presence.presence_changed.connect(_on_presence_changed)

func _on_presence_changed(presence: TaloPlayerPresence, online_changed: bool, custom_status_changed: bool) -> void:
	# check if this player is in our friends list
	if _friends_list.has(presence.player_alias.id):
		if online_changed:
			if presence.online:
				print("%s is now online" % presence.player_alias.identifier)
			else:
				print("%s is now offline" % presence.player_alias.identifier)
		if custom_status_changed:
			print("They are currently: %s" % presence.custom_status)
```
