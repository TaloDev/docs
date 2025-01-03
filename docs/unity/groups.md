---
sidebar_position: 9
description: Talo Groups are filters on your player-base that create distinct segments between players. Groups are built in the dashboard and visible in your Unity game.
---

# Groups

Talo groups allow you to apply filters on your player-base to create distinct segments between players. For example, you could have a group for players who are beta testers or players who have completed the game.

To create a group, head over to [the dashboard](https://dashboard.trytalo.com), visit the groups page and create your first group. Take note of the `ID` as this is how you'll be referring to your group.

## Checking membership

You can check if a player's group membership using `IsInGroupID()` by providing the group ID. Alternatively you can search by group name using `IsInGroupName()` too.

```csharp
public bool IsPowerUser()
{
	return Talo.CurrentPlayer.IsInGroupID('9e56e835-eff6-4a6d-ac35-db8e7561af0e')
}

public bool IsBetaTester()
{
	return Talo.CurrentPlayer.IsInGroupName('beta-testers')
}
```

## Fetching individual groups

Groups in the `Player` class are stubs that only include an `id` and a `name`. To retrieve more data about a group, including its members, use the `Talo.PlayerGroups.Get()` function:

```csharp
try
{
	var group = await Talo.PlayerGroups.Get(groupId);
	ResponseMessage.SetText($"{group.name} has {group.count} player(s)");
}
catch (Exception e)
{
	ResponseMessage.SetText(e.Message);
}
```

Group members will only be visible if you've enabled the setting on your group in the Talo dashboard. If `membersVisible` is `false`, `members` will always be an empty array.
