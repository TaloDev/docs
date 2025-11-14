---
sidebar_position: 1
description: Talo's Godot plugin gives you access to a highly configurable open source game backend.
---

# Settings reference

When Talo first loads, a default `settings.cfg` is generated that looks like this:

```gdscript title="addons/talo/settings.cfg"
access_key=""
api_url="https://api.trytalo.com"
socket_url="wss://api.trytalo.com"
auto_connect_socket=true
handle_tree_quit=true
cache_player_on_identify=true

[continuity]
enabled=true

[player_auth]
auto_start_session=false
```

## Accessing settings

You can use the `Talo.settings` object to get or set individual options. You will need to call `Talo.settings.save_config()` after modifying a setting to persist the change.

## Settings

### access_key

This is generated on [the Talo dashboard](https://dashboard.trytalo.com). You'll need to fill out your `access_key` before making requests to the Talo API.

The scopes on your access key determine whether certain actions can be performed. For example, if you want to fetch leaderboard entries, you'll need the `read:leaderboards` scope. If you want to create leaderboard entries, you'll need the `write:leaderboards` scope.

At a minimum, the Talo Godot plugin requires the `read:players` and `write:players` scopes.

### api_url

This is the location of the Talo API. The default cloud version is `https://api.trytalo.com`. If you're [self-hosting Talo](/docs/selfhosting/overview.md), this should be the address of your `backend` container.

### socket_url

This is usually the same as your `api_url` but with the `ws` or `wss` protocol.

### auto_connect_socket

If enabled, the plugin will automatically connect to the Talo Socket when the game starts.

### handle_tree_quit

When enabled, Talo will run the following code:

```gdscript
get_tree().set_auto_accept_quit(false)
```

This allows Talo to listen for the `NOTIFICATION_WM_CLOSE_REQUEST` notification, so that events can be flushed before the game exits. Learn more about [Godot notifications here](https://docs.godotengine.org/en/stable/tutorials/best_practices/godot_notifications.html).

```gdscript
func _notification(what: int):
	match what:
		NOTIFICATION_WM_CLOSE_REQUEST:
			_do_flush()
			if Talo.settings.handle_tree_quit:
				get_tree().quit()
		NOTIFICATION_APPLICATION_FOCUS_OUT, NOTIFICATION_APPLICATION_PAUSED:
			_do_flush()
```

If this setting is disabled, `get_tree().quit()` will not be called after Talo flushes events. You will need to handle this notification and quitting the game yourself.

### cache_player_on_identify

If enabled, Talo will automatically cache the player after a successful online identification. If the player is offline and tries to identify in later sessions, Talo will attempt to use the cached the player data.

### continuity.enabled

If enabled, Talo will try to automatically replay failed network requests - [learn more about Continuity here](/docs/godot/continuity.md).

### player_auth.auto_start_session

If enabled and a valid session token is found, the player will be automatically authenticated. This is documented on the [Player Authentication page](/docs/godot/player-authentication.md#automatic-logins).

### logging.requests

If enabled, requests to the Talo API will be logged to the console.

### logging.responses

If enabled, responses from the Talo API will be logged to the console.

### debug.offline_mode

If enabled, Talo will simulate the player not having an internet connection. This is primarily useful for testing.

### debounce_timer_seconds

Controls the time (in seconds) between frequent requests such as updating player props, updating saves and health checks. The default value is 1 second.

It is strongly recommended that you do not set this value below the default. A lower value can lead to slow responses or data being overwritten due to request conflicts. Increasing this value will reduce the frequency of requests and may help prevent data conflicts.
