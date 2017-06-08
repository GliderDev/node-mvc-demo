var chai = require('chai')
var chaiHttp = require('chai-http')
// var server = require('../test')
var server = 'http://dmcoderepo.com:3000'
var should = chai.should()
var expect = chai.expect

chai.use(chaiHttp)

describe('auth controller route testing', function () {
  it('Should get /auth/login page', function (done) {
    chai.request(server)
    .get('/auth/login')
    .end(function (err, res) {
      if (err) done(new Error(err))
      res.should.have.status(200)
      expect(res.text).to.match(/sign\sin/i)
      done()
    })
  })
})