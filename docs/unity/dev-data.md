---
sidebar_position: 8
---

# Separating development data

It's very common to test your development builds against Talo services you've already configured like stats and leaderboards.
Usually, you'll want to separate out development data from live data and Talo automates this for you.

If the [`Debug.isDebugBuild`](https://docs.unity3d.com/ScriptReference/Debug-isDebugBuild.html) flag is set to true, any data sent from the Unity package is marked as development data and can be separated out in the dashboard.

Similarly, if the flag is set, development data will be included when fetching entities like leaderboard entries.

### "Dev" players

Dev players are players created in development builds (see below). Their data will be permanently marked as development data - regardless if they create any new data in release builds. In the dashboard, this is denoted by orange backgrounds:

![Dev data highlighted in the dashboard](/img/dev-data.png)
