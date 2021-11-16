---
sidebar_position: 2
---

# Identifying a player

## Aliases

Players within your Talo account can have multiple aliases.
For example, a player could have a Steam login and an Epic login but both would be tied to the same player and they could use both to login.

You should identify a player after they have authenticated and before you attempt to track any events.

## Identifying

You can identify a player using `Talo.Players.Identify()`. The code sample below shows you how you could identify a player using a UI element (this example is also available in the Playground):

```c# title="IdentifyPlayer.cs"
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

## Checking identification

Sometimes you might need to check if a player has been identified before. You can use `Talo.IdentityCheck()` to verify this - it throws an error if a player hasn't been identified yet:

```c#
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
You can merge players using `Talo.Players.Merge()`.

Merge will take all the props, aliases and events from the right-hand player and merge them into the left-hand player. This means that duplicate props in the left-hand side will be replaced by the right-hand side's ones.
