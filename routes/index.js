module.exports = (router) => {
  router.prefix('/v1')
  router.use('/login', require('./login'))
  router.use('/photographer', require('./photographer'))
  }