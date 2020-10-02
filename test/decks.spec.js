// const AuthService = require("../src/auth/auth-service");
// const knex = require("knex");
// const app = require("../src/app");
// const { makeDecksArray } = require("./decks.fixtures");

// describe("Decks endpoints", function () {
//   let db;

//   before("make knex instance", () => {
//     db = knex({
//       client: "pg",
//       connection: process.env.TEST_DATABASE_URL,
//     });
//     app.set("db", db);
//   });

//   after("disconnect from db", () => db.destroy());

//   before("clean the table", () =>
//     db.raw("TRUNCATE decks, users RESTART IDENTITY CASCADE")
//   );

//   afterEach("cleanup", () =>
//     db.raw("TRUNCATE decks, users RESTART IDENTITY CASCADE")
//   );

//   describe(`GET /api/decks`, () => {
//     context(`Given no decks `, () => {
//       it(`responds with 200 and an empty array`, () => {
//         return supertest(app).get("/api/decks").expect(200, []);
//       });
//     });

//     context(`Given there are posts `, () => {
//       const testPosts = makePostsArray();
//       const testUsers = makeUsersArray();

//       beforeEach("insert users", () => {
//         return db.into("users").insert(testUsers);
//       });
//       beforeEach("insert posts", () => {
//         return db.into("posts").insert(testPosts);
//       });

//       it(`responds with 200 and test array from fixtures`, () => {
//         return supertest(app)
//           .get("/api/posts")
//           .expect(200)
//           .expect((res) => {
//             expect(res.body[0].content).to.eql(testPosts[0].content);
//           });
//       });
//     });
//   });
// });

//TESTS
// GET - ALL DECKS
//POST -CREATE NEW DECK
//GET -DECK BY USERID
//PUT - UPDATE DECK NAME
// DELETE DECK
