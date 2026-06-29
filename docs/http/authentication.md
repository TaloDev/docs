---
sidebar_position: 1
description: Talo is an open source game backend with an API to easily authenticate players and add interactive elements to your game.
---

# Authentication

After [creating an access key](/docs/unity/install#generate-an-access-key), you should use it in the `Authorization` header:

```
curl \
-X POST \
-H 'Authorization: Bearer eyJhb..........w5c' \
-H 'Content-type: application/json' \
'https://api.trytalo.com/v1/events'
```

## Player authentication

When calling API endpoints on behalf of a player that is using [player authentication](https://trytalo.com/players#authentication) you must send the following headers:

1. `x-talo-player`: the ID of the player
2. `x-talo-alias`: the ID of the player's identified alias
3. `x-talo-session`: the session token received after registering or logging-in a player

:::tip
The Godot plugin and Unity package will automatically populate these headers for you. If you're receiving session-related errors, visit the [Common errors](/docs/http/common-errors#missing-or-invalid-session) page for more information.
:::

## Session token lifetimes

By default, session tokens returned by [register, login, verify, and refresh](/docs/http/player-auth-api) are long-lived and do not need to be renewed. Your game can store the token on the device and reuse it for as long as the player keeps playing.

If you prefer shorter-lived sessions, you can opt in to the refresh token flow using the `withRefresh` parameter. When enabled:

- The session token expires after **15 minutes**.
- A **30-day refresh token** is returned alongside it.
- Call the [refresh session](/docs/http/player-auth-api) endpoint with the refresh token to receive a new session and refresh token.
