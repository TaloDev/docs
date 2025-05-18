---
sidebar_position: 3
description: Players can have arbitrary properties that are persisted across all of their aliases and across sessions. Props can be viewed and modified from the dashboard.
---

# Players and props

## Accessing players

After identifying a player, you can access the underlying player object using `Talo.current_player`.

You can also find a player by their ID using `Talo.players.find()`. Players retrieved this way are read-only: you can only modify or take actions on behalf of a player that was previously identified.

## Getting and setting props

Players can have a list of arbitrary properties that are persisted across all of their aliases. These props are identified by their unique key and can have any string value.

### Getting props

You can retrieve the current player's props using `Talo.current_player.props`. To retrieve a single prop use `Talo.current_player.get_prop()` (where you can also specify a fallback).

### Setting props

You can set props using `Talo.current_player.set_prop()`. If a prop with specified key doesn't exist it'll be created, otherwise the existing prop with the same key will be updated.

:::warning
Player props are not linearisable - simultaneous requests may be applied out of order. You should avoid setting or deleting props in `_process()` functions.
:::

### Deleting props

Props can be deleted with `Talo.current_player.delete_prop()` or by using `Talo.current_player.set_prop()` and setting the value to `null`.
