---
sidebar_position: 8
---

# Separating development data

It's very common to test your development builds against Talo services you've already configured like stats and leaderboards.
Usually, you'll want to separate out development data from live data and Talo automates this for you.

If the [`OS.has_feature("debug")`](https://docs.godotengine.org/en/stable/tutorials/export/feature_tags.html) flag is set to true, any data sent from the Godot plugin is marked as development data and can be separated out in the dashboard.

Similarly, if the flag is set, development data will be included when fetching entities like leaderboard entries.

## Exporting your project

In order to correctly separate development data from production data, you need to ensure you are creating a "release" build by unticking `Export With Debug` before exporting your game:

![The Godot export window, showing the unticked export with debug option](/img/godot-export-debug.png)
