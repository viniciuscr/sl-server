module.exports = (router) => {
    router.prefix('/v1')
    router.use('/photographer', require('./photographer'))
  }