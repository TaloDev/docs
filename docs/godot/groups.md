---
sidebar_position: 10
description: Talo Groups are filters on your player-base that create distinct segments between players. Groups are built in the dashboard and visible in your Godot game.
---

# Groups

Talo groups allow you to apply filters on your player-base to create distinct segments between players. For example, you could have a group for players who are beta testers or players who have completed the game.

To create a group, head over to [the dashboard](https://dashboard.trytalo.com), visit the groups page and create your first group. Take note of the `ID` as this is how you'll be referring to your group.

## Checking membership

You can check if a player's group membership using `is_in_talo_group_id()` by providing the group ID. Alternatively you can search by group name using `is_in_talo_group_name()` too.

```gdscript
func is_power_user():
	return Talo.current_player.is_in_talo_group_id('9e56e835-eff6-4a6d-ac35-db8e7561af0e')

func is_beta_tester():
	return Talo.current_player.is_in_talo_group_name('beta-testers')
```

## Fetching individual groups

Groups in the `TaloPlayer` class are stubs that only include an `id` and a `name`. To retrieve more data about a group, including its members, use the `Talo.player_groups.get_group()` function:

```gdscript
var group_page := await Talo.player_groups.get_group(group_id)
if group_page != null:
	print("%s has %s player(s)" % [group_page.group.name, group_page.count])
else:
	push_error("Group %s not found" % [group_id])

if group_page.count == 0:
	print("No players in group")
	return

var identifiers = []
for player in group_page.group.members:
	identifiers.append(player.get_alias().identifier)

print("Found %s members: %s" % [group_page.count, ", ".join(identifiers)])
```

Group members will only be visible if you've enabled the setting on your group in the Talo dashboard. If `members_visible` is `false`, `members` will always be an empty array.

Group members must be paginated. You can do this by providing a page number to `get_group()` which returns a `Talo.player_groups.GroupPage` with information such as `count`, `items_per_page` and `is_last_page`.
