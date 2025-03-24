---
sidebar_position: 7
---

# Stats

Talo stats let you track individual player data as well as aggregated global data - like how many items have been crafted or how many deaths a player has.

To create a stat, head over to [the dashboard](https://dashboard.trytalo.com), visit the stats page and create your first stat. Take note of the `Internal name` as this is how you'll be referring to your stat.

:::tip
Check out this blog post on [how to track player stats in Unity](https://trytalo.com/blog/stat-tracking-unity?utm_source=docs&utm_medium=tip) for a detailed walkthrough
:::

## Difference between stats and events

Stats allow you to have far more control over quantitative data using the limits you can set in the dashboard.

## Tracking stats

You can track a stat using the Stats API `Track()` function which takes your stat's `internalName` and the amount to change the stat by (default 1.0f):

```csharp title="PlayerDeathController.cs"
public void OnDeath()
{
	Talo.Stats.Track('deaths')
}
```

```csharp title="PlayerPotionController.cs"
private float health;

public void OnHeal(Potion potion)
{
	health += potion.amount
	Talo.Stats.Track('health-healed', potion.amount)
}
```

## Stat values

After updating a stat using `Track()`, you can check the updated value for the player stat and global stat:

```csharp
var res = await Talo.Stats.Track('gold-collected', 104);
Debug.Log($"{res.playerStat.value}, {stat.playerStat.stat.globalValue}")
```

## Stat history

You can fetch a history of updates to a stat for the current player using `Talo.Stats.GetHistory()`. These results are paginated and can be filtered by specific start and end dates too:

```csharp
private async void FetchHistory()
{
	try
	{
		var res = await Talo.Stats.GetHistory(statInternalName);

		// e.g. "gold-collected changed by 100, 46, 82, 19, 104"
		Debug.Log($"{statInternalName} changed by: {string.Join(", ", res.history.Select((item) => item.change))}");
	}
	catch (Exception err)
	{
		Debug.LogError(err.Message);
		throw err;
	}
}
```

## Global stat history

For global stats, you can also fetch a history of updates from all players using `Talo.Stats.GetGlobalHistory()`. This API is similar to the player stat history except that it is filterable by individual players and it returns metrics about the stat global value during the filtered time period:

```csharp
private async void FetchGlobalHistory()
{
	try
	{
		var res = await Talo.Stats.GetGlobalHistory(statInternalName);

		ResponseMessage.SetText($"Min: {res.globalValue.minValue}, max: {res.globalValue.maxValue}, median: {res.globalValue.medianValue}, average: {res.globalValue.averageValue}, average change: {res.globalValue.averageChange}");
	}
	catch (Exception err)
	{
		Debug.LogError(err.Message); // e.g. stat isn't global
		throw err;
	}
}
```