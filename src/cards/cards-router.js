const path = require("path");
const express = require("express");
const CardsService = require("./cards-service");
const xss = require("xss");

const cardsRouter = express.Router();
const jsonParser = express.json();

const serializeCard = (card) => ({
  id: card.id,
  deck_id: card.deck_id,
  question: xss(card.question),
  answer: xss(card.answer),
});
// req.body is an array
cardsRouter.route("/").post(jsonParser, (req, res, next) => {
  const [{ deck_id, question, answer }, ...rest] = req.body;
  const newCards = [{ deck_id, question, answer }, ...rest];

  for (const [key, value] of Object.entries(newCard))
    if (value == null)
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` },
      });

  CardsService.insertCard(req.app.get("db"), newCards)
    .then((card) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${card.id}`))
        // need to return all all cards from array
        .json(serializeCard(card));
    })
    .catch(next);
});

// - [ ] Post- create new card, send deck_id in req
//   - [ ] Get all cards by deckid
// - [ ] Patch - edit card question/answer
// - [ ] Delete - delete card

module.exports = cardsRouter;
