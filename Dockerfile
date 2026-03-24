# Step 1: Build Stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* bun.lock* ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Runtime Stage (Next.js server)
FROM node:20-alpine

WORKDIR /app

# Copy production build artifacts
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/next.config.mjs ./next.config.mjs

EXPOSE 3006

CMD ["sh", "-c", "npm run start -- -p 3006 -H 0.0.0.0"]
