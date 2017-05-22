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

var dmcoderepo = vhost(config.domainName, require('./dmcoderepo'))
app.use(dmcoderepo)

// Creating Server Instance
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express started in ' + app.get('env') +
        ' mode on http://' + config.domainName + ':' + app.get('port') +
        ' press Ctrl-C to terminate.')
})
