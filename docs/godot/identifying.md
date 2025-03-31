---
sidebar_position: 2
description: The Talo Godot plugin allows you to identify multiple aliases, authenticate and sync your players with Steamworks.
---

# Identifying a player

## Aliases

Players within your Talo account can have multiple aliases.
For example, a player could have Steam and Epic Games login credentials but both would be tied to them, allowing the player to use either to log in.

You should identify a player after they have authenticated and before you attempt to track any events, add leaderboard entries or do anything related directly to the player.

## Identifying

:::caution
If you are using **Talo Player Authentication**, you should never have to identify a player manually. Visit the [Player authentication docs](/docs/godot/player-authentication) to learn more about identifying players with authentication enabled.
:::

You can identify a player using `Talo.players.identify()`. The code sample below shows you how you could identify a player using a UI element (this example is also available in the Playground scene):

```gdscript title="identify_button.gd"
extends Button

@export var service: String
@export var identifier: String

func _on_pressed():
	Talo.players.identify(service, identifier)
```

### Generating a mostly-unique identifier

You can easily create an identifier with `Talo.players.generate_identifier()`. This is useful for temporarily identifying players before you know who they are, and then merging them with an identified player later on.

### The identified signal

After a successful identification, the `Talo.players.identified` signal will fire, returning the identified player. This allows you to, for example, put the player's name on a label:

```gdscript title="player_name.gd"
extends Label

func _ready() -> void:
	Talo.players.identified.connect(_on_identified)

func _on_identified(player: TaloPlayer) -> void:
	text = player.get_prop("display_name")
```

## Checking identification

Sometimes you might need to check if a player has been identified before. You can use `Talo.identity_check()` to verify this - it throws an error if a player hasn't been identified yet:

```gdscript
func do_stuff_if_authenticated() -> void:
	if Talo.identity_check() != OK:
		return

	# do stuff
```

## Merging players

As described above, sometimes a player may have one or more aliases and there are times where you know for certain some aliases belong to the same player.
You can merge players using `Talo.players.merge()` by providing the IDs of both players.

The merge process takes all the props, aliases, and associated data (events, leaderboard entries, saves, etc.) from Player 2 and merge them into Player 1. This means that duplicate props in Player 1 will be replaced by the ones from Player 2.

## Steamworks integration

If you have the Steamworks integration enabled, Talo can sync a Steam player using the Steam User Auth API ([as described here](/docs/integrations/steamworks#authentication)). You can do this via the `Talo.players.identify_steam` function. Here's an example using [GodotSteam](https://godotsteam.com):

```gdscript
extends Node

var identity = "talo"

func _ready() -> void:
	Steam.steamInitEx()
	Steam.get_ticket_for_web_api.connect(_on_get_ticket_for_web_api)
	Steam.getAuthTicketForWebApi(identity)

func _on_get_ticket_for_web_api(_auth_ticket: int, _result: int, _ticket_size: int, ticket_buffer: Array) -> void:
	Talo.players.identify_steam(PackedByteArray(ticket_buffer).hex_encode(), identity)

func _process(_delta: float) -> void:
	Steam.run_callbacks()
```

The `identity` parameter is optional but strongly recommended as it ensures proper identification of the service verifying the ticket. It can be anything you like but must be the same as the `identity` passed to Steam when fetching the ticket.
