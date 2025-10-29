# Use a Node.js 24 Debian-based image as the base for building
FROM node:24-bookworm AS builder

# Install necessary dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    --no-install-recommends

# Set working directory to the monorepo root inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm typescript

# Copy monorepo root files needed for pnpm install
COPY pnpm-workspace.yaml ./
COPY package.json ./

# Copy the specific app\'s package.json (for pnpm to understand its dependencies)
COPY apps/resume/package.json ./apps/resume/

# Install project dependencies for the entire monorepo
RUN pnpm install

# Install Chrome for Puppeteer
RUN cd apps/resume && pnpm exec puppeteer browsers install chrome

# Copy the rest of the monorepo source code (excluding node_modules due to .dockerignore)
COPY . .

# Debug: List contents of apps/resume before tsc
RUN ls -la apps/resume

# Transpile next.config.ts to next.config.js for the resume app
RUN cd apps/resume && pnpm exec tsc --project tsconfig.json --outDir .

# Remove next.config.ts after transpilation
RUN rm apps/resume/next.config.ts

# Debug: List contents of apps/resume after rm
RUN ls -la apps/resume

RUN pnpm turbo run build --filter=@mabru/resume

# Create a temporary directory for deployment
RUN mkdir -p /app/deploy-resume

# Prune the workspace for the resume app into the temporary directory
RUN pnpm deploy --prod --filter=resume --legacy /app/deploy-resume

# Copy the .next build output to the deploy directory (after pnpm deploy)
RUN cp -r apps/resume/.next /app/deploy-resume/.next

# Debug: List contents of the deployed application
RUN ls -la /app/deploy-resume
RUN ls -la /app/deploy-resume/.next # Added for debugging

# --- Production Stage ---
FROM node:24-bookworm AS runner

# Install necessary dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    --no-install-recommends

# Install pnpm globally in the runner stage
RUN npm install -g pnpm

# Set working directory to where the deployed app will reside
WORKDIR /app/deployed-app

# Copy the deployed application from the builder stage
COPY --from=builder /app/deploy-resume .

# Copy the puppeteer browser cache from the builder stage
COPY --from=builder /root/.cache/puppeteer /root/.cache/puppeteer

# Set environment variables for Next.js production
ENV NODE_ENV=production

# Expose the port Next.js runs on
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "exec", "next", "start"]