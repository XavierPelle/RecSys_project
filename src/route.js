const express = require("express");
const { getSugestByItemId } = require("./controller");

const router = express.Router();

router.get("/:id/:limit", getSugestByItemId);

module.exports = { router };
