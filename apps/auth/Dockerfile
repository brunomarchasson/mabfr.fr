# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency-related files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/auth/package.json ./apps/auth/
COPY packages/auth-client/package.json ./packages/auth-client/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the Next.js application
# This will now create a .next/standalone folder thanks to our config change
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