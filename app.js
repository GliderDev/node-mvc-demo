/**
 * app.js
 *
 * Server Configuration file
 */
var http = require('http')
var express = require('express')
var vhost = require('vhost')
var config = require('./lib/config')

var app = express()

// Sets Port number as 3000 if not provided
app.set('port', process.env.PORT || config.ServerPort)

// Creating Server Instance
var server = http.createServer(app).listen(app.get('port'), function () {
  console.log('Express started in ' + app.get('env') +
        ' mode on http://' + config.domainName + ':' + app.get('port') +
        ' press Ctrl-C to terminate.')
})

// Socket I/O configuration
var io = require('socket.io')(server)

// Creating instance of the dmcoderepo app
// Also passing socket io object to dmcoderepo
var dmcoderepo = vhost(config.domainName, require('./dmcoderepo')(io))
app.use(dmcoderepo)