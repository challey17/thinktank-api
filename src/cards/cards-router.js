const path = require("path");
const express = require("express");
const CardsService = require("./cards-service");
const xss = require("xss");

const cardsRouter = express.Router();
const jsonParser = express.json();

module.exports = cardsRouter;
