const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { client } = require("./config/database.js");
const path = require('path');
const { processCsvFiles } = require('./data/insertData')

const app = express();
const port = 1051;
const { router } = require("./route.js");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

processCsvFiles()

client.connect();

app.use(express.json());
app.use(cors());

app.use("/suggest", router);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
