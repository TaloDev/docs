---
sidebar_position: 2
---

# Identifying a player

## Aliases

Players within your Talo account can have multiple aliases.
For example, a player could have a Steam login and an Epic login but both would be tied to the same player and they could use both to login.

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
    } catch (Exeception err)
    {
      Debug.LogError(err.Message);
    }
  }
}
```

### OnIdentified event

After a successful identification, the `Talo.Players.OnIdentified()` event will fire, returning the identified player. This allows you to, for example, immediately fetch that player's saves:

```csharp
Talo.Players.OnIdentified += async (player) =>
{
  await Talo.Saves.GetSaves();
};
```

## Checking identification

Sometimes you might need to check if a player has been identified before. You can use `Talo.IdentityCheck()` to verify this - it throws an error if a player hasn't been identified yet:

```csharp
public void DoStuffIfIdentified()
{
  try
  {
    Talo.IdentityCheck();
  } catch (Exception err)
  {
    return;
  }

  // do stuff
}
```

## Merging players

As described above, sometimes a player may have one or more aliases and there are times where you know for certain some aliases belong to the same players.
You can merge players using `Talo.Players.Merge()` by proiding the IDs of both players.

Merge will take all the props, aliases and associated data (events, leaderboard entries, saves, etc.) from Player 2 and merge them into Player 1. This means that duplicate props in Player 1 will be replaced by the ones from Player 2.

## Steamworks integration

If you have the Steamworks integration enabled, Talo can sync a Steam player using the Steam User Auth API ([as described here](/docs/integrations/steamworks#Authentication)). You can do this via the `Talo.Players.IdentifySteam` function. Here's a modified version of an example [provided by Unity](https://docs.unity.com/ugs/en-us/manual/authentication/manual/platform-signin-steam) using Steamworks.NET:

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

The `identity` parameter is optional but strongly recommended. It's used to identify the service that is verifying the ticket. It can be anything you like but must be the same as the `identity` passed to Steam when fetching the ticket.
