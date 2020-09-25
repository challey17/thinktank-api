const express = require("express");
const path = require("path");
const xss = require("xss");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonBodyParser = express.json();

const serializeUser = (user) => ({
  id: user.id,
  username: xss(user.username),
  password: xss(user.password),
});

usersRouter.post("/", jsonBodyParser, (req, res, next) => {
  const { password, username } = req.body;

  for (const field of ["username", "password"])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`,
      });

  const passwordError = UsersService.validatePassword(password);

  if (passwordError) return res.status(400).json({ error: passwordError });

  UsersService.hasUserWithUserName(req.app.get("db"), username)
    .then((hasUserWithUserName) => {
      if (hasUserWithUserName)
        return res.status(400).json({ error: `Username already taken` });

      return UsersService.hashPassword(password).then((hashedPassword) => {
        const newUser = {
          username,
          password: hashedPassword,
        };

        return UsersService.insertUser(req.app.get("db"), newUser).then(
          (user) => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(serializeUser(user));
          }
        );
      });
    })
    .catch(next);
});

module.exports = usersRouter;
