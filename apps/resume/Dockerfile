# Dockerfile for the 'resume' Next.js application

# ---- Base Stage ----
# We use the official Node.js 20 image, which is lightweight and secure.
FROM node:20-alpine AS base
WORKDIR /app
# Install pnpm globally in the image
RUN npm install -g pnpm

# ---- Dependencies Stage ----
# This stage is dedicated to installing dependencies. It's cached by Docker.
# It will only be re-run if your package.json or lockfiles change, speeding up future builds.
FROM base AS deps
# Copy all files related to dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/resume/package.json ./apps/resume/
COPY packages/auth-client/package.json ./packages/auth-client/
COPY packages/ui/package.json ./packages/ui/

# Install ALL dependencies for the entire monorepo.
# pnpm is smart enough to structure them correctly.
RUN pnpm install --frozen-lockfile

# ---- Builder Stage ----
# In this stage, we build the actual application code.
FROM base AS builder
WORKDIR /app
# Copy all the source code of the monorepo
COPY . .
# Copy the installed dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules

# Use Turborepo to build ONLY the 'resume' application and its internal dependencies.
RUN pnpm turbo run build --filter=resume

# ---- Runner Stage ----
# This is the final, lightweight image that will be deployed.
FROM base AS runner
WORKDIR /app

# Set the environment to production
ENV NODE_ENV production
ENV PORT 3000

# Copy only the necessary files from the 'builder' stage to run the 'resume' app.
# This includes the compiled Next.js app, static assets, and package.json.
COPY --from=builder /app/apps/resume/.next ./apps/resume/.next
COPY --from=builder /app/apps/resume/public ./apps/resume/public
COPY --from=builder /app/apps/resume/next.config.mjs ./apps/resume/
COPY --from=builder /app/apps/resume/package.json ./apps/resume/

# Copy the production node_modules from the 'deps' stage.
# This is much smaller than the development node_modules.
COPY --from=deps /app/node_modules ./node_modules

# The command to start the Next.js server.
# We use pnpm to run the "start" script defined in the resume app's package.json.
CMD ["pnpm", "--filter=resume", "start"]
