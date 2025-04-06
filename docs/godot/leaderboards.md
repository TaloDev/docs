---
sidebar_position: 5
---

# Leaderboards

Talo leaderboards are highly customisable - for example you can configure the sort mode and whether entries must be unique (i.e. one or multiple per user).

To create a leaderboard, head over to [the dashboard](https://dashboard.trytalo.com), visit the leaderboards page and create your first leaderboard. Take note of the `Internal name` as this is how you'll be referring to your leaderboard.

:::tip
Check out this blog post on [how to build quick & easy leaderboards in Godot](https://trytalo.com/blog/leaderboards-godot?utm_source=docs&utm_medium=tip) for a detailed walkthrough
:::

## Getting entries

Leaderboard entries are paginated: a maximum of 50 entries come back with each request. Use `Talo.leaderboards.get_entries()` to retrieve an array of entries:

```gdscript title="get_entries_button.gd"
extends Button

@export var leaderboard_name: String

func _on_pressed() -> void:
	var res := await Talo.leaderboards.get_entries(leaderboard_name, 0)
	var entries: Array[TaloLeaderboardEntry] = res.entries
	var count: int = res.count
	var is_last_page: bool = res.is_last_page

	print("%s entries, is last page: %s" % [count, is_last_page])
```

### Getting entries for the current player

You can also get entries exclusively created by the current player using `Talo.leaderboards.get_entries_for_current_player()`.

### Getting archived entries

If your leaderboard uses refresh intervals (i.e. daily, weekly, monthly, yearly) you can get archived entries using the final parameter (`include_archived`) of `get_entries()` or `get_entries_for_current_player()`.

```gdscript
var res := await Talo.leaderboards.get_entries(leaderboard_name, 0, -1, true)
# or
var res := await Talo.leaderboards.get_entries_for_current_player(leaderboard_name, 0, true)
```

## Creating entries

Use `Talo.leaderboards.add_entry()` to create an entry:

```gdscript title="add_entry_button.gd"
extends Button

@export var leaderboard_name: String

func _on_pressed() -> void:
	var score := RandomNumberGenerator.new().randi_range(1, 50)
	var res := await Talo.leaderboards.add_entry(leaderboard_name, score)

	print("Added score: %s, at position: %s, new high score: %s" % [score, res.position, "yes" if res.updated else "no"])
```

This function returns an `AddEntryResult` that includes the updated entry and whether their highscore should be updated.

Updated entries are only relevant if the leaderboard is set to unique. Leaderboard entries won't be updated if they are not better (depending on the sort mode) than the player's previous entry.

## Entry cache

After fetching your leaderboard entries you can take advantage of the internal cache to construct your UI, removing the need for any subsequent network requests.

You can use `Talo.leaderboards.get_cached_entries()` in the same way as `get_entries()` above. Every entry fetched previously using `get_entries()` will exist in the cache. The same logic applies for `get_entries_for_current_player()` with `get_cached_entries_for_current_player()`.

Similarly, updated results from `add_entry()` will also be reflected in the cache - the entry returned from the response will be upserted and the positions of the other entries in the cache will be updated.

## Entry props

Along with a score, you can also send a dictionary of `props` with an entry. The key/value pairs will be stringified and can be used to, filter leaderboards on specific properties. For example, you could send a `team` prop:

```gdscript
func _on_submit_pressed() -> void:
	await Talo.players.identify("username", username.text)
	var score := RandomNumberGenerator.new().randi_range(0, 100)
	var team := "Blue" if RandomNumberGenerator.new().randi_range(0, 1) == 0 else "Red"

	var res := await Talo.leaderboards.add_entry(leaderboard_internal_name, score, { team = team })
	info_label.text = "You scored %s points for the %s team!" % [score, team]

	_build_entries()
```

You could then have a function that populates the leaderboard and checks if a team filter is active:

```gdscript
func _build_entries() -> void:
	for child in entries_container.get_children():
		child.queue_free()

	var entries := Talo.leaderboards.get_cached_entries(leaderboard_internal_name)
	if _filter != "All": # e.g. "Blue" or "Red"
		entries = entries.filter(func (entry: TaloLeaderboardEntry): return entry.get_prop("team", "") == _filter)

	for entry in entries:
		entry.position = entries.find(entry)
		_create_entry(entry)
```

The code above is available in the leaderboards sample included with the Talo Godot plugin.
