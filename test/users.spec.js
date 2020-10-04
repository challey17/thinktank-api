const knex = require("knex");
const app = require("../src/app");
const { makeUsersArray } = require("./users.fixture");

describe("users Endpoints", function () {
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
    db.raw("TRUNCATE users RESTART IDENTITY CASCADE")
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

  afterEach("cleanup", () => db.raw("TRUNCATE users RESTART IDENTITY CASCADE"));

  describe(`GET /api/users`, () => {
    context(`Given an existing user`, () => {
      const testUsers = makeUsersArray();

      it(`confirms auth token`, () => {
        return supertest(app)
          .get("/api/users")
          .set("Authorization", `Bearer ${authToken}`)
          .expect((res) => {
            expect(res.body.username).to.eql(testUsers[0].username);
          });
      });
    });
  });
});
