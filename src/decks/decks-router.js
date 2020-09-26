const path = require("path");
const express = require("express");
const DecksService = require("./decks-service");
const xss = require("xss");

const decksRouter = express.Router();
const jsonParser = express.json();

const serializeDeck = (deck) => ({
  id: deck.id,
  user_id: deck.user_id,
  deckname: xss(deck.deckname),
});

decksRouter.route("/").post(jsonParser, (req, res, next) => {
  const { user_id, deckname } = req.body;
  const newDeck = { user_id, deckname };

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

  .get((req, res, next) => {
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
  .put((req, res, next) => {
    // will use req.params.id as a post id
    PostsService.updatePost(req.app.get("db"), req.params.id, req.body)
      .then(() => res.send(204))
      .catch(next);
  });
// Decks
// - [ DONE] Post new deck
// - [ ] Get decks, get all decks by userid
// - [ ] Patch - update deckname by deckid
// - [ ] Delete- delete deck by deckid

//decks = id, user_id, deckname

module.exports = decksRouter;
