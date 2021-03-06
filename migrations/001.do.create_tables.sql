
CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    username text NOT NULL,
    password text NOT NULL
);

CREATE TABLE decks (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    deckname text NOT NULL
);

CREATE TABLE cards (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    deck_id INTEGER
        REFERENCES decks(id) ON DELETE CASCADE NOT NULL,
    question text NOT NULL,
    answer text NOT NULL

);

--CREATE TABLE progress (
--   id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
--    user_id INTEGER
--        REFERENCES users(id) ON DELETE CASCADE NOT NULL,
--    deck_id INTEGER
--        REFERENCES decks(id) ON DELETE CASCADE NOT NULL,
--    difficulty INTEGER NOT NULL DEFAULT 0,
--    modified TIMESTAMPTZ DEFAULT now() NOT NULL
--);


