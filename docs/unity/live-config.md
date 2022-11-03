---
sidebar_position: 10
---

# Live config

Live config lets you push state directly to your game from [the Talo dashboard](https://dashboard.trytalo.com) without needing to release an update.

## Getting the live config

The live config needs to be fetched before it can be queried. To do this call `Talo.GameConfig.Get()`.
This will invoke the `Talo.GameConfig.OnLiveConfigLoaded()` event that returns the newly initialised config.

You can fetch the game config any time to refresh the state.

## Querying the live config

You can query properties of the config using `Talo.LiveConfig.GetProp<T>()`, for example if you wanted to get a boolean value:

```c#
var halloweenEventEnabled = Talo.LiveConfig.GetProp<bool>("halloweenEventEnabled");
```

Or a number:

```c#
var maxLevel = Talo.LiveConfig.GetProp<int>("maxLevel");
```