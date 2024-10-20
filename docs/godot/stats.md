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
