---
sidebar_position: 2
---

# Common errors

## Missing authentication

`401 Unauthorized`

The `Authorization` header is required, with its value set to `Bearer your-token`.

## Missing scopes

`403 Forbidden - { message: 'Missing access key scope(s): [scopes]' }`

This means your access key was not correctly set up for accessing a specific resource. Access key scopes cannot be updated so you should create a new key with the correct scopes and revoke the old key.

Generally, `GET` requests require `read` access, `POST/PUT/PATCH/DELETE` requests require `write` access.

## Missing parameters

`400 Bad Request`

When omitting a required parameter (e.g. a query key, body key or header), you'll usually receive a 400. Refer to the documentation for the API to make sure your request is correct.

The error object returned may be a single message (e.g. `{ message: Something went wrong }`) or an error object, which includes a key for every invalid/missing key:

```
errors: {
  events: ['events is missing from the request body']
}
```

## Rate-limiting

`429 Too Many Requests`

Receiving this status means you've hit Talo's rate limit. You should aim to make less than 50 requests per second e.g. by batching events and player stat updates.

## Missing or invalid session

`401 Authorized - { message: 'The x-talo-session header is required for this player', errorCode: 'MISSING_SESSION' }`

`401 Authorized - { message: 'The x-talo-session header is invalid', errorCode: 'INVALID_SESSION' }`

When calling API endpoints on behalf of a player (i.e. using the `x-talo-player` or `x-talo-alias` header) that is using [player authentication](https://trytalo.com/players#authentication) you must also send a valid `x-talo-session` header.

You'll need to include both the `x-talo-player` and the `x-talo-alias` headers as well as the `x-talo-session` header which should be set to the token you receive from registering or logging-in a player.
