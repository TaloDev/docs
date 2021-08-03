---
sidebar_position: 4
---

# Events

Events let you better understand what players are doing and can be useful for putting together a timeline of events for debugging.

## Tracking

To track an event, simply call `Talo.Events.Track()` with an event name like "Level up". You can optionally attach properties to events by passing any number of extra `(string, string)` tuples to the function call:

```c# title="TrackLevelUpEvent.cs"
private void LevelUp() {
    level++;

    Talo.Events.Track(
      "Level up",
      ("newLevel", $"{level}"),
      ("timeTaken", $"{timeTaken}")
    );

    timeTaken = 0;
}
```
