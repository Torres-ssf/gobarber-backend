FROM node:lts-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json tsconfig.json yarn.* ./
COPY ormconfig.docker.json ./ormconfig.json
COPY .env.docker ./.env
COPY src ./src
COPY tmp ./tmp

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait

RUN chmod +x /wait

RUN yarn

EXPOSE 3333

CMD /wait && yarn typeorm migration:run && yarn dev:server