FROM node:lts-alpine

USER node
WORKDIR /app
COPY . .
RUN npm ci

CMD npm start
