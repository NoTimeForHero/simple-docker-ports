# Dockerfile по гайду:
# https://nodejs.org/ru/docs/guides/nodejs-docker-webapp/

FROM node:12
WORKDIR /app

# Ради кэширования слоев?
COPY package*.json ./

RUN npm ci --only=production

# копируем исходный код
COPY . .

CMD [ "node", "index.js" ]