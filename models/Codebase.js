// Add codebase functionality

exports.addCodeBase = function (req, res, next) {
  let domain = req.app.locals.Domain
  let users = req.app.locals.User

  domain.findAll({
    attribute: ['domain', 'domain_id', 'description', 'status'],
    order: [['domain_id', 'DESC']]
  }).then(function (result) {
    if (result) {
      var html = ''
      result.forEach(function (elementResult) {
        html += '<option ' +
        'class="cat_' + elementResult.domain_id + '"' +
        ' value=' + elementResult.domain_id + '>' +
        elementResult.domain + '</option>'
      })
    } else {
      html = ''
    }
    let userHtml = ''
    users.findAndCountAll({
      attribute: ['first_name']
    }).then(function (userResult) {
      userResult.rows.forEach(function (user) {
        userHtml += '<input id="check_user_' + user.user_id + '"' +
          'type="checkbox" name="refUser"' +
          'value="' + user.user_id +
          '" />' + user.first_name + '</br>'
      })
      console.log('html=' + html)
      res.render('codebase/add', {
        html: html,
        userHtml: userHtml,
        userCount: userResult.count
      })
    })
  })
}

exports.saveCodeBase = function (req, res, next) {
  let codebase = req.app.locals.Codebase
  let path = require('path')
  var fileUpload = req.files.uploads
  // console.log('post' + JSON.stringify(req.body))

  fileUpload.mv(path.join(__dirname, '/../public/uploads/attachment', fileUpload.name), function (err) {
    if (err) {
      next(new Error(err))
      req.app.locals.logger.error(err)
    }
  })

  let data = {
    name: req.body.title,
    description: req.body.description,
    domain_id: req.body.category_list,
    author_id: req.user.user_id,
    uploaded_on: '',
    updated_on: '',
    updated_by: '',
    downloads: 0,
    rating: 0,
    status: 0,
    file_path: fileUpload.name,
    reference: JSON.stringify(req.body.refUser),
    projects: req.body.projRef
  }

  codebase.create(data).then(function (codeBaseData) {
    console.log('createddata' + codeBaseData)
    res.redirect('/')
  })
}
