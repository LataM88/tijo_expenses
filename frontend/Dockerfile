# --- Development stage (with Hot Module Replacement) ---
FROM node:22-alpine AS dev
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Uruchamia npm install przy starcie, aby zsynchronizować wolumen node_modules z package.json
CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0"]

# --- Build stage ---
FROM dev AS build
RUN npm run build

# --- Production stage (Nginx serving static build) ---
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
