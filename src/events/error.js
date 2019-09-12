/**
 *  @typedef {import('Koa').ParameterizedContext} context
 * 
 * @param {HttpError} err 
 * @param {context} ctx 
 */
const errorEvent = (err, ctx) => {
  console.log(err, ctx.URL)
};

export default errorEvent;
