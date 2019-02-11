const jwt = require("jsonwebtoken");

const login = ctx => {
  ctx.body = {
    token: jwt.sign(
      {
        data: "foobar"
      },
      "secret",
      { expiresIn: "1h" }
    )
  };
};

module.exports = {
  login
};
