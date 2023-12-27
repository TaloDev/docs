---
sidebar_position: 1
title: Overview
---

# Self-hosting

Talo is open-source and we publish our backend and frontend Docker images publicly so you can host Talo on your own servers and make any of the modifications you want to.

Feel free to submit a pull request to our [backend repository](https://github.com/TaloDev/backend) or [frontend repository](https://github.com/TaloDev/frontend) if you feel like sharing any of your improvements!

## Quickstart

The easiest way to get started is using Docker and our [self-hosting repository](https://github.com/TaloDev/hosting).

### Examples

The repository comes with two Docker Compose examples:

1. `basic` - this example exposes the backend and frontend as simple HTTP servers for quickly getting up and running (accessible via http://localhost or http://[your server's IP address]).

2. `ssl` - this example enables HTTPS and allows you to automatically configure domain names for your backend and frontend (e.g. https://dashboard.trytalo.com and https://api.trytalo.com) using reverse proxies. We've used [docker-nginx-certbot](https://github.com/JonasAlfredsson/docker-nginx-certbot) for automating and enabling SSL so make sure to have a look at the image's documentation. You will need to add an A record pointing to your server for each domain configured.
