---
sidebar_position: 6
---

# Saves

Talo Saves allow you to persist your game's state across multiple sessions. Each object in your scene can be saved and restored from one of your player's saves.

Check out the [SavesDemo sample](https://github.com/TaloDev/unity/tree/develop/Assets/Talo%20Game%20Services/Talo/Samples/SavesDemo) (included with the Unity package) for a full example showing choosing saves, managing saves and persisting save data across different scenes.

## Loadables

Loadables are GameObjects that automatically have their data saved and loaded. To make a GameObject loadable, create a new MonoBehavior, extend the `Loadable` class and finally add your new component onto your GameObject.

Once a loadable has entered the scene, its `OnEnable()` function registers it with the saves manager. We need to register all the Loadables in the scene so that when we load our save, we can match the content in the save file with the structure of the scene.

Importantly, each Loadable _must_ have a unique `Id` so that Talo knows which node to load with which data.

## Saved objects

Save files are collections of "saved objects". Here's what a typical saved object looks like:

```typescript
{
	id: "level1cube2",
	name: "Level1.Cubes.Cube2"
	data: [
		{
			key: "x",
			type: "System.Single",
			value: "0.4036766"
		},
		{
			key: "y",
			type: "System.Single",
			value: "0.4561406"
		},
		{
			key: "z",
			type: "System.Single",
			value: "0"
		}
	],
},
```

:::tip
You can visualise players' save files as node graphs in the Talo dashboard. Just go to the player's profile, click `Saves` and choose the save you want to view.
:::

Saved objects must have a unique `id`: this comes from the loadable and is used to match the saved object with the correct loadable. The `name` in a saved object refers to the name of the GameObject and names of all of its parents.

The most interesting part is the `data` which contains the fields we register in the loadable (explained below) as well as the original `type` of the data. Notice that all values are serialised into strings. This is so that when the data is loaded, it can be easily converted back into its original type.

### Data hydration

When saves are created, all the loadable GameObjects in your scene will be serialised into saved objects. Similarly, when a save is loaded, each saved object is paired up with a matching loadable. Once paired up, the loadable is hydrated with the latest data from the saved object. Hydrating the loadable calls the loadable's `OnLoaded()` function with the data containing each value converted back to its original type.

## Registering fields

In order to save and load data, we need to tell Talo what we want to save. Here's an example of what that would look like for the cube saved object above:

```csharp
public class LoadableCube : Loadable
{
	public override void RegisterFields()
	{
		RegisterField("x", transform.position.x);
		RegisterField("y", transform.position.y);
		RegisterField("z", transform.position.z);

		RegisterField("r.x", transform.rotation.x);
		RegisterField("r.y", transform.rotation.y);
		RegisterField("r.z", transform.rotation.z);

		RegisterField("s.x", transform.localScale.x);
		RegisterField("s.y", transform.localScale.y);
		RegisterField("s.z", transform.localScale.z);
	}
}
```

As you can see, each field needs to be registered with the `RegisterField()` function. The `RegisterFields()` function is called just before data is serialised to ensure we have the latest data.

## Loading data

As described above, when a saved object is paired up with a loadable, the loadable is hydrated with the data from the saved object. This calls the `OnLoaded()` function of the loadable, where you can set the properties of the GameObject:

```csharp
public override void OnLoaded(Dictionary<string, object> data)
{
	transform.position = new Vector3(
		(float)data["x"],
		(float)data["y"],
		(float)data["z"]
	);

	transform.rotation = Quaternion.Euler(
		(float)data["r.x"],
		(float)data["r.y"],
		(float)data["r.z"]
	);

	transform.localScale = new Vector3(
		(float)data["s.x"],
		(float)data["s.y"],
		(float)data["s.z"]
	);
}
```

### Destroyed loadables

If an object is registered and then is found to be destroyed (i.e. if `Destroy(gameObject)` was used), a `meta.destroyed` key is saved as the only field for that object.

You can handle destroyed objects using the `HandleDestroyed` function which will automatically destroy an object if it has the `meta.destroyed` key:

```csharp
public override void OnLoaded(Dictionary<string, object> data)
{
	if (HandleDestroyed(data)) return;

	transform.position = new Vector3(
		(float)data["x"],
		(float)data["y"],
		(float)data["z"]
	);
}
```

## Loading saves

You can load saves using `Talo.Saves.GetSaves()`. Once your saves have been fetched, the `Talo.Saves.OnSavesLoaded` event is invoked.

Saves can be accessed using `Talo.Saves.All`, `Talo.Saves.Latest` or `Talo.Saves.Current`. To load a save, use `Talo.Saves.ChooseSave()` and pass in the save you want to load.

Once your save has been chosen, the `Talo.Saves.OnSaveChosen` event will be invoked. Internally, this causes the `OnLoaded()` function in your Loadables to be called.

Finally, when all your registered loadables have called their `OnLoaded()`, an `Talo.Saves.OnSaveLoadingCompleted()` event is invoked which can be used to hide your loading screen.

![Flowchart showing loading a save](/img/saves-flowchart.png)

## Creating saves

To create a save, use `Talo.Saves.CreateSave()`. Your new save will automatically become your chosen save (although the `OnSaveChosen` event will not invoke). Internally, this causes the `RegisterFields()` function in your Loadables to be called.

Offline copies of saves are created in the [`Application.persistentDataPath`](https://docs.unity3d.com/ScriptReference/Application-persistentDataPath.html) within a `saves.json`.

## Updating saves

To update a save, use `Talo.Saves.UpdateSave()`. You can optionally pass in a new name for your save.

## Deleting saves

You can delete a save by passing in the save's ID to `Talo.Saves.DeleteSave()`. Optionally you can pass in the `unloadIfCurrentSave` flag which will [unload](#unloading-saves) the current save if it is the one being deleted.

## Offline saves & syncing

Talo automatically creates offline versions of saves. When network access is restored, Talo will attempt to resync the saves, preferring the most recently updated save if an online AND offline save exists.

Additionally, if a save is only available offline then it will be synced as soon as a network connection is available.

## Unloading saves

You can unload a save using `Talo.Saves.UnloadCurrentSave()` - this is useful when you want to completely reset the game.

This invokes the `Talo.Saves.OnSaveUnloaded` event and clears any saved object data, essentially reverting every scene back to its original state. The previously unloaded save's data will be unaffected.
