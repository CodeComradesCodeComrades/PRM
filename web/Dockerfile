# Basis-Image
FROM node:18-alpine as web
WORKDIR /usr/src/app/web

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]