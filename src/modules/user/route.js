// controllers
const userController = require('@modules/user/controller')

module.exports = ({ router }) => router
  .prefix('/user')

  .get('/all', userController.list)

  .get('/find', userController.find)

  .patch('/', userController.patch)

  .delete('/', userController.delete)
