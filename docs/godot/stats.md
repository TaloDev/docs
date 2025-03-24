---
sidebar_position: 7
---

# Stats

Talo stats let you track individual player data as well as aggregated global data - like how many items have been crafted or how many deaths a player has.

To create a stat, head over to [the dashboard](https://dashboard.trytalo.com), visit the stats page and create your first stat. Take note of the `Internal name` as this is how you'll be referring to your stat.

## Difference between stats and events

Stats allow you to have far more control over quantitative data using the limits you can set in the dashboard.

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

## Stat values

After updating a stat using `track()`, you can check the updated value for the player stat and global stat:

```gdscript
var res = await Talo.stats.track(stat_name)
print("%s, %s" % [res.value, res.stat.global_value])
```

## Stat history

You can fetch a history of updates to a stat for the current player using `Talo.stats.get_history()`. These results are paginated and can be filtered by specific start and end dates too:

```gdscript
func fetch_history() -> void:
	var res = await Talo.stats.get_history(stat_name)
	var changes := PackedStringArray(res.history.map(func(item): return str(item.change)))

	# e.g. "gold-collected changed by 100, 46, 82, 19, 104"
	print("%s changed by: %s" % [stat_name, ", ".join(changes)])
```

## Global stat history

For global stats, you can also fetch a history of updates from all players using `Talo.stats.get_global_history()`. This API is similar to the player stat history except that it is filterable by individual players and it returns metrics about the stat global value during the filtered time period:

```gdscript
func fetch_global_history() -> void:
	var res := await Talo.stats.get_global_history(stat_name)
	var global_value := res.global_value

	print("Min: %s, max: %s, median: %s, average: %s, average change: %s" % [
		global_value.min_value,
		global_value.max_value,
		global_value.median_value,
		global_value.average_value,
		global_value.average_change
	])
```
