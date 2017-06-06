/**
 * Email module used to sent email
 *
 * Usage example:
 * var email = require('./lib/email')
 * var emailData = {
 *   from: 'sender@mail.com',
 *   to: 'receiver@mail.com',
 *   subject: 'hi'
 *   data: '<h3>Hello Email</h3>',
 *   text: 'Hello Email'
 * }
 * email.sendEmail(emailData, true, function (err, status) {
 *   if (err) console.log(err)
 *   if (status) console.log('Email Send successfully')
 * })
 *
 * Docs: https://nodemailer.com/about/
 */
const config = require('./config')
const nodemailer = require('nodemailer')

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(config.emailConfig)

/**
 * Function sets mail options and send email
 *
 * @param {object} emailData
 */
var sendEmail = function (emailData, text = false, emailCallback) {
  let error = false
  let emailContent = ''
  let mailOptions

  if (emailData.from === '') {
    error = true
    return emailCallback(new Error("Email 'from' is empty"), false)
  }

  if (emailData.to === '') {
    error = true
    return emailCallback(new Error("Email 'to' data is empty"), false)
  }

  if (emailData.subject === '') {
    error = true
    return emailCallback(new Error("Email 'subject' data is empty"), false)
  }

  if (text && emailData.text === '') {
    error = true
    return emailCallback(new Error("Email 'text' data is empty"), false)
  }

  if (emailData.data !== '') emailContent = emailData.data

  if (!error) {
    mailOptions = {
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      text: '',
      html: emailContent
    }

    if (text) {
      mailOptions.text = emailData.text
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return emailCallback(error, false)
      }
      // console.log('Message %s sent: %s', info.messageId, info.response)
      return emailCallback(null, true)
    })
  }
}

module.exports.sendEmail = sendEmail
