# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy configuration and manifest files individually
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY turbo.json .
COPY tsconfig.json .

# Copy source code directories individually
COPY ./apps ./apps
COPY ./packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the Next.js application
RUN pnpm turbo run build --filter=auth

# ---_--

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy the standalone output from the builder stage
COPY --from=builder /app/apps/auth/.next/standalone ./apps/auth/

# Copy the public assets
COPY --from=builder /app/apps/auth/public ./apps/auth/public

# The standalone output includes a minimal server.js file to run the application
CMD ["node", "apps/auth/server.js"]
