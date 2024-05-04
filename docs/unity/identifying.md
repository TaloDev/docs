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
