---
sidebar_position: 6
description: Socket message verification uses cryptographic signatures to prevent replay attacks and tampering on WebSocket messages.
---

# Request verification

Request verification adds an extra layer of security to your game by cryptographically validating that socket messages come from a legitimate client and haven't been tampered with or replayed.

When enabled, Talo requires every socket message sent by identified players to include a signature. The server validates this signature against a verification key that you manage in the dashboard.

## How it works

The signature is prepended to the JSON message payload, separated by a newline character (`\n`):

```
{version}|{base64Header}.{base64Signature}
{"req":"v1.channels.message","data":{"channel":{"id":1},"message":"Hello"}}
```

Talo extracts the signature from the first line and validates the JSON payload on the second line.

## Signature format

The signature format is identical to the `x-talo-signature` header:

```
{version}|{base64Header}.{base64Signature}
```

### Key version

The `version` identifies which verification key was used to create the signature. It must match an active key created in the dashboard for your game.

### Base64 header

The `base64Header` is a Base64-encoded JSON object containing three fields:

- `rid`: A unique identifier for the message. This must be different for every message you send.
- `payload`: The SHA-256 hex digest of the raw JSON message string (the second line of the payload).
- `timestamp`: The current Unix timestamp in milliseconds when the message is created. Stale timestamps will be rejected.

### Base64 signature

The `base64Signature` is computed in three steps:

1. Take the JSON header object (`{ rid, payload, timestamp }`) and encode it as a Base64 string.
2. Compute an HMAC-SHA256 of that Base64 string using your verification key's `value` as the secret.
3. Base64-encode the HMAC output.

This final Base64-encoded HMAC is the signature portion of the full value.

## Generating a signature

This TypeScript utility function shows how to generate a valid signature:

```typescript
import crypto from 'node:crypto'

function buildSignature(body: string, key: string, version: string) {
	// Unique request identifier
	const rid = crypto.randomUUID()

	// Current timestamp in milliseconds
	const timestamp = Date.now()

	// SHA-256 hex digest of the raw JSON message
	const payload = crypto.createHash('sha256').update(body).digest('hex')

	const header = { rid, payload, timestamp }
	const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64')

	// HMAC-SHA256 of the base64 header using the verification key value
	const hmac = crypto.createHmac('sha256', key).update(headerB64).digest()
	const signatureB64 = Buffer.from(hmac).toString('base64')

	return `${version}|${headerB64}.${signatureB64}`
}
```

You can then prepend the signature to the JSON message separated by a newline character (`\n`):

```typescript
const message = JSON.stringify({
	req: 'v1.channels.message',
	data: { channel: { id: 1 }, message: 'Hello' },
})
const signature = buildSignature(message, key, version)

socket.send(`${signature}\n${message}`)
```

## When verification applies

Socket message verification is only enforced when:

- `verifyRequests` is enabled for the game.
- The player has been identified, i.e. the `v1.players.identified.success` message has been received.

## Invalid signature error

If a signature is missing or invalid, the server responds with the following error:

```javascript
{
	"res": "v1.error",
	"data": {
		"req": "v1.channels.message",
		"message": "Invalid signature",
		"errorCode": "INVALID_SIGNATURE"
	}
}
```
