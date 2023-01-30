---
sidebar_position: 3
---

# Separating development data

It's very common to test your development builds against Talo services you've already configured like stats and leaderboards.
Usually, you'll want to separate out development data from live data and Talo automates this for you.

If the `X-Talo-Dev-Build` header is set to `1`, any data being sent will be marked as development data and can be separated out in the dashboard.

To also include development data when fetching entities (like leaderboard entries), you should set the `X-Talo-Include-Dev-Data` header to `1`.
