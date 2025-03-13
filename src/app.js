require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { client } = require("./config/database.js");
const { processCsvFiles } = require('./data/insertData')

const app = express();

const port = 1051;

const { router } = require("./route.js");

app.use(express.json());
app.use(cors());

processCsvFiles();

app.use("/suggest", router);

app.get("/", (req, res) => {
  res.render("index.ejs"); // Ne pas mettre .ejs, Express le détecte automatiquement
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
