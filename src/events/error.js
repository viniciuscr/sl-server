const errorEvent = (err, ctx) => {
  //TODO: save on database and/or file
  ctx.throw(500, err.message);
};

export default errorEvent;
