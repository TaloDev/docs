---
sidebar_position: 10
---

# Live config

Live config lets you push state directly to your game from [the Talo dashboard](https://dashboard.trytalo.com) without needing to release an update.

:::tip
Check out this blog post on [how to release Unity game updates without new builds](https://trytalo.com/blog/live-config-unity?utm_source=docs&utm_medium=tip) for a detailed walkthrough
:::

## Getting the live config

The live config needs to be fetched before it can be queried. To do this call `Talo.GameConfig.Get()`.
This will invoke the `Talo.GameConfig.OnLiveConfigLoaded()` event that returns the newly initialised config.

You can fetch the game config any time to refresh the state.

## Querying the live config

You can query properties of the config using `Talo.LiveConfig.GetProp<T>()`, for example if you wanted to get a boolean value:

```csharp
var halloweenEventEnabled = Talo.LiveConfig.GetProp<bool>("halloweenEventEnabled");
```

Or a number:

```csharp
var maxLevel = Talo.LiveConfig.GetProp<int>("maxLevel");
```

This function also has a second argument which is the default value to return if the property is not found.

### Offline cache

If the player is offline (determined using `await Talo.IsOffline()`), an offline copy of the live config will be returned instead. The cached version is updated after a successful online `Get()` call. Note: the offline cache can be `null` if the live config hasn't been successfully queried before.

You can check when the offline config was last updated using `Talo.LiveConfig.GetOfflineConfigLastModified()` which returns a Unix timestamp.

## Listening for live config updates

You can listen for live config updates by connecting to the `Talo.GameConfig.OnLiveConfigUpdated` event:

```csharp
void Start()
{
	var textUI = GetComponent<TextMeshProUGUI>();

	Talo.GameConfig.OnLiveConfigUpdated += (liveConfig) =>
	{
		textUI.text = liveConfig.GetProp("liveString", "Not set!");
	};
}
```

The `OnLiveConfigUpdated` event is invoked via the [Talo Socket](./socket) whenever the live config is updated from the Talo dashboard.

### Alternative example - polling the live config with a timer

If you prefer not to use the Talo Socket, you can attach this example script to a TextMeshPro GameObject to update the text value every 2 seconds:

```csharp
using UnityEngine;
using TaloGameServices;
using TMPro;

public class TextLoader : MonoBehaviour
{
	void Start()
	{
		var textUI = GetComponent<TextMeshProUGUI>();

		Talo.GameConfig.OnLiveConfigLoaded += (liveConfig) =>
		{
			textUI.text = liveConfig.GetProp("liveString", "Not set!");
		};

		InvokeRepeating("GetConfig", 0f, 2f);
	}

	async void GetConfig()
	{
		await Talo.GameConfig.Get();
	}
}
```
