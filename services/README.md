# Services (Backend Infrastructure)

This directory contains the Docker Compose setup for the backend infrastructure, including:

-   **PostgreSQL:** Database for Kratos and Hydra.
-   **Kratos:** Identity and Access Management (IAM) service.
-   **Hydra:** OAuth2 and OpenID Connect (OIDC) provider.

## Setup

1.  **Google Credentials:** Update `services/ory/configs/kratos.yml` with your Google Client ID and Secret.
2.  **Run Services:** From this directory, run `docker-compose up --build`.

## Access

-   Kratos Public API: `http://localhost:4433`
-   Hydra Public API: `http://localhost:4444`
