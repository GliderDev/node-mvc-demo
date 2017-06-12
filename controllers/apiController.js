// Module definition
module.exports.controller = function (app) {

  // HTTP GET route to test a GET response
  app.get('/api/test/get', function (req, res, next) {
    res.json({
      data: 'hello from server'
    })
  })

  // HTTP POST route to test a POST response
  app.post('/api/test/post', function (req, res, next) {
    res.json({data: req.body})
  })

  // HTTP POST route to test a server error response
  app.get('/api/test/error', function (req, res, next) {
    console.log(t)
  })
}
