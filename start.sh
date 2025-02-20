#!/bin/sh
set -e

host="$1"
shift
cmd="$@"

until pg_isready -h "$host"; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
#docker cp db.sql recsys_db:/tmp/db.sql
#psql -U main -d recsys_db -f /tmp/db.sql

npm install

node src/app.js

