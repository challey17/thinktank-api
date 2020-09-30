const path = require("path");
const express = require("express");
const DecksService = require("./decks-service");
const xss = require("xss");

const { requireAuth } = require("../middleware/jwt-auth");

const decksRouter = express.Router();
const jsonParser = express.json();

const serializeDeck = (deck) => ({
  id: deck.id,
  user_id: deck.user_id,
  deckname: xss(deck.deckname),
});

decksRouter.route("/").post(requireAuth, jsonParser, (req, res, next) => {
  const { deckname } = req.body;
  const newDeck = { user_id: req.user.id, deckname };

  for (const [key, value] of Object.entries(newDeck))
    if (value == null)
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` },
      });

  DecksService.insertDeck(req.app.get("db"), newDeck)
    .then((deck) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${deck.id}`))
        .json(serializeDeck(deck));
    })
    .catch(next);
});

decksRouter
  .route("/:id")
  .get(requireAuth, (req, res, next) => {
    // req.params.id is user_id
    DecksService.getByUser(req.app.get("db"), req.params.id)
      .then((decks) => {
        if (!decks) {
          return res.status(404).json({
            error: { message: `user doesn't exist` },
          });
        }
        res.json(decks.map(serializeDeck));
      })
      .catch(next);
  })
  .put(requireAuth, jsonParser, (req, res, next) => {
    const newDeckName = req.body;
    // id from decks table
    DecksService.updateDeckName(req.app.get("db"), req.params.id, newDeckName)
      .then(() => res.status(204))
      .catch(next);
  })
  .delete(requireAuth, (req, res, next) => {
    // id is from decks table
    DecksService.deleteDeck(req.app.get("db"), req.params.id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });
// Decks
// - [ DONE] Post new deck
// - [ DONE] Get decks, get all decks by userid
// - [ DONE ] Put - update deckname by deckid
// - [ DONE] Delete- delete deck by deckid

module.exports = decksRouter;
