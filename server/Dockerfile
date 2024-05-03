# dev build
FROM node:20 as dev
ARG UID=1000
ARG GID=1000
USER node

WORKDIR /usr/src/app/server
COPY --chown=node:node package.json package-lock.json ./
RUN npm install

COPY --chown=node:node . ./

CMD npm run start:debug
ENV NODE_ENV=development

FROM dev AS prod

RUN npm ci
RUN npm run build
RUN npm prune --omit=dev --omit=optional
ENV NODE_ENV=production


CMD "npm run start" 