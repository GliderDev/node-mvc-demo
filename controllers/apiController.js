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

  // HTTP GET route to test query string
  app.get('/api/test/query',
    cors(),
    function (req, res, next) {
      let restData = {
        statusCode: 200,
        data: req.query
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
    // let restData = {
    //   statusCode: 200,
    //   data: req.body
    // }
    // restObj.restHelper(restData, res, function (err, status) {
    //   if (err) next(new Error(err))
    // })
    res.send(req.body)
  })

  // HTTP POST route to test a server error response
  app.get('/api/test/error', function (req, res, next) {
    console.log(t)
  })

  // HTTP POST route to test file upload
  app.post('/api/test/file', function (req, res, next) {
    let path = require('path')
    let imgObj = req.files.uploads
    let fileSize = imgObj.data.toString().length
    let formData = req.body
    if (imgObj) {
      // Uploading image to /public/uploads directory
      imgObj.mv(
        path.join(__dirname, '/../public/uploads/', imgObj.name),
        function (err) {
          if (err) {
            next(new Error('error while uploading file ' + JSON.stringify(err)))
          }
        }
      )
    }
    res.send({form: formData, imageData: {name: imgObj.name, fileSize: fileSize}})
  })
}
