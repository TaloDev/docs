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

`live_config.get_prop()` will return the value of the property as a string, so you will need to cast it to the correct type. This function also has a second argument which is the default value to return if the property is not found.

## Listening for live config updates

You can listen for live config updates by connecting to the `Talo.game_config.live_config_updated` signal:

```gdscript
func _ready() -> void:
	Talo.game_config.live_config_updated.connect(_on_live_config_updated)

func _on_live_config_updated(live_config: TaloLiveConfig) -> void:
	label.text = live_config.get_prop("live_string", "Not set!")
```

The `live_config_updated` signal is fired via the [Talo Socket](./socket) whenever the live config is updated from the Talo dashboard.

### Alternative example - polling the live config with a timer

If you prefer not to use the Talo Socket, you can attach this example script to a node with a Timer timeout signal connected:

```gdscript
extends Node

@export var label: Label

# signal from a Timer node
func _on_timer_timeout() -> void:
	Talo.game_config.get_live_config()
	label.text = Talo.live_config.get_prop("live_string", "Not set!")
```
