---
sidebar_position: 10
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
  return Talo.current_player.is_in_talo_group('beta-testers')
```
