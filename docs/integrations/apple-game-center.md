---
sidebar_position: 3
description: Use Talo's native Apple Game Center integration to automatically identify players signed in to Game Center.
---

# Apple Game Center

Using your app's Bundle ID, you can automatically identify players signed in to Apple Game Center.

You can enable this integration on the [integrations page](https://dashboard.trytalo.com/integrations).

![The Talo integrations page showing the Apple Game Center settings](/img/apg-integration.png)

<hr/>

## Authentication

To get started, enter your app's Bundle ID into the dashboard. Talo will use this to verify the identity verification signature provided by Game Center.

To identify a player, fetch the local player's identity verification signature from Game Center and pass the values to Talo. Talo will cryptographically verify the signature against Apple's public key and automatically identify the player without them needing to create an account.

More info is available in the [Godot plugin docs](/docs/godot/identifying#apple-game-center-integration) and [Unity package docs](/docs/unity/identifying#apple-game-center-integration).
