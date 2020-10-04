# Think Tank

[live link](https://thinktank-client.vercel.app/)

A full-stack app where users can create and study flashcards. Users can login and register securely. Users cards are saved to their account.

[client Repo](https://github.com/challey17/thinktank-client)

## Endpoints

- /api/users

  - GET - gets the user data from an authToken
  - POST - creates a new user

- /api/login

  - POST - logs a user in

- /api/decks

  - GET - returns all decks
  - POST - creates new deck

- /api/decks/:id

  - PUT - updates deckname by id
  - DELETE - deletes deck (and any cards in that deck)

- /api/cards

  -GET - returns all cards
  -POST - creates new card

- api/cards/:id
  - GET - cards by deck id
  - PUT -updates card question/answer by card id
  - DELETE - deletes card by card id

## Technology

Node.js, Express.js, Knex, Mocha, Chai, RESTful API Endpoints, JWT, PostgresSQL
