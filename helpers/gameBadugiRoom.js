// config
const redis = require('@config/redis')
const errorHandler = require('@utilities/error-handler')

// libs
const _ = require('lodash')

// constants
const { INDEX } = require('@constants/redis')

module.exports = {
  async initialize () {
    try {
      const hasRoom = await redis.get(INDEX.BADUGI_ROOM)

      if (!hasRoom) {
        await redis.set(INDEX.BADUGI_ROOM, {})
      }
    } catch (error) {
      errorHandler(error)
    }
  },

  async createRoom (roomId) {
    try {
      const rooms = await redis.get(INDEX.BADUGI_ROOM)

      if (_.has(rooms, roomId)) {
        return
      }

      rooms[roomId] = {
        players: []
      }

      await redis.set(INDEX.BADUGI_ROOM, rooms)
    } catch (error) {
      throw errorHandler(error)
    }
  },

  async joinRoom ({
    user_id: userId,
    room_id: roomId
  }) {
    const rooms = await redis.get(INDEX.BADUGI_ROOM)

    if (!_.has(rooms, roomId)) {
      throw new Error('Room not found')
    }

    rooms[roomId].players = _.uniq([...rooms[roomId].players, userId])

    await redis.set(INDEX.BADUGI_ROOM, rooms)
  },

  async leaveRoom ({
    user_id: userId,
    room_id: roomId
  }) {
    const rooms = await redis.get(INDEX.BADUGI_ROOM)

    if (!_.has(rooms, roomId)) {
      throw new Error('Room not found')
    }

    rooms[roomId].players = rooms[roomId].players.filter(id => id !== userId)

    await redis.set(INDEX.BADUGI_ROOM, rooms)
  },

  async getRoom (roomId) {
    try {
      const rooms = await redis.get(INDEX.BADUGI_ROOM)

      return rooms[roomId]
    } catch (error) {
      throw errorHandler(error)
    }
  }
}
