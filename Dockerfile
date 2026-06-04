FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY server.js ./
COPY public ./public

ENV PORT=8098
ENV BASE_PATH=/maffia
ENV REDIS_URL=redis://redis-service:6379

EXPOSE 8098

CMD ["node", "server.js"]
