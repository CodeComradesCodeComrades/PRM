# dev build
FROM node:20 as dev


WORKDIR /usr/src/app/server
COPY package.json package-lock.json ./
RUN npm install

COPY . ./

CMD npm run start:debug
ENV NODE_ENV=development

FROM dev AS prod

RUN npm ci
RUN npm run build
RUN npm prune --omit=dev --omit=optional
ENV NODE_ENV=production


CMD "npm run start" 