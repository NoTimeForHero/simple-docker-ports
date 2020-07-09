# Dockerfile по гайду:
# https://nodejs.org/ru/docs/guides/nodejs-docker-webapp/

# Перед запуском, не забудьте подключить modules с нужными модулями через bind/volume
# А также передать все переменные окружения из .env файла

FROM node:12
WORKDIR /app

# Ради кэширования слоев?
COPY package*.json ./

RUN npm install

# Если вы создаете сборку для продакшн
# RUN npm ci --only=production

# копируем исходный код
COPY . .

CMD [ "node", "index.js" ]