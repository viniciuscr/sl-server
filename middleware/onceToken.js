const crypto = require("crypto");

const onceToken = options => {
  /**
   * @param{KoaContext} ctx
   */
  return (ctx, next) => {
    const data = `${ctx.state.user} ${Math.random()}`;
    ctx.cookies.set(
      "token",
      crypto
        .createHash("sha1")
        .update(data)
        .digest("base64"),
      { path: "/photographer", overwrite: true}
    );
    // loggerFunction && loggerFunction(`onceToken: token gerado para ${user}, expira em ${timer}`);

    return next();
  };
};

module.exports = onceToken;
