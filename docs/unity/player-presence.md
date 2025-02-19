---
sidebar_position: 16
description: With Talo's presence API, you can automatically track the presence of players in your game. Presence allows you to easily build social features like friends lists.
---

# Player presence

The player presence API allows you to automatically track the presence of players in your game. You can use this to show if a player is online or offline, set custom statuses and build social features like friends lists.

## Getting a player's presence

To get a player's presence, use the `Talo.PlayerPresence.GetPresence()` function. This function takes a player ID string as its argument:

```csharp
var presence = await Talo.PlayerPresence.GetPresence(playerId);
```

This function returns a `PlayerPresence` object which contains:

```csharp
public class PlayerPresence
{
    public bool online;
    public string customStatus;
    public PlayerAlias playerAlias;
}
```

The `playerAlias` represents the last alias used to update the player's presence. Custom statuses can be used to show a player's current activity or to represent other states beyond simply online or offline.

## Updating a player's presence

To update a player's presence, use the `Talo.PlayerPresence.UpdatePresence()` function. You can provide the new `online` status and an optional `customStatus`:

```csharp
var presence = await Talo.PlayerPresence.UpdatePresence(online, customStatus);
```

This function returns a `PlayerPresence` object.

## Subscribing to presence updates

You can use the `Talo.PlayerPresence.OnPresenceChanged` event to subscribe to player presence updates. This event provides a `PlayerPresence` object and information about what changed. Here's an example of how to use this event to update a friends list:

```csharp
void Start()
{
    Talo.PlayerPresence.OnPresenceChanged += OnPresenceChanged;
}

void OnPresenceChanged(PlayerPresence presence, bool onlineChanged, bool customStatusChanged)
{
    // check if this player is in our friends list
    if (_friendsList.Contains(presence.playerAlias.id))
    {
        if (onlineChanged)
        {
            if (presence.online)
            {
                Debug.Log($"{presence.playerAlias.identifier} is now online");
            }
            else
            {
                Debug.Log($"{presence.playerAlias.identifier} is now offline");
            }
        }
        if (customStatusChanged)
        {
            Debug.Log($"They are currently: {presence.customStatus}");
        }
    }
}
```
