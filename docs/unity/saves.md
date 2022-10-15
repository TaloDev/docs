---
sidebar_position: 6
---

# Saves

Talo's save system allows you to persist your game's state across multiple sessions. Each object in your scene can be saved and restored from one of your player's saves.

Check out the `SavesPlayground` demo scene for additional examples.

## Loading saves

Your player's saves are automatically loaded after [they are identified](/docs/unity/identifying). You can also manually load saves using `Talo.Saves.GetSaves()` which allows you to specify what kind of saves to load (online, offline or both). Once your saves have been fetched, the `OnSavesLoaded` event is invoked.

Saves can be accessed using `Talo.Saves.All` or `Talo.Saves.Latest`. To load a save, use `Talo.Saves.ChooseSave()` and pass in the save you want to load.

Once your save has been chosen, the `OnSaveChosen` event will fire. Internally, this causes the `OnLoaded()` function in your Loadables to be called.

Finally, when all your registered loadables have called their `OnLoaded()`, an `OnSaveLoadingCompleted()` event is fired, signalling that, for example, it's safe to hide your loading screen.

## Loadables

Loadables are GameObjects that automatically have their data saved and loaded. To make a GameObject loadable, create a new MonoBehavior and extend the `Loadable` class and finally add your new component onto your GameObject.

Your Loadables must implement the following two methods:
- `RegisterFields()`: this is where your saved data will be populated just before your save gets created or updated
- `OnLoaded()`: this is called after the `OnSaveChosen` event is fired and this is where you will modify your GameObject with its saved data

Importantly, each Loadable must have a unique ID so that Talo knows which GameObject to load with which data. The name of the GameObject and names of all of its parents are also saved (for example `SpaceShip.EngineRoom.Interactables.OffButton`).

Below is an example of a simple cube that saves and loads its position, rotation and scale:

```c# title="LoadableCube.cs"
using System.Collections.Generic;
using UnityEngine;
using TaloGameServices;

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
}
```

### Destroyed loadables

If an object is registered and then is found to be destroyed (i.e. if `Destroy(gameObject)` was used), a `meta.destroyed` key is saved as the only field for that object.

You can handle destroyed objects using the `HandleDestroyed` function which will automatically destroy an object if it has the `meta.destroyed` key:

```c#
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

## Creating saves

To create a save, use `Talo.Saves.CreateSave()`. Your new save will automatically become your chosen save (although the `OnSaveChosen` even will not fire). Internally, this causes the `RegisterFields()` function in your Loadables to be called.

You can choose if your new save is available online, offline or both. Offline saves are created in the [`Application.persistentDataPath`](https://docs.unity3d.com/ScriptReference/Application-persistentDataPath.html) within a `saves.json`.

## Updating saves

To update a save, use `Talo.Saves.UpdateSave()`. You can optionally pass in a new name for your save.

## Deleting saves

You can delete a save by passing in the save's ID to `Talo.Saves.DeleteSave()`.

## Online vs Offline saves

When a save is created or saves are loaded with `SaveMode.BOTH`, the online version will be preferred if they are successfully retrieved. If not, (e.g. if your player is not connected to the internet), then the offline will be used.
