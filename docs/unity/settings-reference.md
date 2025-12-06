---
sidebar_position: 1
description: Talo's Unity package gives you access to a highly configurable open source game backend.
---

# Settings reference

After creating a Talo Settings Asset, you'll be able to customise the configuration options listed on this page.

You can find all the settings in the `TaloSettings.cs` script.

## Accessing settings

You can use the `Talo.Settings` object to get or set individual options.

## Settings

### accessKey

This is generated on [the Talo dashboard](https://dashboard.trytalo.com). You'll need to fill out your `accessKey` before making requests to the Talo API.

The scopes on your access key determine whether certain actions can be performed. For example, if you want to fetch leaderboard entries, you'll need the `read:leaderboards` scope. If you want to create leaderboard entries, you'll need the `write:leaderboards` scope.

At a minimum, the Talo Unity package requires the `read:players` and `write:players` scopes.

### apiUrl

This is the location of the Talo API. The default cloud version is `https://api.trytalo.com`. If you're [self-hosting Talo](/docs/selfhosting/overview), this should be the address of your `backend` container.

### socketUrl

This is usually the same as your `apiUrl` but with the `ws` or `wss` protocol.

### autoConnectSocket

If enabled, the package will automatically connect to the Talo Socket when the game starts.

### webGLEventFlushRate

Talo uses the `OnApplicationQuit()` message to flush events before the game is closed. This is not available on the WebGL platform so a timer is used to flush events periodically instead. This setting controls how often events are flushed (in seconds).

Learn more about [event flushing here](/docs/unity/events#flushing).

### cachePlayerOnIdentify

If enabled, Talo will automatically cache the player after a successful online identification. If the player is offline and tries to identify in later sessions, Talo will attempt to use the cached the player data.

### continuityEnabled

If enabled, Talo will try to automatically replay failed network requests - [learn more about Continuity here](/docs/unity/continuity).

### autoStartSession

If enabled and a valid session token is found, the player will be automatically authenticated. This is documented on the [Player Authentication page](/docs/unity/player-authentication#automatic-logins).

### logRequests

If enabled, requests to the Talo API will be logged to the console.

### logResponses

If enabled, responses from the Talo API will be logged to the console.

### offlineMode

If enabled, Talo will simulate the player not having an internet connection. This is primarily useful for testing.
