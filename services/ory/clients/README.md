# Ory Hydra Client

This document contains the command to create or update the Ory Hydra client for the applications in this monorepo.

## Prerequisites

- [Ory CLI](https://www.ory.sh/docs/ory/cli/install-ory-cli) installed.
- Docker containers for the services are running (`docker-compose up -d`).

## Update Client

Run the following commands from the `services` directory to delete the old client and create the new, centralized one.

### 1. Delete Existing Client

```sh
docker-compose exec hydra hydra delete client hub-app --endpoint http://localhost:4445
```

### 2. Create New Client

This command centralizes all authentication redirects to the `/auth` application.

```sh
docker-compose exec hydra hydra create client `
   --endpoint http://localhost:4445 `
   --name "Mabru Apps" `
   --id "hub-app" `
   --secret "hub-secret" `
   --grant-type "authorization_code" `
   --grant-type "refresh_token" `
   --response-type "code" `
   --response-type "id_token" `
   --scope "openid profile email offline_access" `
   --redirect-uri "http://localhost/auth/callback" `
   --redirect-uri "http://localhost/auth/silent-renew" `
   --post-logout-callback "http://localhost/auth/logout" `
   --token-endpoint-auth-method "client_secret_post"
```