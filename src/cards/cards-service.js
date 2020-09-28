const CardsService = {
  insertCard(knex, newCard) {
    return knex
      .insert(newCard)
      .into("cards")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = CardsService;
