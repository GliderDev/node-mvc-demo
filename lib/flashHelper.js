/**
 * To get flash message of a given flash type
 *
 * @param  res    object  Response Object
 * @param  type   string  Flash Type
 * @return string message Flash Message
 */
var getFlash = function (res, type) {
  let message = ''
  let flashes = res.locals.flash

  flashes.forEach(function (flash) {
    if (flash.type === type) message = flash.message
  })

  return message
}

module.exports.getFlash = getFlash
