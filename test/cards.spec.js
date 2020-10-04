const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const { makeCardsArray } = require("./cards.fixtures");
const { makeUsersArray } = require("./users.fixture");
const { makeDecksArray } = require("./decks.fixtures");

describe("Cards endpoints", function () {
  let db;
  let authToken;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE cards, decks, users RESTART IDENTITY CASCADE")
  );

  beforeEach("create and authorize a user", () => {
    const testUsers = makeUsersArray();
    return supertest(app)
      .post("/api/users")
      .send(testUsers[0])
      .then((res) => {
        return supertest(app)
          .post("/api/login")
          .send(testUsers[0])
          .then((res2) => {
            return (authToken = res2.body.authToken);
          });
      });
  });

  afterEach("cleanup", () =>
    db.raw("TRUNCATE cards, decks, users RESTART IDENTITY CASCADE")
  );

  describe(`GET /api/cards`, () => {
    context(`Given there are cards `, () => {
      const testCards = makeCardsArray();
      const testDecks = makeDecksArray();

      beforeEach("insert decks", () => {
        return db.into("decks").insert(testDecks);
      });

      beforeEach("insert cards", () => {
        return db.into("cards").insert(testCards);
      });

      it(`responds with 200 and test array from fixtures`, () => {
        return supertest(app)
          .get("/api/cards")
          .expect(200)
          .expect((res) => {
            expect(res.body[0].id).to.eql(testCards[0].id);
          });
      });
    });
  });

  describe(`POST /api/cards`, () => {
    context(`creates new card `, () => {
      const testCards = makeCardsArray();
      const testDecks = makeDecksArray();
      const newCard = {
        id: 3,
        deck_id: 1,

        question: "test question",
        answer: "test answer",
      };

      beforeEach("insert decks", () => {
        return db.into("decks").insert(testDecks);
      });

      beforeEach("insert cards", () => {
        return db.into("cards").insert(testCards);
      });

      it(`responds with 201`, () => {
        return supertest(app)
          .post("/api/cards")
          .send(newCard)
          .set("Authorization", `Bearer ${authToken}`)
          .expect(201);
      });
    });
  });

  describe(`GET /api/cards/id`, () => {
    context(`given card exists`, () => {
      const testCards = makeCardsArray();
      const testDecks = makeDecksArray();

      beforeEach("insert decks", () => {
        return db.into("decks").insert(testDecks);
      });
      beforeEach("insert cards", () => {
        return db.into("cards").insert(testCards);
      });

      it(`returns card`, () => {
        return supertest(app)
          .get("/api/cards/1")
          .set("Authorization", `Bearer ${authToken}`)
          .expect((res) => {
            expect(res.body[0].question).to.eql(testCards[0].question);
          });
      });
    });
  });

  describe(`PUT /api/cards/id`, () => {
    context(`given card exists`, () => {
      const testCards = makeCardsArray();
      const testDecks = makeDecksArray();
      const newCard = {
        question: "update",
      };

      beforeEach("insert decks", () => {
        return db.into("decks").insert(testDecks);
      });
      beforeEach("insert cards", () => {
        return db.into("cards").insert(testCards);
      });

      it(` UPDATES card`, () => {
        return supertest(app)
          .put("/api/cards/2")
          .set("Authorization", `Bearer ${authToken}`)
          .send(newCard)
          .expect(204);
      });
    });
  });

  describe(`DELETE /api/cards/id`, () => {
    context(`deletes card`, () => {
      const testDecks = makeDecksArray();
      const testCards = makeCardsArray();

      beforeEach("insert decks", () => {
        return db.into("decks").insert(testDecks);
      });
      beforeEach("insert cards", () => {
        return db.into("cards").insert(testCards);
      });

      it(`deletes card`, () => {
        return supertest(app)
          .delete("/api/cards/2")

          .set("Authorization", `Bearer ${authToken}`)
          .expect(204);
      });
    });
  });
});
