# ---- Build Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Serve Stage ----
FROM nginx:1.27-alpine

# Copy built Angular app
COPY --from=builder /app/dist/timestash/browser /usr/share/nginx/html

# Custom nginx config for Angular SPA + security headers
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
