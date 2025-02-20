const fs = require("fs");
const { Pool } = require("pg");
const fastcsv = require("fast-csv");

const batchSize = 5000;

function processCsvFiles() {
    const pool = new Pool({
        user: 'main',
        password: 'FB1atQfXCPptY7I7BuMsAX91bGcTXx4R',
        host: 'recsys_db',
        port: '5432',
        database: 'recsys_db',
    });

    const createTableQueries = [
        `
      CREATE TABLE IF NOT EXISTS train_sessions (
        session_id INTEGER,
        item_id INTEGER
      );
    `,
        `
      CREATE TABLE IF NOT EXISTS train_purchases (
        session_id INTEGER,
        item_id INTEGER
      );
    `
    ];

    pool.connect((err, client, done) => {
        if (err) {
            console.error("Erreur de connexion à la base de données:", err.stack);
            return;
        }

        createTableQueries.forEach(query => {
            client.query(query, (err, res) => {
                if (err) {
                    console.error("Erreur lors de la création des tables:", err.stack);
                }
            });
        });

        processCsvFile(client, "src/data/train_sessions.csv", "train_sessions");
        processCsvFile(client, "src/data/train_purchases.csv", "train_purchases");
    });

    pool.on('error', (err) => {
        console.error('Erreur de pool PostgreSQL:', err.stack);
    });
}

function processCsvFile(client, fileName, tableName) {
    let stream = fs.createReadStream(fileName);
    let csvData = [];

    let csvStream = fastcsv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            csvData.shift();

            let batch = [];
            csvData.forEach((row, index) => {
                batch.push(row);

                if (batch.length === batchSize || index === csvData.length - 1) {
                    let insertQuery = `INSERT INTO ${tableName} (session_id, item_id) VALUES ` +
                        batch.map((_, i) => `($${2 * i + 1}, $${2 * i + 2})`).join(", ");

                    client.query(insertQuery, batch.flat(), (err, res) => {
                        if (err) {
                            console.error(`Erreur d'insertion par lot dans ${tableName}:`, err.stack);
                        } else {
                            console.log(`Inséré ${res.rowCount} ligne(s) dans ${tableName}.`);
                        }
                    });

                    batch = [];
                }
            });
        });

    stream.pipe(csvStream);
}

module.exports = { processCsvFiles };
