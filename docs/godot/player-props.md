---
sidebar_position: 3
description: Players can have arbitrary properties that are persisted across all of their aliases and across sessions. Props can be viewed and modified from the dashboard.
---

# Player props

Players can have a list of arbitrary properties that are persisted across all of their aliases. These props are identified by their unique key and can have any string value. You can modify player properties using utility functions exposed by the `current_player`.

## Getting

You can retrieve the current player's props using `Talo.current_player.props`. To retrieve a single prop use `Talo.current_player.get_prop()` (where you can also specify a fallback).

## Setting

You can set props using `Talo.current_player.set_prop()`. If a prop with specified key doesn't exist it'll be created, otherwise the existing prop with the same key will be updated.

## Deleting

Props can be deleted with `Talo.current_player.delete_prop()` or by using `Talo.current_player.set_prop()` and setting the value to `null`.
