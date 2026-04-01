---
sidebar_position: 2
description: Talo is a self-hostable game backend. Your players, data and analytics belong to you and Talo can be easily customised to suit your needs.
---

# Configuration

Below is a list of configuration options that can be found in your .env file:

:::tip
You'll need to restart the backend container after modifying your .env file
:::

| Environment variable        | Required | Description                                                                                                                   |
| :-------------------------- | :------- | :---------------------------------------------------------------------------------------------------------------------------- |
| JWT_SECRET                  | ✅ Yes   | Your unique secret that signs all authenticated requests. Treat this as securely as you would a database password             |
| API_SECRET                  | ✅ Yes   | 32-character secret for encrypting API keys                                                                                   |
| DASHBOARD_URL               | ✅ Yes   | The URL of your frontend. Used for setting CORS headers and in emails                                                         |
| DB_HOST                     | ✅ Yes   | The host name for your database. If using containers, this is typically the name of your database service                     |
| DB_PORT                     | ✅ Yes   | The port your database runs on, usually 3306                                                                                  |
| DB_NAME                     | ✅ Yes   | The name of your database                                                                                                     |
| DB_USER                     | ✅ Yes   | The user which has access to your database                                                                                    |
| DB_PASS                     | ✅ Yes   | The password for the database user                                                                                            |
| STORAGE_DRIVER              | No       | The driver used for file storage. Set to S3 for S3-compatible storage (AWS, Cloudflare R2, DigitalOcean Spaces)               |
| S3_REGION                   | No       | The region for your S3 bucket (e.g., `us-east-1` or `auto`)                                                                   |
| S3_ENDPOINT                 | No       | The full endpoint URL for your storage provider (e.g., `https://s3.amazonaws.com`)                                            |
| S3_ACCESS_KEY_ID            | No       | The access key ID for your S3 provider                                                                                        |
| S3_SECRET_ACCESS_KEY        | No       | The secret access key for your S3 provider                                                                                    |
| S3_BUCKET                   | No       | The name of the bucket where exports and files will be stored                                                                 |
| EMAIL_DRIVER                | No       | This can be set to 'log' (default, prints to the console) or 'relay' (send via an external SMTP server)                       |
| EMAIL_HOST                  | No       | The host for the 'relay' server, e.g. smtp.mailserver.com                                                                     |
| EMAIL_PORT                  | No       | The port for the 'relay' server, usually 587 or 465                                                                           |
| EMAIL_USERNAME              | No       | The username for the 'relay' server, e.g. example@mailserver.com                                                              |
| EMAIL_PASSWORD              | No       | The password for the 'relay' server                                                                                           |
| EMAIL_DEBUG                 | No       | Set this environment variable to print debug info about emails to the console                                                 |
| FROM_EMAIL                  | No       | The email address used to send emails from the backend                                                                        |
| AUTO_CONFIRM_EMAIL          | No       | A boolean that defines whether users have their emails automatically confirmed after signing up                               |
| CLICKHOUSE_HOST             | ✅ Yes   | The host name for your ClickHouse instance. If using containers, this is typically the name of your ClickHouse service        |
| CLICKHOUSE_PORT             | No       | The port your ClickHouse instance runs on, usually 8123                                                                       |
| CLICKHOUSE_DB               | ✅ Yes   | The name of your ClickHouse database                                                                                          |
| CLICKHOUSE_USER             | ✅ Yes   | The user which has access to your ClickHouse database                                                                         |
| CLICKHOUSE_PASSWORD         | ✅ Yes   | The password for the ClickHouse database user                                                                                 |
| REDIS_PASSWORD              | ✅ Yes   | The password for your Redis instance                                                                                          |
| RECOVERY_CODES_SECRET       | No       | 32-character secret for encrypting your 2FA recovery codes, required to use 2FA                                               |
| STEAM_INTEGRATION_SECRET    | No       | 32-character secret for encrypting your Steam API key, required to use the Steamworks integration                             |
| REGISTRATION_MODE           | No       | Controls how registrations work: 'open' (default, open to anyone), 'exclusive' (invite-only) or 'disabled'                    |
| HYPERDX_API_KEY             | No       | Your HyperDX API key - used to enable the integration                                                                         |
| HDX_NODE_BETA_MODE          | No       | Set to '1' to enable HyperDX trace attributes                                                                                 |
| OTEL_EXPORTER_OTLP_ENDPOINT | No       | The open telemetry collector endpoint where traces will be sent e.g. [https://in-otel.hyperdx.io](https://in-otel.hyperdx.io) |
| NO_PROXY                    | No       | Set to '1' to _not_ use the `X-Forwarded-For` header for player auth activity IP addresses                                    |
| API_RATE_LIMIT              | No       | Set the default requests per second (default 100)                                                                             |
| API_RATE_LIMIT_AUTH         | No       | Set the requests per second for player auth, identification and socket auth endpoints (default 20)                            |

## Third party configurations

Talo uses a handful of third party services to handle common tasks.

### Emails

Talo can relay emails via an external SMTP server (like Gmail or Zoho) using the "relay" `EMAIL_DRIVER`. Under the hood, Talo uses [Nodemailer](https://nodemailer.com) to handle the relay and you can refer to their docs for example configurations.

When the `EMAIL_DRIVER` is set to `log`, the email file and attachments are saved to the `storage/mail` directory.

### Sentry

[Sentry](https://sentry.io) is an error monitoring tool with a generous free tier. You can enable Sentry by setting the `SENTRY_DSN` environment variable to your unique DSN.

### HyperDX

[HyperDX](https://hyperdx.io) is an observability platform with cloud-hosted and self-hosted options. It uses opentelemetry to provide oversight over traces and logs.

All you have to do is provide Talo with the `HYPERDX_API_KEY` and `OTEL_EXPORTER_OTLP_ENDPOINT` environment variables.

We also recommend a few other environment variables:

```
HYPERDX_API_KEY=[your key]
OTEL_EXPORTER_OTLP_ENDPOINT=[your opentelemetry collector endpoint]
HDX_NODE_BETA_MODE=1 # enables trace attributes
OTEL_NODE_DISABLED_INSTRUMENTATIONS=koa # this instrumentation isn't very helpful
```

### Object storage

Talo supports object storage for data exports. You can provide the following environment variables to support AWS S3:

```
STORAGE_DRIVER=S3
S3_REGION=us-east-1
S3_ENDPOINT=https://s3.amazonaws.com
S3_ACCESS_KEY_ID=AK...
S3_SECRET_ACCESS_KEY=ABC...
S3_BUCKET=talo-exports
```

Under the hood, Talo uses [`s3mini`](https://github.com/good-lly/s3mini) which also works with other object storage providers like Cloudflare R2 and Digitalocean Spaces. This is how Talo maps environment variables:

```typescript
// if S3_ENDPOINT isn't set, use the default S3 URL
const endpoint = process.env.S3_ENDPOINT ?? 'https://s3.amazonaws.com'
const bucket = process.env.S3_BUCKET
const endpointWithBucket = endpoint + bucket

return new S3mini({
  accessKeyId: process.env.S3_ACCESS_KEY_ID!,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  endpoint: endpointWithBucket,
  region: process.env.S3_REGION,
})
```
