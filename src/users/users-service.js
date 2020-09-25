const bcrypt = require("bcryptjs");

const UsersService = {
  hasUserWithUserName(knex, username) {
    return knex("users")
      .where({ username })
      .first()
      .then((user) => !!user);
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Password be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }

    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
};

module.exports = UsersService;

// hasUserWithUserName(db, email) {
//     return db('users')
//         .where({ email })
//         .first()
//         .then(user => !!user)
// },
// insertUser(db, newUser) {
//     return db
//         .insert(newUser)
//         .into('users')
//         .returning('*')
//         .then(([user]) => user)
// },
// validatePassword(password) {
//     if (password.length < 6) {
//         return 'Password must be longer than 6 characters'
//     }
//     if (password.length > 72) {
//         return 'Password must be less than 72 characters'
//     }
//     if (password.startsWith(' ') || password.endsWith(' ')) {
//         return 'Password must not start or end with empty spaces'
//     }
// },
// hashPassword(password) {
//     return bcrypt.hash(password, 12)
// },
