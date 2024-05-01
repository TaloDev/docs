---
sidebar_position: 4
---

# Events

Events let you better understand what players are doing and can be useful for putting together a timeline of events for debugging.

## Tracking

To track an event, simply call `Talo.events.track()` with an event name like "Level up". You can optionally attach properties to events by passing a dictionary to the function call:

```gdscript title="level_up_button.gd"
extends Button

var level = 1

func _on_pressed() -> void:
  level += 1

  Talo.events.track("Level up", {
    "New level": level
  })
```

## Flushing

Events are sent off in batches to prevent issues around rate limiting or using too much of your player's bandwidth. You can manually call `Talo.Events.Flush()` to send off the events currently waiting in the queue. Flushing also happens automatically when:

1. The game loses focus
2. The game is closed
<!-- 3. In HTML5 builds, after the time in seconds defined in the `webEventFlushRate` setting has elapsed. Unity doesn't implement the `OnApplicationQuit` function for WebGL builds and as a result event tracking is slightly more unreliable. You can increase or decrease the `webEventFlushRate` but be wary of the reasons why events are batched described above. -->

## Meta props

Talo sends through some extra props with each event. These props are made up of the following metadata:
- The player's operating system
- The version of the game
- The window mode (fullscreen, fullscreen windowed, maximized window or windowed)
- The width of the game window
- The height of the game window

These properties are then attached as props to the player, providing you with extra tools for debugging possible bugs and configurations where they appear.
