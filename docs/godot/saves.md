---
sidebar_position: 6
---

# Saves

Talo Saves allow you to solve the provlem of saving and loading your game's state across multiple sessions. Each object in your scene can be saved and restored from one of your player's saves.

:::tip
Check out this blog post on [how to save and load data in Godot](https://trytalo.com/blog/game-saves-godot?utm_source=docs&utm_medium=tip) for a detailed walkthrough
:::

## Saves demos

As part of the Godot plugin, we've included a few demos to help you get started:
1. [Playground saves](https://github.com/TaloDev/godot/tree/develop/addons/talo/samples/playground) - allows you to create/load/update/delete a very basic save
2. [Persistent buttons](https://github.com/TaloDev/godot/tree/develop/addons/talo/samples/persistent_buttons) - a simple demo focused on saving/loading functionality
3. [Scene-based saves](https://github.com/TaloDev/godot/tree/develop/addons/talo/samples/multiscene_saves) - a full demo showing how data gets persisted between scenes with a player and other loadables

## Loadables

Talo's game saves let you easily save and load specific nodes in your game. To do this, your nodes need to extend the `TaloLoadable` node. Generally this is the parent node for scenes but you can also have it as a child node (e.g. you may want your loadable to be a child of a parent `CharacterBody2D`).

Once a loadable has entered the tree, its `_ready()` function registers it with the saves manager. We need to register all the Loadables in the scene so that when we load our save, we can match the content in the save file with the structure of the scene.

Importantly, each Loadable _must_ have a unique `id` so that Talo knows which node to load with which data.

## Saved objects

Save files are collections of "saved objects". Here's what a typical saved object looks like:

```typescript
{
	id: "uuid-uuid-uuid-uuid",
	name: "/root/MyScene/Player",
	data: [
		{
			key: "stars",
			type: "2",
			value: "5"
		},
		{
			key: "spawn_point",
			type: "5",
			value: "Vector2(225, 166)"
		},
		{
			key: "spawn_level",
			type: "4",
			value: "\"green_zone\""
		}
	]
}
```

:::tip
You can visualise players' save files as node graphs in the Talo dashboard. Just go to the player's profile, click `Saves` and choose the save you want to view.
:::

Saved objects must have a unique `id`: this comes from the loadable and is used to match the saved object with the correct loadable. The `name` in a saved object refers to the `NodePath` of the loadable in the scene.

The most interesting part is the `data` which contains the fields we register in the loadable (explained below) as well as the original `type` of the data. Notice that all values are serialised into strings. This is so that when the data is loaded, it can be easily converted back into its original type.

### Data hydration

When saves are created, all the loadable nodes in your scene will be serialised into saved objects. Similarly, when a save is loaded, each saved object is paired up with a matching loadable. Once paired up, the loadable is hydrated with the latest data from the saved object. Hydrating the loadable calls the loadable's `on_loaded()` function with the data containing each value converted back to its original type.

## Registering fields

In order to save and load data, we need to tell Talo what we want to save. Here's an example of what that would look like for the player saved object above:

```gdscript
var stars := 0
var spawn_level := "starting_zone"
var spawn_point := Vector2.ZERO

...

func register_fields():
	register_field("stars", stars)
	register_field("spawn_point", spawn_point)
	register_field("spawn_level", spawn_level)
```

As you can see, each field needs to be registered with the `register_field()` function. The `register_fields()` function is called just before data is serialised to ensure we have the latest data.

## Loading data

As described above, when a saved object is paired up with a loadable, the loadable is hydrated with the data from the saved object. This calls the `on_loaded()` function of the loadable, where you can set the properties of the node:

```gdscript
func on_loaded(data: Dictionary):
	stars = data.get("stars", 0)

	spawn_point = data.get("spawn_point", Vector2.ZERO)
	character_body.position = spawn_point

	spawn_level = data.get("spawn_level", "starting_zone")
	# check if we need to change the scene
```

### Destroyed loadables

If a node is registered but is no longer valid when updating/creating a save (i.e. if `queue_free()` was used), a `meta.destroyed` key is saved as the only field for that object.

You can handle destroyed objects using the `HandleDestroyed` function which will automatically `queue_free()` an object if it has the `meta.destroyed` key:

```gdscript
func on_loaded(data: Dictionary) -> void:
	if handle_destroyed(data):
		return

	# load data as normal
```

## Loading saves

You can load saves using `Talo.saves.get_saves()`. Once your saves have been fetched, the `Talo.saves.saves_loaded` signal is emitted.

Saves can be accessed using `Talo.saves.all` or `Talo.saves.latest`. To load a save, use `Talo.saves.choose_save()` and pass in the save you want to load.

Once your save has been chosen, the `Talo.saves.save_chosen` signal will emit.

Finally, when all your registered Loadables have called their `on_loaded()`, an `Talo.saves.save_loading_completed` signal is emitted which can be used hide your loading screen.

![Flowchart showing loading a save](/img/saves-flowchart.png)

:::tip
You can find more details including code samples in our [Godot saves deep dive](https://trytalo.com/blog/saves-deep-dive-godot?utm_source=docs&utm_medium=tip) post
:::

## Creating saves

To create a save, use `Talo.saves.create_save()`. Your new save will automatically become your chosen save (although the `save_chosen` signal will not emit).

Offline copies of saves are created in the [user data](https://docs.godotengine.org/en/stable/tutorials/io/data_paths.html#accessing-persistent-user-data-user) within a `saves.json`.

This will register all the fields for loadables in the scene to create the save file.

## Updating saves

To update a save, use `Talo.saves.update_save()`. You can optionally pass in a new name for your save. You can also update the current save using `Talo.saves.update_current_save()`.

This will get the latest data for all loadables in the scene and check if any loadables should be marked as destroyed.

## Deleting saves

You can delete a save by passing in the save's ID to `Talo.saves.delete_save()`.

## Offline saves & syncing

Talo automatically creates offline versions of saves. When network access is restored, Talo will attempt to resync the saves, preferring the most recently updated save if an online AND offline save exists.

Additionally, if a save is only available offline then it will be synced as soon as a network connection is available.

## Unloading saves

You can unload a save using `Talo.saves.unload_current_save()` - this is useful when you want to completely reset the game.

This emits the `Talo.saves.save_unloaded` signal and clears any saved object data, essentially reverting every scene back to its original state. The previously unloaded save's data will be unaffected.
