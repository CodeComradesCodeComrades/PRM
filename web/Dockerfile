FROM node:18-alpine as dev
WORKDIR /usr/src/app/web

COPY package*.json ./
RUN npm ci

COPY . .
CMD [ "npm", "run", "dev" ]

FROM web as prod
RUN npm run build
RUN mv build/handler.js build/handler.mjs