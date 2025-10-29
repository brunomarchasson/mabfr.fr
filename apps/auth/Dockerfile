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
RUN pnpm install

# Define build arguments for OIDC configuration
ARG NEXT_PUBLIC_OIDC_AUTHORITY
ARG NEXT_PUBLIC_OIDC_CLIENT_ID
ARG NEXT_PUBLIC_OIDC_REDIRECT_URI
ARG NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI
ARG NEXT_PUBLIC_OIDC_SILENT_REDIRECT_URI

# Set environment variables from build arguments
ENV NEXT_PUBLIC_OIDC_AUTHORITY=$NEXT_PUBLIC_OIDC_AUTHORITY
ENV NEXT_PUBLIC_OIDC_CLIENT_ID=$NEXT_PUBLIC_OIDC_CLIENT_ID
ENV NEXT_PUBLIC_OIDC_REDIRECT_URI=$NEXT_PUBLIC_OIDC_REDIRECT_URI
ENV NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI=$NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI
ENV NEXT_PUBLIC_OIDC_SILENT_REDIRECT_URI=$NEXT_PUBLIC_OIDC_SILENT_REDIRECT_URI

# Build the target application
RUN pnpm turbo run build --filter=@mabru/auth

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
COPY --from=builder /app/apps/auth ./apps/auth
COPY --from=builder /app/packages ./packages

# Install ONLY production dependencies. This creates a smaller node_modules folder.
RUN pnpm install --prod

# The command to start the Next.js server
CMD ["pnpm", "--filter=@mabru/auth", "start"]