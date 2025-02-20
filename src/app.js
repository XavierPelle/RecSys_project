require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { client } = require('./config/database');



const app = express();
const port = process.env.PORT || 1051;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

client
    .connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
        client.query(` SELECT * FROM train_sessions INNER JOIN train_purchases ON train_sessions.session_id = train_purchases.session_id WHERE train_sessions.item_id=15085`, (err, result) => {
            if (err) {
                console.error('Error executing query', err);
            } else {
                console.log('Query result:', result.rows);
            }   
        });
    })
    .catch((err) => {
        console.error('Error connecting to PostgreSQL database', err);
    });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
