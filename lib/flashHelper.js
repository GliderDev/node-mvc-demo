/**
 * To get flash message of a given flash type
 *
 * @param  res    object  Response Object
 * @param  type   string  Flash Type
 * @return string message Flash Message
 */
var getFlash = function (flashObj, flashType) {
  let message = ''

  if (typeof (flashObj) === 'object' && flashObj.hasOwnProperty(flashType)) {
    message = flashObj[flashType][0]
  }

  return message
}

module.exports.getFlash = getFlash
