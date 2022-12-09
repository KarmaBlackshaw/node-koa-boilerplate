// controllers
const userController = require('@modules/user/controller')

module.exports = ({ router }) => router
  .prefix('/user')

  .get(
    '/',
    userController.list
  )
