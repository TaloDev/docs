---
sidebar_position: 2
description: Talo is an open source game backend that allows you to easily add leaderboards, stats, data persistence and more to your Godot game.
---

# Exporting your project

## Android exports

:::warning
When exporting to Android, you must enable the `INTERNET` permission in the export preset before exporting the project.
:::

## Separating development data

It's common to test your development builds against services you've already configured, like stats and leaderboards. To avoid mixing development data with your live data, Talo automates this for you.

When the [`OS.has_feature("debug")`](https://docs.godotengine.org/en/stable/tutorials/export/feature_tags.html) flag is set to true, any data sent from the Godot plugin is marked as **development data**. This allows you to easily separate it in your Talo dashboard.

Talo will only fetch development data for development builds. Live builds will only include live data.

### Export with debug

To create a "release" build that uses live data, untick the "Export With Debug" option when exporting your game. This prevents the `OS.has_feature("debug")` feature tag from being attached, so Talo will treat this as a live build.

![The Godot export window, showing the unticked export with debug option](/img/godot-export-debug.png)

### Feature tag overrides

You can override this behavior above with the `talo_dev` and `talo_live` feature tags

- `talo_dev`: Marks the build as development, regardless of the debug feature flag.
- `talo_live`: Marks the build as live, regardless of the debug feature flag.

![The Godot export window, showing the talo_dev feature attached](/img/godot-export-feature-tags.png)
