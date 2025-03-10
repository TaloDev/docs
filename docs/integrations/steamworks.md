---
sidebar_position: 1
description: Talo's Steamworks integration can sync your players, stats and leaderboards. You can authenticate players and verify their ownership of your game.
---

# Steamworks

By using your [Web API Publisher key](https://partner.steamgames.com/doc/webapi_overview/auth), you can sync data between Talo and Steamworks.

<hr/>

## Authentication

By setting up the Talo Steamworks integration, you are able to authenticate and identify players using the Steam User Auth API.

You'll need to pass the ticket generated by the [GetAuthTicketForWebApi](https://partner.steamgames.com/doc/api/ISteamUser#GetAuthTicketForWebApi) API when identifying players. Using this, Talo will automatically verify the session and sync the player.

Talo will also add helpful `props` to your player such as app ownership details and ban statuses.

More info is available in the [Godot plugin docs](/docs/godot/identifying#steamworks-integration) and [Unity package docs](/docs/unity/identifying#steamworks-integration).

<hr/>

## Leaderboards

Talo syncs leaderboards by mapping between the ID of the leaderboard in Talo and in Steamworks. If we cannot find a mapping, we will fall back to mapping between the Talo `Internal name` and the Steamworks `Name` (not the `Community name`). To ensure syncing works correctly, you may want to avoid manually updating the `Name` inside Steamworks.

### Creating leaderboards

When you create a leaderboard in Talo, we'll automatically create one in Steamworks too. Unfortunately, there are a few caveats:
- Unfortunately the Steamworks API doesn't allow us to push through display names, you will need to set a Community Name inside Steamworks to make the leaderboard "public"
- The `Unique` property will be ignored since Steamworks leaderboards only allow unique entries
- The Steamworks leaderboard will only allow trusted writes (i.e. from a server, not a client)

### Updating leaderboards

Unfortunately the Steamworks API does not have a way to update leaderboards. However, if the leaderboard does not exist in Steamworks, we will create it.

### Deleting leaderboards

When you delete a leaderboard in Talo, we'll also delete it in Steamworks.

### Setting scores

When a player submits a score, we'll also push that score through to your Steamworks leaderboard. It'll use the `KeepBest` method since as mentioned above, Steamworks leaderboards are always in unique mode.

### Toggling score visibility

If you hide an entry, we will delete it from the Steamworks leaderboard. If you then unhide the entry, we'll re-create it.

### Manually syncing leaderboards

Here's how it works:
1. We'll pull in your leaderboards from Steamworks
2. If a leaderboard exists in Talo and Steamworks ([by checking the mapping](#leaderboards)), we will update the `Sort mode`, `Name` and `Internal name` in Talo as well as set `Unique` to `true` (as all Steamworks leaderboards only allow unique entries)
3. If the leaderboard does not exist in Steamworks, we will [create it](#creating-leaderboards)
4. If the leaderboard does not exist in Talo, we will create a unique-mode leaderboard
5. For each of your players with a Steam alias, we will create or update entries from each leaderboard
6. If a leaderboard entry only exists in Talo, we will create it for your Steamworks leaderboard

<hr/>

## Stats

Talo syncs stats by mapping between the `Internal name` in Talo and the `API name` in Steamworks. To ensure syncing works correctly, you may want to avoid manually updating the `API name` inside Steamworks.

### Setting stats

When a stat changes for a player, we'll update it in Steamworks.

### Manually syncing stats

Here's how it works:
1. We'll pull in your stats from Steamworks - each `Set by` needs to be `GS` in order for us to find the stat
2. If a stat exists in Talo and Steamworks ([by checking the mapping](#stats)), we will update the `Default value` and `Name` in Talo
3. If the stat does not exist in Talo, we will create a non-global stat with a matching `Internal name` and `Name` to the Steamworks one
4. Unfortunately, if the stat does not exist in Steamworks, we cannot create one, you will need to do this manually
5. For each of your players with a Steam alias, we will update their stats with the ones from Steamworks
6. If a player stat only exists in Talo, we will push it through to Steamworks
