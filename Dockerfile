FROM node:21-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /api

COPY package*.json ./

COPY . .

EXPOSE 1051

ENTRYPOINT ["sh", "start.sh", "recsys_db"]