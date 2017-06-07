var http = require('http')
var express = require( 'express' )
var app = express()

console.log(app.locals)
app.locals.test = 'test123'
console.log(app.locals)
delete app.locals.test
console.log(app.locals)



http.createServer(app).listen(3000, function () {
  console.log('Express started in ' + app.get('env') +
        ' mode on http://' + 'localshost' + ':' + app.get('port') +
        ' press Ctrl-C to terminate.')
})