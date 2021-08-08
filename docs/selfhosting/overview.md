---
sidebar_position: 1
title: Overview
---

# Self-hosting

Talo is open-source and we publish our backend Docker image publicly so you can host Talo on your own servers and make any of the modifications you want to.

Feel free to submit a pull request to the [backend repository](https://github.com/TaloDev/backend) if you feel like sharing any of your improvements!

## Quickstart

The easiest way to get started is using Docker and our [self-hosting repository](https://github.com/TaloDev/hosting).

### Examples

The repository comes with two simple examples:

1. `reverse-proxy` - this example exposes a simple HTTP server that lets you easily make requests to the backend via a reverse proxy (e.g. http://10.12.100.52:9000).

2. `ssl` - this example enables HTTPS and allows you to automatically configure a domain name (e.g. https://api.trytalo.com) that requests can be routed through. We've used [docker-nginx-certbot](https://github.com/JonasAlfredsson/docker-nginx-certbot) for automating and enabling SSL so make sure to have a look at the image's documentation.
