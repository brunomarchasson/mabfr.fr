# Resume Application (Next.js)

This is the Next.js application for your personal resume.

It integrates with Ory Hydra for authentication and demonstrates SSO capabilities within the monorepo.

## Development

This application will share authentication with the `hub` application.

### Environment Variables

This application requires the following environment variables in its `.env.local` file:
- `HYDRA_CLIENT_ID`
- `HYDRA_CLIENT_SECRET`
- `HYDRA_ISSUER` (e.g., `http://127.0.0.1:4444`)
- `AUTH_SECRET` (a random string for session encryption)

### Running

From the monorepo root, run:
```bash
turbo dev
```

This application will be accessible at `http://localhost:3002`.
