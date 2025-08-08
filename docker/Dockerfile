FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Install browsers
RUN npx playwright install

# Set environment variables
ENV CI=true
ENV BASE_URL=https://parabank.parasoft.com

# Create reports directory
RUN mkdir -p reports

# Run tests
CMD ["npm", "run", "test:all"] 