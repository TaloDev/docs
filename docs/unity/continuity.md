---
sidebar_position: 12
description: Talo Continuity is a resilience layer to keep your Unity game in sync if Talo can't be reached and when players are offline.
---

# Continuity + offline mode

Talo is designed to work both online and offline through a combination of Continuity (described below) and offline file caches. The interactions described on this page are enabled by default and some of them can be toggled off via settings.

## Continuity

Talo Continuity is a resilience layer to keep your game in sync when Talo can't be reached.

Continuity runs behind the scenes and catches server errors (like 502 Bad Gateway, 503 Service Unavailable or 504 Gateway Timeout) or [UnityWebRequest errors](https://docs.unity3d.com/ScriptReference/Networking.UnityWebRequest.Result.html).

Failed requests are cached and replayed when network connectivity is re-established. Internally, a health check endpoint is polled to assess Talo's availability.

:::tip
Check out this [blog post on Continuity](https://trytalo.com/blog/continuity-announcement?utm_source=docs&utm_medium=tip) for more details
:::

### Continuity timestamp

Replayed requests send a special header indicating the original time when the request was made. Talo uses this header to set the `createdAt` of various entities like feedback, leaderboard entries and player stats.

### Configuring Continuity

As with anything on the client-side, despite being built with security in mind, Continuity could be exploited by bad actors. Depending on the type of game you're building, this could have varying consequences. You can disable continuity by unchecking `Continuity enabled` in your `Talo Settings` asset.

### Testing Continuity

Continuity happens in the background and there are no direct APIs exposed for it. You can simulate being offline and toggle Continuity in the Talo Playground. Note: toggling these options will automatically update your `Talo Settings` asset.

## Network connection events

Talo fires events when network connectivity changes, allowing you to respond to connection issues in your game.

### `OnConnectionLost`

Fired when Talo loses connection to the server. This happens when health checks fail or network errors occur.

```csharp
private void Start()
{
	Talo.OnConnectionLost += OnConnectionLost;
}

private void OnDestroy()
{
	Talo.OnConnectionLost -= OnConnectionLost;
}

private void OnConnectionLost()
{
	Debug.Log("Connection to Talo lost");
	// handle offline state (e.g., show an offline indicator)
}
```

### `OnConnectionRestored`

Fired when connection to Talo is re-established after being lost.

```csharp
private void Start()
{
	Talo.OnConnectionRestored += OnConnectionRestored;
}

private void OnDestroy()
{
	Talo.OnConnectionRestored -= OnConnectionRestored;
}

private void OnConnectionRestored()
{
	Debug.Log("Connection to Talo restored");
	// handle online state (e.g., hide an offline indicator)
}
```

## Offline interactions

### Checking if the player is offline

`Talo.IsOffline()` returns a boolean indicating if offline mode is enabled. Offline mode occurs when Unity detects that the player is offline or when the [`offlineMode` setting](settings-reference#offlinemode) is enabled.

Use this function to handle custom offline interactions, such as building your own offline caches.

### Player identification

After a successful online identification, player data is cached locally for future offline use. You can disable this interaction with the [`cachePlayerOnIdentify` setting](settings-reference#cacheplayeronidentify).

Note: players cannot be created while offline.

### Game saves

All player saves are cached locally and automatically loaded when offline. Updates to save files are mirrored to the offline cache.

Saves sync automatically when connectivity is restored. If the offline save is newer than the latest version of the online save, the offline save will become the new latest version.

### Live config

Live config data is cached locally after successful online queries. Updates are synced with the local cache, which is used when the player is offline.

### Talo socket

When connection is restored, the Talo socket automatically reconnects by repeating the socket token identification flow. This happens seamlessly in the background without requiring manual intervention.
