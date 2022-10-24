// config
const { nsBadugi } = require('@config/socket')

// libs
const Joi = require('joi')

// utilities
const errorHandler = require('@utilities/error-handler')

// helpers
const gameBadugiRoom = require('@helpers/gameBadugiRoom')

function initListeners () {
  return new Promise(resolve => {
    nsBadugi.on('connection', socket => {
      socket.on('join-room', data => onJoinRoom(socket, JSON.parse(data)))
      socket.on('create-room', data => onCreateRoom(socket, JSON.parse(data)))
      socket.on('leave-room', data => onLeaveRoom(socket, JSON.parse(data)))

      resolve()
    })
  })
}

async function onCreateRoom (socket, _data) {
  try {
    const schema = Joi.object({
      room_id: Joi.number()
        .required(),
      user_id: Joi.number()
        .required()
    })

    const data = await schema.validateAsync(_data)

    const room = await gameBadugiRoom.getRoom(data.room_id)

    /**
     * If room exists
     */
    if (room) {
      console.warn(`Create room: ${data.room_id} already exists`)
      return
    }

    await gameBadugiRoom.createRoom(data.room_id)

    console.success(`Create room: ${data.room_id}`)
  } catch (error) {
    throw errorHandler(error)
  }
}

async function onJoinRoom (socket, _data) {
  try {
    const schema = Joi.object({
      room_id: Joi.number()
        .required(),
      user_id: Joi.number()
        .required()
    })

    const data = await schema.validateAsync(_data)

    const room = await gameBadugiRoom.getRoom(data.room_id)

    if (!room) {
      console.warn(`Join room: ${data.room_id} does not exist`)
      return
    }

    await gameBadugiRoom.joinRoom({
      user_id: data.user_id,
      room_id: data.room_id
    })

    socket.join(data.room_id)

    console.success(`Join room: ${data.room_id}`)
  } catch (error) {
    throw errorHandler(error)
  }
}

async function onLeaveRoom (socket, _data) {
  try {
    const schema = Joi.object({
      room_id: Joi.number()
        .required(),
      user_id: Joi.number()
        .required()
    })

    const data = await schema.validateAsync(_data)

    const room = await gameBadugiRoom.getRoom(data.room_id)

    if (!room) {
      console.warn(`Leave room: ${data.room_id} does not exist`)
      return
    }

    await gameBadugiRoom.leaveRoom({
      user_id: data.user_id,
      room_id: data.room_id
    })

    socket.leave(data.room_id)

    console.success(`Leave room: ${data.room_id}`)
  } catch (error) {
    throw errorHandler(error)
  }
}

async function bootstrap () {
  await gameBadugiRoom.initialize()
  await initListeners()

  setInterval(() => {
    nsBadugi.to(1).emit('hey', 'hey')
  }, 1000)
}

bootstrap()
// onJoinRoom()
