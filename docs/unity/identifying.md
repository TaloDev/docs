---
sidebar_position: 2
description: The Talo Unity package allows you to identify multiple aliases, authenticate and sync your players with Steamworks.
---

# Identifying a player

## Aliases

Players within your Talo account can have multiple aliases.
For example, a player could have Steam and Epic Games login credentials but both would be tied to them, allowing the player to use either to log in.

You should identify a player after they have authenticated and before you attempt to track any events, add leaderboard entries or do anything related directly to the player.

## Identifying

You can identify a player using `Talo.Players.Identify()`. The code sample below shows you how you could identify a player using a UI element (this example is also available in the Playground):

```csharp title="IdentifyPlayer.cs"
using TaloGameServices;

public class IdentifyPlayer: MonoBehaviour
{
	public string service = 'steam', identifier = '123456';

	public void OnButtonClick()
	{
		Identify();
	}

	private async void Identify()
	{
		try
		{
			await Talo.Players.Identify(service, identifier);
		}
		catch (Exception ex)
		{
			Debug.LogError(ex.Message);
		}
	}
}
```

:::caution
You cannot use "Talo" for the `service` parameter as this is reserved for **Talo Player Authentication**.

If you are using Talo Player Authentication, `Talo.Players.Identify()` will be invoked automatically and the `Talo.Players.OnIdentified` event will also invoke as normal.

Visit the [Player authentication docs](/docs/unity/player-authentication) to learn more about identifying players with authentication enabled.
:::

### The "OnIdentified" event

After a successful identification, the `Talo.Players.OnIdentified()` event will invoke, returning the identified player. This allows you to, for example, immediately fetch that player's saves:

```csharp
Talo.Players.OnIdentified += async (player) =>
{
	await Talo.Saves.GetSaves();
};
```

### The "OnIdentificationStarted" and "OnIdentificationFailed" events

When `Talo.Players.Identify()` is called, the `Talo.Players.OnIdentificationStarted` event is invoked.

If identification fails, the `Talo.Players.OnIdentificationFailed` event is invoked.

## Checking identification

Sometimes you might need to check if a player has been identified before. You can use `Talo.IdentityCheck()` to verify this - it throws an error if a player hasn't been identified yet:

```csharp
public void DoStuffIfIdentified()
{
	try
	{
	  Talo.IdentityCheck();
	}
	catch (Exception ex)
	{
		return;
	}

	// do stuff
}
```

## Clearing the identified player

You can clear the current player using `Talo.Players.ClearIdentity()`. This will set `Talo.CurrentAlias` and `Talo.CurrentPlayer` to `null`. It will also clear any cached or pending data that identifies the player like the offline alias cache, pending events and continuity requests. For players using Talo authentication, it will also clear session data.

Once all the relevant data has been cleared, the `Talo.Players.OnIdentityCleared` event will be fired.

```csharp
private async void ClearIdentity()
{
    try
    {
        await Talo.Players.ClearIdentity();
    }
    catch (Exception ex)
    {
        Debug.LogError($"Failed to clear identity: {ex.Message}");
    }
}

// Listen for the identity cleared event
void Start()
{
    Talo.Players.OnIdentityCleared += () =>
    {
        Debug.Log("Player identity has been cleared");
        // Handle post-clear logic here
    };
}
```

## Merging players

As described above, sometimes a player may have one or more aliases and there are times where you know for certain some aliases belong to the same player.
You can merge players using `Talo.Players.Merge()` by providing the IDs of both players.

The merge process takes all the props, aliases, and associated data (events, leaderboard entries, saves, etc.) from Player 2 and merge them into Player 1. This means that duplicate props in Player 1 will be replaced by the ones from Player 2.

## Steamworks integration

:::tip
You can enable this integration on the [integrations page](https://dashboard.trytalo.com/integrations).
:::

If you have the Steamworks integration enabled, Talo can sync a Steam player using the Steam User Auth API ([as described here](/docs/integrations/steamworks#authentication)). You can do this via the `Talo.Players.IdentifySteam` function. Here's a modified version of an example [provided by Unity](https://docs.unity.com/ugs/en-us/manual/authentication/manual/platform-signin-steam) using Steamworks.NET:

```csharp
Callback<GetTicketForWebApiResponse_t> m_AuthTicketForWebApiResponseCallback;
string m_SessionTicket;
string identity = "talo";

void SignInWithSteam()
{
	// It's not necessary to add event handlers if they are
	// already hooked up.
	// Callback.Create return value must be assigned to a
	// member variable to prevent the GC from cleaning it up.
	// Create the callback to receive events when the session ticket
	// is ready to use in the web API.
	// See GetAuthSessionTicket document for details.
	m_AuthTicketForWebApiResponseCallback = Callback<GetTicketForWebApiResponse_t>.Create(OnAuthCallback);

	SteamUser.GetAuthTicketForWebApi(identity);
}

void OnAuthCallback(GetTicketForWebApiResponse_t callback)
{
	m_SessionTicket = BitConverter.ToString(callback.m_rgubTicket).Replace("-", string.Empty);
	m_AuthTicketForWebApiResponseCallback.Dispose();
	m_AuthTicketForWebApiResponseCallback = null;

	Talo.Players.IdentifySteam(m_SessionTicket, identity);
}
```

The `identity` parameter is optional but strongly recommended as it ensures proper identification of the service verifying the ticket. It can be anything you like but must be the same as the `identity` passed to Steam when fetching the ticket.

### Steamworks player props

After successfully authenticating the player, several [props](/docs/unity/player-props.md) will automatically be created for them:

- `META_STEAMWORKS_VAC_BANNED` - "true" or "false"
- `META_STEAMWORKS_PUBLISHER_BANNED` - "true" or "false"
- `META_STEAMWORKS_OWNS_APP` - "true" or "false"
- `META_STEAMWORKS_OWNS_APP_PERMANENTLY` - "true" or "false"
- `META_STEAMWORKS_OWNS_APP_FROM_DATE` - ISO date e.g. "2025-11-08T17:30:00Z"
- `META_STEAMWORKS_PERSONA_NAME` - the player's current display name
- `META_STEAMWORKS_AVATAR_HASH` - e.g. "5bfdbd8cd4407d6cd37dfba06851b62a4856bb2d"

You can build an avatar URL by replacing **[AVATAR_HASH]** with the `META_STEAMWORKS_AVATAR_HASH` prop value in the following URL: `https://avatars.steamstatic.com/[AVATAR_HASH]_full.jpg`.

These props will be updated each time the player is identified using `Talo.Players.IdentifySteam()`.

## Offline player cache

If the `cachePlayerOnIdentify` setting is enabled (default `true`), Talo will store player data locally. If a player tries to identify while offline, Talo will try and use local data if it exists.

## Searching for players

You can use `Talo.Players.Search()` to query players. This function accepts a single `query` parameter that will search your playerbase for matching player IDs, alias identifiers or prop values. You can use this function to find players by their username, their ID or if they have a prop with a specific value.

```csharp
private async void SearchPlayers()
{
    try
    {
        var searchPage = await Talo.Players.Search("bob");
        if (searchPage.count == 0)
        {
            Debug.Log("No players found");
            return;
        }

        var identifiers = new List<string>();
        foreach (var player in searchPage.players)
        {
            identifiers.Add(player.GetAlias().identifier);
        }

        Debug.Log($"Found {searchPage.count} results: {string.Join(", ", identifiers)}");
    }
    catch (Exception ex)
    {
        Debug.LogError($"Search failed: {ex.Message}");
    }
}
```
