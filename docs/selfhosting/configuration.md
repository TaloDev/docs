---
sidebar_position: 2
description: Talo is a self-hostable game backend. Your players, data and analytics belong to you and Talo can be easily customised to suit your needs.
---

# Configuration

Below is a list of configuration options that can be found in your .env file:

:::tip
You'll need to restart the backend container after modifying your .env file
:::

| Environment variable     | Required | Description                                                                                                            |
|--------------------------|----------|------------------------------------------------------------------------------------------------------------------------|
| JWT_SECRET               | Yes      | Your unique secret that signs all authenticated requests. Treat this as securely as you would a database password      |
| API_SECRET               | Yes      | 32-character secret for encrypting API keys                                                                            |
| DASHBOARD_URL            | Yes      | The URL of your frontend. Used for setting CORS headers and in emails                                                  |
| DB_HOST                  | Yes      | The host name for your database. If using containers, this is typically the name of your database service              |
| DB_PORT                  | Yes      | The port your database runs on, usually 3306                                                                           |
| DB_NAME                  | Yes      | The name of your database                                                                                              |
| DB_USER                  | Yes      | The user which has access to your database                                                                             |
| DB_PASS                  | Yes      | The password for the database user                                                                                     |
| EMAIL_DRIVER             | No       | This can be set to 'log' (default, prints to the console) or 'relay' (send via an external SMTP server)                |
| EMAIL_HOST               | No       | The host for the 'relay' server, e.g. smtp.mailserver.com                                                              |
| EMAIL_PORT               | No       | The port for the 'relay' server, typically 587 or 465                                                                         |
| EMAIL_USERNAME           | No       | The username for the 'relay' server, e.g. example@mailserver.com                                                       |
| EMAIL_PASSWORD           | No       | The password for the 'relay' server                                                                                    |
| EMAIL_DEBUG              | No       | Set this environment variable to print debug info about emails to the console                                          |
| FROM_EMAIL               | No       | The email address used to send emails from the backend                                                                 |
| AUTO_CONFIRM_EMAIL       | No       | A boolean that defines whether users have their emails automatically confirmed after signing up                        |
| CLICKHOUSE_HOST          | Yes      | The host name for your ClickHouse instance. If using containers, this is typically the name of your ClickHouse service |
| CLICKHOUSE_PORT          | No       | The port your ClickHouse instance runs on, usually 8123                                                                |
| CLICKHOUSE_DB            | Yes      | The name of your ClickHouse database                                                                                   |
| CLICKHOUSE_USER          | Yes      | The user which has access to your ClickHouse database                                                                  |
| CLICKHOUSE_PASSWORD      | Yes      | The password for the ClickHouse database user                                                                          |
| REDIS_PASSWORD           | Yes      | The password for your Redis instance                                                                                   |
| RECOVERY_CODES_SECRET    | No       | 32-character secret for encrypting your 2FA recovery codes, required to use 2FA                                        |
| STEAM_INTEGRATION_SECRET | No       | 32-character secret for encrypting your Steam API key, required to use the Steamworks integration                      |
| REGISTRATION_MODE        | No       | Controls how registrations work: 'open' (default, open to anyone), 'exclusive' (invite-only) or 'disabled'             |

## Third party configurations

Talo uses a handful of third party services to handle common tasks.

### Emails

Talo can relay emails via an external SMTP server (like Gmail or Zoho) using the "relay" `EMAIL_DRIVER`. Under the hood, Talo uses [Nodemailer](https://nodemailer.com) to handle the relay and you can refer to their docs for example configurations.

### Sentry

[Sentry](https://sentry.io) is an error monitoring tool with a generous free tier. You can enable Sentry by setting the `SENTRY_DSN` environment variable to your unique DSN.
