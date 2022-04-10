---
sidebar_position: 4
---

# Events

Events let you better understand what players are doing and can be useful for putting together a timeline of events for debugging.

## Tracking

To track an event, simply call `Talo.Events.Track()` with an event name like "Level up". You can optionally attach properties to events by passing any number of extra `(string, string)` tuples to the function call:

```c# title="TrackLevelUpEvent.cs"
private void LevelUp()
{
    level++;

    Talo.Events.Track(
      "Level up",
      ("newLevel", $"{level}"),
      ("timeTaken", $"{timeTaken}")
    );

    timeTaken = 0;
}
```

## Flushing

Events are sent off in batches to prevent issues around rate limiting or using too much of your player's bandwidth. You can manually call `Talo.Events.Flush()` to send off the events currently waiting in the queue. Flushing also happens automatically when:

1. The game loses focus
2. The game is paused
3. In WebGL builds, after the time in seconds defined in the `webGLEventFlushRate` setting has elapsed. Unity doesn't implement the `OnApplicationQuit` function for WebGL builds and as a result event tracking is slightly more unreliable. You can increase or decrease the `webGLEventFlushRate` but be wary of the reasons why events are batched described above.
