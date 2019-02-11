const jwt = require("jsonwebtoken");

const login = ctx => {
  ctx.cookies.set(
    "token",
    jwt.sign(
      {
        data: "fofo"
      },
      "secret",
      { expiresIn: "10m" }
    ), {path:"/photographer", overwrite:true }
  );
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
