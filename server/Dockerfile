# dev build
FROM node:20-alpine as dev

RUN apk add --no-cache tini
WORKDIR /usr/src/app
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server .
ENV PATH="${PATH}:/usr/src/app/bin" \
    NODE_ENV=development
ENTRYPOINT ["tini", "--", "/bin/sh"]
CMD [ "/usr/src/app/bin/start-dev.sh" ]


FROM dev AS prod

RUN npm run build
RUN npm prune --omit=dev --omit=optional

# web build
FROM node:20-alpine as web

WORKDIR /usr/src/open-api/typescript-sdk
COPY open-api/typescript-sdk/package*.json open-api/typescript-sdk/tsconfig*.json ./
RUN npm ci
COPY open-api/typescript-sdk/ ./
RUN npm run build

WORKDIR /usr/src/app
COPY web/package*.json web/svelte.config.js ./
RUN npm ci
COPY web ./
RUN npm run build


# prod build
FROM node:20-buster-slim
RUN apt update && apt install --no-install-recommends -yqq tini

WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=prod /usr/src/app/node_modules ./node_modules
COPY --from=prod /usr/src/app/dist ./dist
COPY --from=web /usr/src/app/build ./svelte
COPY --from=web /usr/src/app/package.json ./svelte
COPY --from=prod /usr/src/app/bin ./bin
COPY server/package.json server/package-lock.json ./
COPY server/start*.sh ./
RUN npm cache clean --force
ENV PATH="${PATH}:/usr/src/app/bin"
EXPOSE 3001
ENTRYPOINT ["tini", "--", "/bin/bash"]
CMD [ "start.sh" ]