require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { processCsvFiles } = require('./data/insertData')



const app = express();
const port = process.env.PORT || 1051;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

processCsvFiles();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
