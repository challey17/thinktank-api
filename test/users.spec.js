// const knex = require("knex");
// const app = require("../src/app");
// const { makeUsersArray } = require("./users.fixture");
// const { requireAuth } = require("../src/middleware/jwt-auth");
// const jwt = require("jsonwebtoken");
// describe("users Endpoints", function () {
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
//     db.raw("TRUNCATE users RESTART IDENTITY CASCADE")
//   );

//   afterEach("cleanup", () => db.raw("TRUNCATE users RESTART IDENTITY CASCADE"));

//   describe(`GET /api/users`, () => {
//     context(`Given an existing user`, () => {
//       const testUsers = makeUsersArray();

//       function createJwt(subject, payload) {
//         return jwt.sign(payload, process.env.JWT_SECRET, {
//           subject,
//           algorithm: "HS256",
//         });
//       }
//       //const subject = { username: "chayce" };
//       const payload = { id: 1 };
//       beforeEach("insert users", () => {
//         return db.into("users").insert(testUsers[0]);
//       });

//       it(`confirms auth token`, () => {
//         return supertest(app)
//           .get("/api/users")
//           .set("Authorization", ` Bearer ${createJwt("chayce", payload)}`)
//           .send(testUsers[0])
//           .expect((res) => {
//             expect(res.body).to.eql(testUsers[0]);
//           });
//       });
//     });
//   });
// });

// // test cases
// // GET ,responds with req.user?
