---
sidebar_position: 3
---

# Requests

## Players

### Identifying a player

Most (but not all) requests require the player to be identified before being processed.

```typescript
{
  "req": "v1.players.identify",
  "data": {
    "playerAliasId": number
    "socketToken": string
    "sessionToken": string | undefined
  }
}
```

| Authentication required | Scopes                  |
| ----------------------- | ----------------------- |
| No                      | `read:players`          |

## Channels

### Sending a message

Players must be subscribed to the channel they are trying to send a message to and the channel must exist, otherwise a `LISTENER_ERROR` will be thrown.

```typescript
{
  "req": "v1.channels.message",
  "data": {
    "channel": {
      "id": number
    }
    "message": string
  }
}
```

| Authentication required | Scopes                  		    |
| ----------------------- | ------------------------------- |
| Yes                     | `write:gameChannels`           	|

