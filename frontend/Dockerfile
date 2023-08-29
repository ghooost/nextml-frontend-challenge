FROM node:18.4.0-alpine3.15

WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./index.html ./
COPY ./vite.config.ts ./
RUN npm ci

COPY ./src ./src
COPY ./public ./public

CMD [ "npm", "run", "start" ]
