const path = require("path");
const express = require("express");
const DecksService = require("./decks-service");
const xss = require("xss");

const decksRouter = express.Router();
const jsonParser = express.json();

module.exports = decksRouter;
