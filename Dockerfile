# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

ARG VITE_EMAILJS_SERVICE_ID
ARG VITE_EMAILJS_TEMPLATE_ID
ARG VITE_EMAILJS_PUBLIC_KEY
ENV VITE_EMAILJS_SERVICE_ID=$VITE_EMAILJS_SERVICE_ID
ENV VITE_EMAILJS_TEMPLATE_ID=$VITE_EMAILJS_TEMPLATE_ID
ENV VITE_EMAILJS_PUBLIC_KEY=$VITE_EMAILJS_PUBLIC_KEY

COPY . .
RUN npm run build

# Production stage with Nginx and Node.js Database API
FROM nginx:alpine

# Install Node.js runtime for database API
RUN apk add --no-cache nodejs

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy database server script and initial data
COPY server.js /usr/share/nginx/html/server.js
COPY data /usr/share/nginx/html/data

EXPOSE 80

CMD ["sh", "-c", "node /usr/share/nginx/html/server.js & nginx -g 'daemon off;'"]
