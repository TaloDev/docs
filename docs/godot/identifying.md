---
sidebar_position: 2
---

# Identifying a player

## Aliases

Players within your Talo account can have multiple aliases.
For example, a player could have a Steam login and an Epic login but both would be tied to the same player and they could use both to login.

You should identify a player after they have authenticated and before you attempt to track any events, add leaderboard entries or do anything related directly to the player.

## Identifying

:::caution
If you are using **Talo Player Authentication**, you should never need to manually identify a player. Visit the [Player authentication docs](/docs/godot/dev-data.md) to learn more about identifying players with authentication enabled.
:::

You can identify a player using `Talo.players.Identify()`. The code sample below shows you how you could identify a player using a UI element (this example is also available in the Playground):

```gdscript title="identify_button.gd"
extends Button

@export var service: String
@export var identifier: String

func _on_pressed():
  Talo.players.identify(service, identifier)
```

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

Sometimes you might need to check if a player has been identified before. You can use `Talo.IdentityCheck()` to verify this - it throws an error if a player hasn't been identified yet:

```gdscript
func do_stuff_if_authenticated() -> void:
  if Talo.identity_check() != OK:
    return

  # do stuff
```

## Merging players

As described above, sometimes a player may have one or more aliases and there are times where you know for certain some aliases belong to the same players.
You can merge players using `Talo.players.merge()` by proiding the IDs of both players.

Merge will take all the props, aliases and associated data (events, leaderboard entries, saves, etc.) from Player 2 and merge them into Player 1. This means that duplicate props in Player 1 will be replaced by the ones from Player 2.
