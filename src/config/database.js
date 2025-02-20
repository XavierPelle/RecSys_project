const { Client } = require('pg');

const dbConfig = {
    user: 'main',
    password: 'FB1atQfXCPptY7I7BuMsAX91bGcTXx4R',
    host: 'recsys_db',
    port: '5432',
    database: 'recsys_db',
};

const client = new Client(dbConfig);

module.exports = { client };
