FROM node:20-alpine as web-dev
WORKDIR /usr/src/app/web

COPY web/package*.json ./
RUN npm ci

COPY web .
CMD [ "npm", "run", "dev" ]

FROM web-dev as web
RUN npm run build
RUN mv build/handler.js build/handler.mjs


FROM node:20-alpine as server-dev

WORKDIR /usr/src/app/server

COPY server/package*.json .
RUN npm install

COPY server/ .
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

FROM server-dev as server
COPY --from=web /usr/src/app/web/build ../svelte/build
COPY --from=web /usr/src/app/web/package.json ../svelte/package.json

ENV NODE_ENV=production
CMD ["npm", "run", "start"]
