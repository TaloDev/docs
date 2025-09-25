---
sidebar_position: 13
description: Talo Continuity is a resilience layer to keep your Godot game in sync if Talo can't be reached and when players are offline.
---

# Continuity + offline mode

Talo is designed to work both online and offline through a combination of Continuity (described below) and offline file caches. The interactions described on this page are enabled by default and some of them can be toggled off via settings.

## What is Continuity?

Talo Continuity is a resilience layer to keep your game in sync when Talo can't be reached.

Continuity runs behind the scenes and catches server errors (like 502 Bad Gateway, 503 Service Unavailable or 504 Gateway Timeout) or [Godot network errors](https://docs.godotengine.org/en/stable/classes/class_httprequest.html#enum-httprequest-result).

Failed requests are cached and replayed when network connectivity is re-established. Internally, a health check endpoint is polled to assess Talo's availability.

:::tip
Check out this [blog post on Continuity](https://trytalo.com/blog/continuity-announcement?utm_source=docs&utm_medium=tip) for more details
:::

### Continuity timestamp

Replayed requests automatically send a special header indicating the original time when the request was made. Talo uses this header to set the `created_at` of various entities like feedback, leaderboard entries and player stats.

### Configuring Continuity

As with anything on the client-side, Continuity could potentially be exploited by bad actors. Depending on the type of game you're building, this could have varying consequences. You can disable continuity by setting `enabled` to false under the `[continuity]` section of your `addons/talo/settings.cfg`.

### Testing Continuity

Continuity happens in the background and there are no direct APIs exposed for it. You can simulate being offline and toggle Continuity in the Talo Playground scene.
Note: toggling these options will not update your `settings.cfg`.

If you have [request logging enabled](settings-reference#loggingrequests), the replayed requests will be highlighted for you in the console.

## Offline interactions

### Checking if the player is offline

`Talo.is_offline()` returns a boolean indicating if offline mode is enabled. Offline mode occurs when Talo can't be reached (server unavailable or no internet connection) or when the [`debug.offline_mode` setting](settings-reference#debugoffline_mode) is enabled.

Use this function to handle custom offline interactions, such as building your own offline caches.

### Player identification

After a successful online identification, player data is cached locally for future offline use. You can disable this interaction with the [`cache_player_on_identify` setting](settings-reference#cache_player_on_identify).

Note: players cannot be created while offline.

### Game saves

All player saves are cached locally and automatically loaded when offline. Updates to save files are mirrored to the offline cache.

Saves sync automatically when connectivity is restored. If the offline save is newer than the latest version of the online save, the offline save will become the new latest version.

### Live config

Live config data is cached locally after successful online queries. Updates are synced with the local cache, which is used when the player is offline.
