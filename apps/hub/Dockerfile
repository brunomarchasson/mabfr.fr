# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# Copy configuration and manifest files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./

# Copy source code
COPY ./apps ./apps
COPY ./packages ./packages

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build the target application
RUN pnpm turbo run build --filter=@mabru/hub

# ---_--

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm

ENV NODE_ENV=production
ENV PORT=3000

# Copy only the necessary files for production from the builder stage
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/pnpm-workspace.yaml .

# Copy the built application and its direct workspace dependencies
COPY --from=builder /app/apps/hub/.next ./apps/hub/.next
COPY --from=builder /app/apps/hub/public ./apps/hub/public
COPY --from=builder /app/apps/hub/package.json ./apps/hub/package.json
COPY --from=builder /app/packages ./packages

# Install ONLY production dependencies. This creates a smaller node_modules folder.
RUN pnpm install --prod --frozen-lockfile

# The command to start the Next.js server
CMD ["pnpm", "--filter=@mabru/hub", "start"]