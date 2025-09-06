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
var groupPage = await Talo.PlayerGroups.Get(groupId);

if (groupPage.count == 0)
{
	Debug.Log("No players in group");
	return;
}

var identifiers = new List<string>();
foreach (var player in groupPage.group.members)
{
	identifiers.Add(player.GetAlias().identifier);
}

Debug.Log($"Found {groupPage.group.count} members: {string.Join(", ", identifiers)}");
```

Group members will only be visible if you've enabled the setting on your group in the Talo dashboard. If `membersVisible` is `false`, `members` will always be an empty array.

Group members must be paginated. You can do this by providing a page number to `Get()` which returns a `PlayerGroupsGetResponse` with information such as `count`, `itemsPerPage` and `isLastPage`.
