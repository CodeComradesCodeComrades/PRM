# dev build
FROM node:20 as dev


WORKDIR /usr/src/app/server
COPY package.json package-lock.json ./
RUN npm ci

COPY . ./

CMD npm run start:dev

FROM dev AS prod

RUN npm run build
RUN npm prune --omit=dev --omit=optional

CMD "npm run start" 