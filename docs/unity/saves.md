---
sidebar_position: 6
---

# Saves

Talo's save system allows you to persist your game's state across multiple sessions. Each object in your scene can be saved and restored from one of your player's saves.

Check out the `SavesPlayground` demo scene for additional examples.

## Loading saves

Your player's saves are automatically loaded after [they are identified](/identified). Once your saves have been fetched, the `OnSavesLoaded` event is invoked.

Saves can be accessed using `Talo.Saves.All` or `Talo.Saves.Latest`. To load a save, use `Talo.Saves.ChooseSave()` and pass in the save you want to load.

Once your save has been loaded, the `OnSaveChosen` event will fire. Internally, this causes the `OnLoaded()` function in your Loadables to be called.

## Loadables

Loadables are GameObjects that automatically have their data saved and loaded. To make a GameObject loadable, create a new MonoBehavior and extend the `Loadable` class and finally add your new component onto your GameObject.

Your Loadables must implement the following two methods:
- `RegisterFields()`: this is where your saved data will be populated just before your save gets created or updated
- `OnLoaded()`: this is called after the `OnSaveChosen` event is fired and this is where you will modify your GameObject with its saved data

Importantly, each Loadable must have a unique ID so that Talo knows which GameObject to load with which data. The name of the GameObject and names of all of its parents are also saved (for example `SpaceShip.EngineRoom.Interactables.OffButton`).

Below is an example of a simple cube that saves and loads its position, rotation and scale:

```c# title="LoadableCube.cs"
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LoadableCube : Loadable
{
    public override void RegisterFields()
    {
        savedFields.Add("x", transform.position.x);
        savedFields.Add("y", transform.position.y);
        savedFields.Add("z", transform.position.z);

        savedFields.Add("r.x", transform.rotation.x);
        savedFields.Add("r.y", transform.rotation.y);
        savedFields.Add("r.z", transform.rotation.z);

        savedFields.Add("s.x", transform.localScale.x);
        savedFields.Add("s.y", transform.localScale.y);
        savedFields.Add("s.z", transform.localScale.z);
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

## Creating saves

To create a save, use `Talo.Saves.CreateSave()`. Your new save will automatically become your chosen save (although the `OnSaveChosen` even will not fire). Internally, this causes the `RegisterFields()` function in your Loadables to be called.

## Updating saves

To update a save, use `Talo.Saves.UpdateSave()`. You can optionally pass in a new name for your save.
