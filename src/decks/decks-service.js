const DecksService = {
  getAllDecks(knex) {
    return knex("decks").select("*");
  },

  insertDeck(knex, newDeck) {
    return knex
      .insert(newDeck)
      .into("decks")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getByUser(knex, user_id) {
    return knex.from("decks").select("*").where("user_id", user_id);
  },
  updateDeckName(knex, id, newDeckName) {
    return knex("decks").where({ id }).update(newDeckName);
  },
  deleteDeck(knex, id) {
    return knex("decks").where({ id }).delete();
  },
};

module.exports = DecksService;
