---
sidebar_position: 9
description: Talo is an open source game backend that allows you to easily add leaderboards, stats, data persistence and more to your Godot game.
---

# Exporting your project

## Android exports

:::warning
When exporting to Android, you must enable the `INTERNET` permission in the export preset before exporting the project.
:::

## Separating development data

In order to correctly [separate development data](/docs/godot/dev-data) from production data, you need to ensure you are creating a "release" build by unticking `Export With Debug` before exporting your game:

![The Godot export window, showing the unticked export with debug option](/img/godot-export-debug.png)
