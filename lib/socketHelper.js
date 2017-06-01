/**
 * Socket IO helper module
 *
 * This module is used define socket IO connection and events
 */
module.exports = function (io) {
  // usernames which are currently connected to the chat
  let usernames = {}

  // Socket IO Connection listener
  io.on('connection', function (socket) {
    let chatRoom = 'dashboard-chat'

    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function (username) {
      // store the username in the socket session for this client
      socket.username = username

      // store the room name in the socket session for this client
      socket.room = chatRoom

      // add the client's username to the global list
      usernames[username] = username

      // send client to chat room
      socket.join(chatRoom)

      // echo to client they've connected
      socket.emit('updatechat', 'SERVER', 'you have joined the chat')

      // echo to chat room that this person has connected
      socket.broadcast.to(chatRoom).emit(
        'updatechat',
        'SERVER', username + ' has joined'
      )
    })

    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data) {
      // we tell the client to execute 'updatechat' with 2 parameters
      io.sockets.in(socket.room).emit('updatechat', socket.username, data)
    })

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
      if (typeof socket.username !== 'undefined') {
        // echo to chat room that this person has disconnected
        socket.broadcast.to(chatRoom).emit(
          'updatechat',
          'SERVER',
          socket.username + ' has left'
        )

        // remove the username from global usernames list
        delete usernames[socket.username]
        socket.leave(socket.room)
      }
    })
  })
}
