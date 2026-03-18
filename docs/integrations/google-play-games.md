---
sidebar_position: 2
description: Use Talo's native Google Play Games integration to automatically identify players signed in to Google.
---

# Google Play Games

Using [Game Server credentials](https://developer.android.com/games/pgs/console/setup#generate_an_oauth_20_client_id), you can automatically identify players signed in to Google Play Games.

You can enable this integration on the [integrations page](https://dashboard.trytalo.com/integrations).

![The Talo integrations page showing the Google Play Games settings](/img/gpg-integration.png)

<hr/>

## Authentication

To get started, [create an OAuth client](https://developer.android.com/games/pgs/console/setup#generate_an_oauth_20_client_id) (ensure you create credentials for a **Game server**) and copy the details into the dashboard.

To identify a player, [request a server auth code](https://developer.android.com/games/pgs/android/server-access) and pass the code to Talo. Talo will automatically sync the player without them needing to create an account.

Talo will also add helpful `props` to your player such as their display name and avatar URL.

More info is available in the [Godot plugin docs](/docs/godot/identifying#google-play-games-integration) and [Unity package docs](/docs/unity/identifying#google-play-games-integration).
