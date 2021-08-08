---
sidebar_position: 2
---

# Configuration

Below is a list of configuration options that can be found in your .env file:

:::tip
You'll need to restart the backend container after modifying your .env file
:::

| Environment variable | Required | Description                                                                                                       |
|----------------------|----------|-------------------------------------------------------------------------------------------------------------------|
| JWT_SECRET           | Yes      | Your unique secret that signs all authenticated requests. Treat this as securely as you would a database password |
| ALLOWED_ORIGIN       | No       | Used for settings CORS headers                                                                                    |
| DB_HOST              | Yes      | The host name for your database. If using containers, this is typically the name of your database service         |
| DB_PORT              | Yes      | The port your database runs on, usually 3306                                                                      |
| DB_NAME              | Yes      | The name of your database table                                                                                   |
| DB_USER              | Yes      | The user which has access to your table                                                                           |
| DB_PASS              | Yes      | The password for the database user                                                                                |
| REDIS_PASSWORD       | Yes      | The password for your Redis instance                                                                              |
| AUTO_CONFIRM_EMAIL   | No       | A boolean that defines whether users have their emails automatically confirmed after signing up                   |
| FROM_EMAIL           | No       | The email address used to send emails from the backend                                                            |


## Third party configurations

Talo uses a handful of third party services to handle common tasks.

### Sentry

[Sentry](https://sentry.io) is an error-reporting tool that alerts you when exceptions get thrown. You can enable Sentry by setting the `SENTRY_DSN` environment variable to your unique DSN.

### Sendgrid

Talo uses [Sendgrid](https://sendgrid.com) to send emails. It handles common problems with running your mail server like handling reputation, bounces and more. You can enable emails by setting the `SENDGRID_KEY` environment variable to a valid API key.

:::tip
Make sure your API key has full access to `Mail Send` and `Sender Authentication`. Your domain must also be authenticated within Sendgrid.
:::
