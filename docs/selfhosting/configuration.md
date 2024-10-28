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
| CLICKHOUSE_HOST          | Yes      | The host name for your Clickhouse instance. If using containers, this is typically the name of your Clickhouse service |
| CLICKHOUSE_PORT          | No       | The port your Clickhouse instance runs on, usually 8123                                                                |
| CLICKHOUSE_DB            | Yes      | The name of your Clickhouse database                                                                                   |
| CLICKHOUSE_USER          | Yes      | The user which has access to your Clickhouse database                                                                  |
| CLICKHOUSE_PASSWORD      | Yes      | The password for the Clickhouse database user                                                                          |
| REDIS_PASSWORD           | Yes      | The password for your Redis instance                                                                                   |
| AUTO_CONFIRM_EMAIL       | No       | A boolean that defines whether users have their emails automatically confirmed after signing up                        |
| FROM_EMAIL               | No       | The email address used to send emails from the backend                                                                 |
| RECOVERY_CODES_SECRET    | No       | 32-character secret for encrypting your 2FA recovery codes, required to use 2FA                                        |
| STEAM_INTEGRATION_SECRET | No       | 32-character secret for encrypting your Steam API key, required to use the Steamworks integration                      |

## Third party configurations

Talo uses a handful of third party services to handle common tasks.

### Sentry

[Sentry](https://sentry.io) is an error-reporting tool that alerts you when exceptions get thrown. You can enable Sentry by setting the `SENTRY_DSN` environment variable to your unique DSN.

### Sendgrid

Talo uses [Sendgrid](https://sendgrid.com) to send emails. It handles common problems with running your mail server like handling reputation, bounces and more. You can enable emails by setting the `SENDGRID_KEY` environment variable to a valid API key.

:::tip
Make sure your API key has full access to `Mail Send` and `Sender Authentication`. Your domain must also be authenticated within Sendgrid.
:::
