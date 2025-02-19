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

### Presence updated

This response is sent when a player's presence is updated.

```typescript
{
  "res": "v1.players.presence.updated",
  "data": {
    "presence": PlayerPresence
    "onlineChanged": boolean
    "customStatusChanged": boolean
  }
}
```

| Authentication required  | Scopes                  |
| ------------------------ | ----------------------- |
| Yes                      | `read:players`          |

## Channels

### Receiving a message

If a player is subscribed to a channel where a message has been sent, they will receive this response.

```typescript
{
  "res": "v1.channels.message",
  "data": {
    "channel": GameChannel
    "message": string
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


### Ownership transferred

This response is sent to channel members when the owner is updated.

```typescript
{
  "res": "v1.channels.ownership-transferred",
  "data": {
    "channel": GameChannel
    "newOwner": PlayerAlias
  }
}
```

| Authentication required | Scopes                  		    |
| ----------------------- | ------------------------------- |
| Yes                     | `read:gameChannels`            	|

### Channel deleted

When channels are deleted, all members will be notified.

```typescript
{
  "res": "v1.channels.deleted",
  "data": {
    "channel": GameChannel
  }
}
```

| Authentication required | Scopes                  		    |
| ----------------------- | ------------------------------- |
| Yes                     | `read:gameChannels`            	|

## Live config

### Live config updated

This response is sent to all players when the live config is updated from the Talo dashboard.

```typescript
{
  "res": "v1.live-config.updated",
  "data": {
    "config": Prop[]
  }
}
```

| Authentication required | Scopes                  	    |
| ----------------------- | ----------------------------- |
| Yes                     | `read:gameConfig`            	|

## Types

### Prop

```ts
type Prop = {
  key: string
  value: string
}
```

### Player

```ts
type Player = {
  id: number
  props: Prop[]
  devBuild: boolean
  lastSeenAt: Date
  createdAt: Date
  groups: {
    id: number
    name: string
  }[]
  auth?: {
    email: string
    verificationEnabled: boolean
    sessionCreatedAt: Date
  }
}
```

### PlayerAlias

```ts
type PlayerAlias = {
  id: number
  service: string
  identifier: string
  player: Player
  lastSeenAt: Date
  createdAt: Date
  updatedAt: Date
}
```

### PlayerPresence

```ts
type PlayerPresence = {
  online: boolean
  customStatus: string
  playerAlias: PlayerAlias,
  updatedAt: Date
}
```

### GameChannel

```ts
type GameChannel = {
  id: number
  name: string
  owner: PlayerAlias
  totalMessages: number
  memberCount: number
  props: Prop[]
  createdAt: Date
  updatedAt: Date
}
```
