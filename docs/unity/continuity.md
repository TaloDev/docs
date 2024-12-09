---
sidebar_position: 12
description: Talo Continuity is a resilience layer to keep your Unity game in sync if Talo can't be reached and when players are offline.
---

# Continuity

Talo Continuity is a resilience layer to keep your game in sync when Talo can't be reached.

Continuity runs behind the scenes and catches server errors (like 502 Bad Gateway, 503 Service Unavailable or 504 Gateway Timeout) or [UnityWebRequest errors](https://docs.unity3d.com/ScriptReference/Networking.UnityWebRequest.Result.html).

Failed requests are cached and replayed when network connectivity is re-established. Internally, a health check endpoint is polled to assess Talo's availability.

:::tip
Check out this [blog post on Continuity](https://trytalo.com/blog/continuity-announcement?utm_source=docs&utm_medium=tip) for more details
:::

## X-Talo-Continuity-Timestamp

Replayed requests send a special header indicating the original time when the request was made. Talo uses this header to set the `createdAt` of various entities like feedback, leaderboard entries and player stats.

## Configuring Continuity

As with anything on the client-side, despite being built with security in mind, Continuity could be exploited by bad actors. Depending on the type of game you're building, this could have varying consequences. You can disable continuity by unchecking `Continuity enabled` in your `Talo Settings` asset.

## Testing Continuity

Continuity happens in the background and there are no direct APIs exposed for it. You can simulate being offline and toggle Continuity in the Talo Playground. Note: toggling these options will automatically update your `Talo Settings` asset.
