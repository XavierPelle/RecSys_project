require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { client } = require("./config/database.js");

const app = express();

const port = 1051;

const { router } = require("./route.js");

app.use(express.json());
app.use(cors());

app.use("/suggest", router);

app.get("/", (req, res) => {
  res.render("index.ejs"); // Ne pas mettre .ejs, Express le détecte automatiquement
});

client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
    client.query(
      `
        SELECT 
        train_purchases.item_id, 
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS percentage
        FROM train_sessions
        INNER JOIN train_purchases ON train_sessions.session_id = train_purchases.session_id
        WHERE train_sessions.item_id = 15085
        GROUP BY train_purchases.item_id
        ORDER BY percentage DESC
        LIMIT 3;
      `,
      (err, result) => {
        if (err) {
          console.error("Error executing query", err);
        } else {
          console.log("Query result:", result.rows);
        }
      }
    );
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
