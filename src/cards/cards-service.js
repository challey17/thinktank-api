const CardsService = {
  getAllCards(knex) {
    return knex("cards").select("*");
  },
  insertCard(knex, newCard) {
    return knex
      .insert(newCard)
      .into("cards")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getByDeckId(knex, deck_id) {
    return knex.from("cards").select("*").where("deck_id", deck_id);
  },
  //id is card id
  updateCard(knex, id, updatedCard) {
    return knex("cards").where("id", id).update(updatedCard);
  },
  deleteCard(knex, id) {
    return knex("cards").where("id", id).delete();
  },
};

module.exports = CardsService;
