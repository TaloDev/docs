---
sidebar_position: 11
---

# Live config

Live config lets you push state directly to your game from [the Talo dashboard](https://dashboard.trytalo.com) without needing to release an update.

## Getting the live config

The live config needs to be fetched before it can be queried. To do this call `Talo.game_config.get_live_config()`.
This will fire the `Talo.game_config.live_config_loaded` signal that returns the newly initialised config.

You can fetch the game config any time to refresh the state.

## Querying the live config

You can query properties of the config using `Talo.live_config.get_prop()`, for example if you wanted to get a boolean value:

```gdscript
var halloween_event_enabled = bool(Talo.live_config.get_prop("halloween_event_enabled"));
```

## Example - polling the live config and updating the UI

You can attach this script to a Node with a Timer timeout signal connected:

```gdscript
extends Node

@export var label: Label

# signal from a Timer node
func _on_timer_timeout() -> void:
  Talo.game_config.get_live_config()
  label.text = Talo.live_config.get_prop("live_string", "Not set!")
```
