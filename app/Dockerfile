FROM node:lts-alpine
WORKDIR /app
COPY --chown=node:node . .
USER node
RUN npm install
EXPOSE 9200 5001
CMD npm start