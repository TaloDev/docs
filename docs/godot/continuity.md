---
sidebar_position: 12
---

# Continuity

Talo Continuity is a resilience layer to keep your game in sync when Talo can't be reached.

Continuity runs behind the scenes and catches server errors (like 502 Bad Gateway, 503 Service Unavailable or 504 Gateway Timeout) or [Godot network errors](https://docs.godotengine.org/en/stable/classes/class_httprequest.html#enum-httprequest-result).

Failed requests are cached and replayed when network connectivity is re-established. Internally, a health check endpoint is polled to assess Talo's availability.

## X-Talo-Continuity-Timestamp

Replayed requests send a special header indicating the original time when the request was made. Talo uses this header to set the `created_at` of various entities like feedback, leaderboard entries and player stats.

## Configuring Continuity

As with anything on the client-side, despite being built with security in mind, Continuity could be exploited by bad actors. Depending on the type of game you're building, this could have varying consequences. You can disable continuity by setting `enabled` to false under the `[continuity]` section of your `addons/talo/settings.cfg`.

## Testing Continuity

Continuity happens in the background and there are no direct APIs exposed for it. You can simulate being offline and toggle Continuity in the Talo Playground. Note: toggling these options will not update your `settings.cfg`.

If you have [request logging enabled](install#create-and-update-settings), the replayed requests will be highlighted for you in the console.
