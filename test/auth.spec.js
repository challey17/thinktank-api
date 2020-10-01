const AuthService = require("../src/auth/auth-service");
const knex = require("knex");
const app = require("../src/app");

describe("Auth Endpoints", function () {
  let db;
  let testUser = [
    {
      id: 1,
      username: "chayce",
      password: "Password1",
    },
  ];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());
  before("clean the tables before ", () =>
    db.raw("TRUNCATE TABLE users, decks RESTART IDENTITY CASCADE")
  );
  afterEach("clean the tables afterEach", () =>
    db.raw("TRUNCATE TABLE users, decks RESTART IDENTITY CASCADE")
  );

  context(`Given 'users' has data`, () => {
    before(() => {
      return db.into("users").insert(testUser);
    });

    it(`confirms user`, () => {
      return AuthService.getUserWithUserName(db, "chayce").then((actual) => {
        expect(actual).to.eql({
          id: 1,
          username: "chayce",
          password: "Password1",
        });
      });
    });
  });
});
