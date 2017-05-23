/**
 * Simple node_acl example with mongoDB and expressjs
 *
 * Usage:
 *  1. Start this as server
 *  2. Play with the resoures
 *
 *     Show all permissions (as JSON)
 *      http://localhost:3500/info
 *
 *     Only visible for users and higher
 *      http://localhost:3500/secret
 *
 *     Only visible for admins
 *      http://localhost:3500/topsecret
 *
 *     Manage roles
 *     user is 'bob' and role is either 'guest', 'user' or 'admin'
 *      http://localhost:3500/allow/:user/:role
 *      http://localhost:3500/disallow/:user/:role
 *
 * Don't forget to disallow a role, if you want to revoke its
 *  permissions.
 */

var express = require('express')
var port = 3500
var app = express()

// Password has creation and verification
// var bcrypt = require('bcrypt')
// var myPlaintextPassword = 'pass'
// var saltRounds = 10
// var myHash = '$2a$10$9sBpYqzqSod3gW00tCCKJez2lc1/hZTgKoi2YP.dXY1TDXqcgCY2C'

// bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
//   if (err) console.log(err)
//   console.log(hash)
// })

// bcrypt.compare(myPlaintextPassword, myHash, function (err, res) {
//   if (err) console.log(err)
//   console.log(res)
// })

// Generate password reset token
// var crypto = require('crypto')
// crypto.randomBytes(20, function (err, buf) {
//   var token = buf.toString('hex')
//   var expiry = Date.now() + 3600000
//   token += '_'+expiry
//   console.log('token: ' + token)
// })

// Email
// var email = require('./lib/email')
// var test = 'test data'
// var emailData = {
//   from: 'test@mail.com',
//   to: 'go4chacko@gmail.com',
//   data: '<h3>Hello Email</h3>',
//   text: 'Hello Email'
// }

// email.sendEmail(emailData, true, function (err, status) {
//   if (err) console.log(err)
//   if (status) console.log('Email Send sucessfuly')
//   console.log(test)
// })

// Sequelize Update example
// var User = require('./models/orm/User')
// User.findOne({
//   where: {
//     user_id: 17
//   }
// }).then(function (userObj) {
//   //userObj.last_name = 'paul'
//   userObj.update({ last_name: 'paul'})
//   console.log(userObj.last_name)
// })

// Encrypt all user passwords
// var config = require('./lib/config')
// var User = require('./models/orm/User')
// var bcrypt = require('bcrypt')
// User.findAll().then(function (users) {
//   users.forEach(function (userObj) {
//     bcrypt.hash(userObj.password, config.passwordSaltRounds, function (err, hash) {
//       if (err) console.log(err)
//       console.log(userObj.first_name + 'orginal Pass:' + userObj.password + 'new hash:' + hash )
//       userObj.update({
//         password: hash
//       })
//     })
//   })
// })

// Date Formatting
// let datetime = require('node-datetime')
// let expiryTime = datetime.create('07/20/1989')
// var fomratted = expiryTime.format('m/d/Y H:M:S')
// console.log(fomratted)

// Logging
var logger = require('./lib/logger')
logger.debug("Overriding 'Express' logger")
app.use(require('morgan')('combined', { 'stream': logger.stream }))



// Starting the server
app.listen(port, function () {
  console.log('ACL example listening on port ' + port)
})
