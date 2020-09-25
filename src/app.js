require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
//loading routers
const usersRouter = require("./users/users-router");
const decksRouter = require("./decks/decks-router");
const cardsRouter = require("./cards/cards-router");

//express instance
const app = express();

//Morgan settings
const morganOption = NODE_ENV === "production" ? "tiny" : "common";

//middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

//routers
app.use("/api/users", usersRouter);
app.use("/api/decks", decksRouter);
//app.use("/api/cards", cardsRouter);
// ERROR HANDLING
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
