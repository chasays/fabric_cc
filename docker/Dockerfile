FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

# Install Java (required for Allure reports) and pnpm
RUN apt-get update && apt-get install -y \
    openjdk-11-jre-headless \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Install browsers (Chrome only)， v1.54.2 no need
RUN pnpm exec playwright install chromium

# Set environment variables
ENV CI=true
ENV BASE_URL=https://parabank.parasoft.com
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-arm64

# Create reports directory
RUN mkdir -p reports

# Expose port for Allure reports
EXPOSE 5050

# Run tests
CMD ["pnpm", "run", "test:all"] 