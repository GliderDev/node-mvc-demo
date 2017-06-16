const restObj = require('../lib/restHelper')
const cors = require('cors')
// Module definition
module.exports.controller = function (app) {

  // HTTP GET route to test a GET response
  app.get('/api/test/get',
    cors(),
    function (req, res, next) {
      let restData = {
        statusCode: 200,
        data: {test: 'hello world'}
      }
      restObj.restHelper(restData, res, function (err, status) {
        if (err) next(new Error(err))
      })
    }
  )

  // HTTP POST route to test a POST response
  app.post('/api/test/post',
  cors(),
  function (req, res, next) {
    let restData = {
      statusCode: 200,
      data: req.body
    }
    restObj.restHelper(restData, res, function (err, status) {
      if (err) next(new Error(err))
    })
  })

  // HTTP POST route to test a server error response
  app.get('/api/test/error', function (req, res, next) {
    console.log(t)
  })
}
