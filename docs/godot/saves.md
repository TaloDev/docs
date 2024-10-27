---
sidebar_position: 6
---

# Saves

Talo Saves allow you to persist your game's state across multiple sessions. Each object in your scene can be saved and restored from one of your player's saves.

:::tip
You can visualise players' save files in the Talo dashboard. Just go to the player's profile, click `Saves` and choose the save you want to view.
:::

## Loading saves

You can load saves using `Talo.saves.get_saves()`. Once your saves have been fetched, the `Talo.saves.saves_loaded` signal is fired.

Saves can be accessed using `Talo.saves.all` or `Talo.saves.latest`. To load a save, use `Talo.saves.choose_save()` and pass in the save you want to load.

Once your save has been chosen, the `Talo.saves.save_chosen` signal will fire. Internally, this causes the `on_loaded()` function in your Loadables to be called.

Finally, when all your registered loadables have called their `on_loaded()`, an `Talo.saves.save_loading_completed()` signal is fired, signalling that, for example, it's safe to hide your loading screen.

## Loadables

Loadables are Nodes that automatically have their data saved and loaded. To make a Node loadable, create a new script, extend the `Loadable` class and finally add your new script onto your Node.

Your Loadables must implement the following two methods:
- `register_fields()`: this is where your saved data will be populated just before your save gets created or updated
- `on_loaded()`: this is called after the `save_chosen` event is fired and this is where you will modify your Node with its saved data

Importantly, each Loadable must have a unique ID so that Talo knows which Node to load with which data. The name of the Node and names of all of its parents are also saved (for example `SpaceShip.EngineRoom.Interactables.OffButton`).

Below is an example of a simple ColorRect that saves and loads its (randomised) colour:

```gdscript title="loadable_color_rect.gd"
class_name LoadableColorRect extends TaloLoadable

var color_rect: ColorRect

func _ready() -> void:
	super()
	color_rect = get_child(0)

func register_fields() -> void:
	register_field("r", color_rect.color.r)
	register_field("g", color_rect.color.g)
	register_field("b", color_rect.color.b)

func on_loaded(data: Dictionary) -> void:
	color_rect.color = Color(data["r"], data["g"], data["b"])

func randomise() -> void:
	color_rect.color = Color(randf(), randf(), randf())
```

### Destroyed loadables

If a Node is registered and then is found to be destroyed (i.e. if `queue_free(node)` was used), a `meta.destroyed` key is saved as the only field for that object.

You can handle destroyed objects using the `HandleDestroyed` function which will automatically destroy an object if it has the `meta.destroyed` key:

```gdscript
func on_loaded(data: Dictionary) -> void:
	if handle_destroyed(data):
		return

	color_rect.color = Color(data["r"], data["g"], data["b"])
```

## Creating saves

To create a save, use `Talo.saves.create_save()`. Your new save will automatically become your chosen save (although the `save_chosen` signal will not fire). Internally, this causes the `register_fields()` function in your Loadables to be called.

Offline copies of saves are created in the [user data](https://docs.godotengine.org/en/stable/tutorials/io/data_paths.html#accessing-persistent-user-data-user) within a `saves.json`.

## Updating saves

To update a save, use `Talo.saves.update_save()`. You can optionally pass in a new name for your save.

## Deleting saves

You can delete a save by passing in the save's ID to `Talo.saves.delete_save()`.

## Offline saves & syncing

Talo automatically creates offline versions of saves. When network access is restored, Talo will attempt to resync the saves, preferring the most recently updated save if an online AND offline save exists.

Additionally, if a save is only available offline then it will be synced as soon as a network connection is available.

## Unloading saves

You can "unload" a save using `Talo.saves.unload_current_save()`. This fires the `save_chosen` signal with a `null` save (preventing Loadables from calling their `on_loaded` event).
