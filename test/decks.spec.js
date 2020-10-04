const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const { makeDecksArray } = require("./decks.fixtures");
const { makeUsersArray } = require("./users.fixture");

describe("Decks endpoints", function () {
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
    db.raw("TRUNCATE decks, users RESTART IDENTITY CASCADE")
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
    db.raw("TRUNCATE decks, users RESTART IDENTITY CASCADE")
  );

  describe(`GET /api/decks`, () => {
    context(`Given no decks `, () => {
      it(`responds with 200 and an empty array`, () => {
        return supertest(app).get("/api/decks").expect(200, []);
      });
    });

    context(`Given there are decks `, () => {
      const testDecks = makeDecksArray();

      beforeEach("insert decks", () => {
        return db.into("decks").insert(testDecks);
      });

      it(`responds with 200 and test array from fixtures`, () => {
        return supertest(app)
          .get("/api/decks")
          .expect(200)
          .expect((res) => {
            expect(res.body[0].deckname).to.eql(testDecks[0].deckname);
          });
      });
    });
  });

  describe(`POST /api/decks`, () => {
    context(`creates a new deck`, () => {
      const newDeck = {
        user_id: 1,
        deckname: "test",
      };

      it(`creates new deck`, () => {
        return supertest(app)
          .post("/api/decks")
          .send(newDeck)
          .set("Authorization", `Bearer ${authToken}`)
          .expect(201);
      });
    });
  });

  describe(`GET /api/decks/id`, () => {
    context(`gets a  deck`, () => {
      const testDecks = makeDecksArray();

      beforeEach("insert decks", () => {
        return db.into("decks").insert(testDecks);
      });

      it(`returns deck`, () => {
        return supertest(app)
          .get("/api/decks/1")
          .set("Authorization", `Bearer ${authToken}`)
          .expect((res) => {
            expect(res.body[0].deckname).to.eql(testDecks[0].deckname);
          });
      });
    });
  });

  describe(`PUT /api/decks/id`, () => {
    context(`creates a new deck`, () => {
      const testDecks = makeDecksArray();

      const newDeck = {
        id: 1,
        deckname: "test",
      };

      beforeEach("insert decks", () => {
        return db.into("decks").insert(testDecks);
      });

      it(`updates deck`, () => {
        return supertest(app)
          .put("/api/decks/1")
          .send(newDeck)
          .set("Authorization", `Bearer ${authToken}`)
          .expect(204);
      });
    });
  });

  describe(`DELETE /api/decks/id`, () => {
    context(`deletes deck`, () => {
      const testDecks = makeDecksArray();

      beforeEach("insert decks", () => {
        return db.into("decks").insert(testDecks);
      });

      it(`deletes deck`, () => {
        return supertest(app)
          .delete("/api/decks/1")

          .set("Authorization", `Bearer ${authToken}`)
          .expect(204);
      });
    });
  });
});
