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
