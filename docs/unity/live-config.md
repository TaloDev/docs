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

## Example - polling the live config and updating the UI

You can attach this script to a TextMeshPro GameObject to update the text value every 2 seconds:

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
