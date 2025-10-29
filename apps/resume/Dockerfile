# Use a Node.js 20 LTS image as the base for building
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy pnpm-workspace.yaml and package.json files
# This allows pnpm to understand the monorepo structure
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/resume/package.json ./apps/resume/

# Install dependencies for the entire monorepo
# This will create node_modules in the root and symlink where necessary
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application for the 'resume' app
# Ensure that the build command is correct for your monorepo setup
# For turborepo, it might be `pnpm build --filter=resume` or similar
RUN pnpm --filter=resume build

# --- Production Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment variables for Next.js production
ENV NODE_ENV=production

# Copy necessary files from the builder stage
# This includes the .next folder, public folder, and package.json
COPY --from=builder /app/apps/resume/.next ./apps/resume/.next
COPY --from=builder /app/apps/resume/public ./apps/resume/public
COPY --from=builder /app/apps/resume/package.json ./apps/resume/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/package.json ./

# If you have a custom server.js or similar, copy it here
# COPY --from=builder /app/apps/resume/server.js ./apps/resume/server.js

# Expose the port Next.js runs on
EXPOSE 3000

# Command to run the application
# For Next.js, this typically starts the built server
CMD ["pnpm", "--filter=resume", "start"]
