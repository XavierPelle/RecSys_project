const fs = require("fs");
const { Pool } = require("pg");
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("train_purchases.csv");
let csvData = [];
let batchSize = 5000; 

let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    csvData.shift();

    const pool = new Pool({
        user: 'main',
        password: 'FB1atQfXCPptY7I7BuMsAX91bGcTXx4R',
        host: 'recsys_db',
        port: '5432',
        database: 'recsys_db',
    });

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS train_purchases (
        session_id INTEGER,
        item_id INTEGER
      );
    `;

    pool.connect((err, client, done) => {
      if (err) {
        console.error("Erreur de connexion à la base de données:", err.stack);
        return;
      }

      client.query(createTableQuery, (err, res) => {
        if (err) {
          console.error("Erreur lors de la création de la table:", err.stack);
        } else {
          console.log("Table 'train_purchasses' créée ou déjà existante.");
        }

        const query = "INSERT INTO train_purchases (session_id, item_id) VALUES ($1, $2)";
        
        let batch = [];
        csvData.forEach((row, index) => {
          batch.push(row);
          
          if (batch.length === batchSize || index === csvData.length - 1) {
            client.query(
              "INSERT INTO train_purchases (session_id, item_id) VALUES " +
              batch.map((_, i) => `($${2 * i + 1}, $${2 * i + 2})`).join(", "),
              batch.flat(),
              (err, res) => {
                if (err) {
                  console.error("Erreur d'insertion par lot:", err.stack);
                } else {
                  console.log("Inséré " + res.rowCount + " ligne(s).");
                }
              }
            );
            batch = []; 
          }
        });
      });
    });
    
    pool.on('error', (err) => {
      console.error('Erreur de pool PostgreSQL:', err.stack);
    });
  });

stream.pipe(csvStream);
