FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install && npm ci --prefer-offline

COPY . .

ENV NEXT_PUBLIC_TRIP_AGENCY_BACKEND_API_URL=https://traefikdev.yowyob.com/bus-station \
    NEXT_PUBLIC_YOWYOB_BACKEND_API_URL=https://traefikdev.yowyob.com/bus-station \
    NEXT_PUBLIC_AGENCY_BUSINESS_DOMAIN_ID=d65aa9f0-2ffe-11f0-9b96-7719a3386480 \
    NEXT_PUBLIC_POXY_URL_YOYOWB_BACKEND=/api \
    NEXT_PUBLIC_PROXY_URL_TRIP_AGENCY=/trip-agency \
    NEXT_PUBLIC_EXTERN_PROXY_URL=https://cors-anywhere.herokuapp.com \
    SECRET_KEY=shderdkqsisdis@!lqdnqdknq
    
RUN npm run build

FROM node:20-alpine AS runner

RUN apk add --no-cache curl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
