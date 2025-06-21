---
sidebar_position: 7
---

# Stats

Talo stats let you track individual player data as well as aggregated global data - like how many items have been crafted or how many deaths a player has.

To create a stat, head over to [the dashboard](https://dashboard.trytalo.com), visit the stats page and create your first stat. Take note of the `Internal name` as this is how you'll be referring to your stat.

:::tip
Check out this blog post on [how to track player stats in Godot](https://trytalo.com/blog/stat-tracking-godot?utm_source=docs&utm_medium=tip) for a detailed walkthrough
:::

## Getting stats

You can list all available stats using `Talo.stats.get_stats()`. This will return all the constraint data defined in the dashboard like the `default_value`, `max_change` and `max_value`. This will also return the global values for global stats:

```gdscript
var res := await Talo.stats.get_stats()
var all_stats := PackedStringArray(res.map(func(item: TaloStat): return item.internal_name))
var internal_names := ", ".join(all_stats)

## e.g. Stats: gold-collected, health-healed, deaths
print("Stats: %s" % [internal_names])
```

### Fetching individual stats

If you already have the internal name of a stat, you can use `Talo.stats.find()` and pass in the internal name to return data for a single stat.

## Tracking stats

You can track a stat using the Stats API `track()` function which takes your stat's `internal_name` and the amount to change the stat by (default 1.0):

```gdscript title="player.gd"
func on_death() -> void:
	Talo.stats.track('deaths')
```

```gdscript title="player_potion.gd"
var health: float

func on_heal(potion: Potion) -> void:
	health += potion.amount
	Talo.stats.track('health-healed', potion.amount)
```

### Stat values

After updating a stat using `track()`, you can check the updated value for the player stat and global stat:

```gdscript
var res := await Talo.stats.track(stat_name)
print("%s, %s" % [res.value, res.stat.global_value])
```

You can also get the current value of a stat for a player using `Talo.stats.find_player_stat()`.

## Stat history

You can fetch a history of updates to a stat for the current player using `Talo.stats.get_history()`. These results are paginated and can be filtered by specific start and end dates too:

```gdscript
func fetch_history() -> void:
	var res := await Talo.stats.get_history(stat_name)
	var changes := PackedStringArray(res.history.map(func(item): return str(item.change)))

	# e.g. "gold-collected changed by 100, 46, 82, 19, 104"
	print("%s changed by: %s" % [stat_name, ", ".join(changes)])
```

## Global stat history

For global stats, you can also fetch a history of updates from all players using `Talo.stats.get_global_history()`. This API is similar to the player stat history except that it is filterable by individual players and it returns metrics about the stat during the filtered time period:

```gdscript
func fetch_global_history() -> void:
	var global_metrics := res.global_value
	var player_metrics := res.player_value

	print("Min: %s, max: %s, median: %s, average: %s, average change: %s, average player value: %s" % [
		global_metrics.min_value,
		global_metrics.max_value,
		global_metrics.median_value,
		global_metrics.average_value,
		global_metrics.average_change,
		player_metrics.average_value
	])
```
