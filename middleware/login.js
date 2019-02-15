const jwt = require("jsonwebtoken");

const login = ctx => {

  const user = getUser();

  ctx.body = {
    token: jwt.sign(user, process.env.SECRET, { expiresIn: "1h" })
  };
};

const getUser = () => ({
  username: "user",
  password: "pass",
  type: "photographer",
  isAdmin: false
});

module.exports = {
  login
};
