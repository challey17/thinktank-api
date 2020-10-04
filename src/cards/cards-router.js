const path = require("path");
const express = require("express");
const CardsService = require("./cards-service");
const xss = require("xss");
const { requireAuth } = require("../middleware/jwt-auth");

const cardsRouter = express.Router();
const jsonParser = express.json();

const serializeCard = (card) => ({
  id: card.id,
  deck_id: card.deck_id,
  question: xss(card.question),
  answer: xss(card.answer),
});
// req.body is an array
cardsRouter
  .route("/")
  .get((req, res, next) => {
    CardsService.getAllCards(req.app.get("db"))
      .then((cards) => {
        res.json(cards.map(serializeCard));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { deck_id, question, answer } = req.body;
    const newCard = { deck_id, question, answer };

    for (const [key, value] of Object.entries(newCard))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    CardsService.insertCard(req.app.get("db"), newCard)
      .then((cards) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${cards.id}`))

          .json(serializeCard(cards));
      })
      .catch(next);
  });

cardsRouter
  .route("/:id")
  //all cards by deckId
  .get(requireAuth, (req, res, next) => {
    CardsService.getByDeckId(req.app.get("db"), req.params.id)
      .then((cards) => {
        if (!cards) {
          return res.status(404).json({
            error: { message: `deck doesn't exist` },
          });
        }
        res.json(cards.map(serializeCard));
      })
      .catch(next);
  })
  .put(requireAuth, jsonParser, (req, res, next) => {
    const { question, answer } = req.body;
    const updatedCard = { question, answer };
    CardsService.updateCard(req.app.get("db"), req.params.id, updatedCard)
      .then(() => res.send(204))
      .catch(next);
  })
  .delete(requireAuth, (req, res, next) => {
    CardsService.deleteCard(req.app.get("db"), req.params.id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = cardsRouter;
