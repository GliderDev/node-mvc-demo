/**
 * Socket I/O Example
 */

var http = require('http')
var config = require('./lib/config')
var express = require('express')
var app = express()
// Sets Port number as 3000 if not provided
app.set('port', process.env.PORT || config.ServerPort)

// var server = app.listen(config.ServerPort, function () {
//   console.log('Express started in ' + app.get('env') +
//         ' mode on http://localhost:' + app.get('port') +
//         ' press Ctrl-C to terminate.')
// })



// Creating Server Instance
var server = http.createServer(app).listen(app.get('port'), function () {
  console.log('Express started in ' + app.get('env') +
        ' mode on http://' + config.domainName + ':' + app.get('port') +
        ' press Ctrl-C to terminate.')
})
var io = require('socket.io')(server)




app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function (socket) {
  console.log('a user connected')
  socket.on('chat message', function (msg) {
    console.log(msg)
    io.emit('chat message', msg)
  })
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
})
