FROM node:18-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /api

COPY package*.json ./

COPY . .

EXPOSE 1051

ENTRYPOINT ["tail", "-f", "/dev/null"]