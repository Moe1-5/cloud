FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV SERVE_STATIC_FRONTEND=true
ENV FRONTEND_DIST_PATH=/app/apps/frontend/dist
COPY package*.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci --omit=dev --workspaces --include-workspace-root
COPY --from=build /app/apps/backend/dist apps/backend/dist
COPY --from=build /app/apps/frontend/dist apps/frontend/dist
COPY --from=build /app/packages/shared/dist packages/shared/dist
EXPOSE 3000
CMD ["npm", "start"]
