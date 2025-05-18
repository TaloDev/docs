---
sidebar_position: 3
description: Players can have arbitrary properties that are persisted across all of their aliases and across sessions. Props can be viewed and modified from the dashboard.
---

# Players and props

## Accessing players

After identifying a player, you can access the underlying player object using `Talo.CurrentPlayer`.

You can also find a player by their ID using `Talo.Players.Find()`. Players retrieved this way are read-only: you can only modify or take actions on behalf of a player that was previously identified.

## Getting and setting props

Players can have a list of arbitrary properties that are persisted across all of their aliases. These props are identified by their unique key and can have any string value.

### Getting props

You can retrieve the current player's props using `Talo.CurrentPlayer.props`. To retrieve a single prop use `Talo.CurrentPlayer.GetProp()` (where you can also specify a fallback).

### Setting props

You can set props using `Talo.CurrentPlayer.SetProp()`. If a prop with specified key doesn't exist it'll be created, otherwise the existing prop with the same key will be updated.

:::warning
Player props are not linearisable - simultaneous requests may be applied out of order. You should avoid setting or deleting props in `Update()` functions.
:::

### Deleting props

Props can be deleted with `Talo.CurrentPlayer.DeleteProp()` or by using `Talo.CurrentPlayer.SetProp()` and setting the value to `null`.
