---
sidebar_position: 5
---

# Leaderboards

Talo leaderboards are highly customisable - for example you can configure the sort mode and whether entries must be unique (i.e. one or multiple per user).

To create a leaderboard, head over to [the dashboard](https://dashboard.trytalo.com), visit the leaderboards page and create your first leaderboard. Take note of the `Internal name` as this is how you'll be referring to your leaderboard.

## Getting entries

Leaderboard entries are paginated: a maximum of 50 entries come back with each request. Use `Talo.leaderboards.get_entries()` to retrieve an array of entries:

```gdscript title="get_entries_button.gd"
extends Button

@export var leaderboard_name: String

func _on_pressed() -> void:
  var res = await Talo.leaderboards.get_entries(leaderboard_name, 0)
  var entries = res[0]
  var count = res[1]
  var is_last_page = res[2]

  print("%s entries, is last page: %s" % [count, is_last_page])
```

### Getting entries for the current player

You can also get entries exclusively created by the current player using `Talo.leaderboards.get_entries_for_current_player()`.

## Creating entries

Use `Talo.leaderboards.add_entry()` to create an entry:

```gdscript title="add_entry_button.gd"
extends Button

@export var leaderboard_name: String

func _on_pressed() -> void:
  var score = RandomNumberGenerator.new().randi_range(1, 50)
  var res = await Talo.leaderboards.add_entry(leaderboard_name, score)

  print("Added score: %s, new high score: %s" % [score, res[1]])
```

This function returns a tuple of the entry and whether it was updated.

Updated entries are only relevant if the leaderboard is set to unique. Leaderboard entries won't be updated if they are not better (depending on the sort mode) than the player's previous entry.

## Entry cache

After fetching your leaderboard entries you can take advantage of the internal cache to construct your UI, removing the need for any subsequent network requests.

You can use `Talo.leaderboards.get_cached_entries()` in the same way as `get_entries()` above. Every entry fetched previously using `get_entries()` will exist in the cache. The same logic applies for `get_entries_for_current_player()` with `get_cached_entries_for_current_player()`.

Similarly, updated results from `add_entry()` will also be reflected in the cache - the entry returned from the response will be upserted and the positions of the other entries in the cache will be updated.
