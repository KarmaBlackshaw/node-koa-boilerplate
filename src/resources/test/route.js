// controllers
const testController = require('@modules/user/controller')

module.exports = ({ router }) => router
  .prefix('/tests')

  .get('/all', testController.list)

  .get('/find', testController.find)

  .patch('/', testController.patch)

  .delete('/', testController.delete)
