---
sidebar_position: 4
---

# Responses

## Players

### Identification successful

If the player is successfully identified, this response will be sent.

```typescript
{
  "res": "v1.players.identify.success",
  "data": PlayerAlias
}
```

| Authentication required  | Scopes                  |
| ------------------------ | ----------------------- |
| Yes                      | None                    |

## Channels

### Receiving a message

If a player is subscribed to a channel where a message has been sent, they will receive this response.

```typescript
{
  "res": "v1.channels.message",
  "data": {
    "channel": GameChannel
    "message": string,
    "playerAlias": PlayerAlias
  }
}
```

| Authentication required | Scopes                  		    |
| ----------------------- | ------------------------------- |
| Yes                     | `read:gameChannels`            	|

### Joining a channel

When a player joins a channel, all channel members will be notified.

```typescript
{
  "res": "v1.channels.player-joined",
  "data": {
    "channel": GameChannel
    "playerAlias": PlayerAlias
  }
}
```

| Authentication required | Scopes                  		    |
| ----------------------- | ------------------------------- |
| Yes                     | `read:gameChannels`            	|

### Leaving a channel

When a player leaves a channel, all channel members will be notified.

```typescript
{
  "res": "v1.channels.player-left",
  "data": {
    "channel": GameChannel
    "playerAlias": PlayerAlias
  }
}
```

| Authentication required | Scopes                  		    |
| ----------------------- | ------------------------------- |
| Yes                     | `read:gameChannels`            	|
