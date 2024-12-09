---
sidebar_position: 1
description: Talo is a self-hostable backend for your game. Talo makes it easy to stay in control of your data and infrastructure.
---

# Self-hosting quickstart

Talo is open-source and we publish our backend and frontend Docker images publicly so you can host Talo on your own servers and make any of the modifications you want to.

Feel free to submit a pull request to our [backend repository](https://github.com/TaloDev/backend) or [frontend repository](https://github.com/TaloDev/frontend) if you feel like sharing any of your improvements!

## Clone the repo

The easiest way to get started is using Docker and our [self-hosting repository](https://github.com/TaloDev/hosting).

### Examples

The repository comes with two Docker Compose examples:

1. `basic` - this example exposes the backend and frontend as simple HTTP servers for quickly getting up and running (accessible via http://localhost or http://[your server's IP address]).

2. `nginx` - this example uses nginx as a web server, enables HTTPS and automatically configures domain names for your backend and frontend (e.g. https://dashboard.example.com and https://api.example.com) using reverse proxies. We've used [docker-nginx-certbot](https://github.com/JonasAlfredsson/docker-nginx-certbot) for automating and enabling SSL so make sure to have a look at the image's documentation. You should add an A record pointing to your server for each domain configured before starting the containers.

2. `caddy` (recommended) - this example uses [caddy](https://caddyserver.com) as a web server, enables HTTPS and automatically configures domain names for your backend and frontend (e.g. https://dashboard.example.com and https://api.example.com) using reverse proxies. You should add an A record pointing to your server for each domain configured before starting the containers.

:::tip
Check out this blog post on [the caddy template](https://trytalo.com/blog/caddy-selfhosting?utm_source=docs&utm_medium=tip) for more details
:::
