---
sidebar_position: 3
---

# Player props

Players can have a list of arbitrary properties that are persisted across all of their aliases. These props are identified by their unique key and can have any string value. You can modify player properties using utility functions exposed by the `CurrentPlayer`.

## Getting

You can retrieve the current player's props using `Talo.CurrentPlayer.props`. To retrieve a single prop use `Talo.CurrentPlayer.GetProp()` (where you can also specify a fallback).

## Setting

You can set props using `Talo.CurrentPlayer.SetProp()`. If a prop with specified key doesn't exist it'll be created, otherwise the existing prop with the same key will be updated.

## Deleting

Props can be deleted with `Talo.CurrentPlayer.DeleteProp()` or by using `Talo.CurrentPlayer.SetProp()` and setting the value to `null`.
