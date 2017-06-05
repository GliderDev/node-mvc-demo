var dateTime = require('node-datetime')

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
  var userId = req.user.user_id

  var now = dateTime.create()
  var nowDate = now.format('Y-m-d H:M:S')

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
    uploaded_on: nowDate,
    updated_on: nowDate,
    updated_by: userId,
    downloads: 0,
    rating: 0,
    status: 0,
    file_path: fileUpload.name,
    reference: JSON.stringify(req.body.refUser),
    projects: req.body.projRef
  }

  codebase.create(data).then(function (codeBaseData) {
    res.redirect('/')
  })
}

exports.getCodeBase = function (req, res, next) {
  let sequelize = req.app.locals.sequelize
  let html = ''

  sequelize.query('SELECT * FROM codebase as a JOIN  domain as b on a.domain_id = b.domain_id',
   { type: sequelize.QueryTypes.SELECT})
  .then(alldomain => {
    alldomain.forEach(function (codebaseResult) {
      html += '<li>' +
      '<a href="/codebase/view/' + codebaseResult.codebase_id + '" class="text">' +
      codebaseResult.name + '</span>' +
      '<small class="label label-success"><i class="fa fa-book"></i> ' +
      codebaseResult.domain + '</small>' +
      '</li>'
    })
    res.send(html)
  })
}

// TO DO
exports.edit = function (req, res, next) {
  let id = req.params.codebase_id
  let codebase = req.app.locals.Codebase

  codebase.findAll({
    where: {
      codebase_id: id
    }
  }).then(function (codeBaseResult) {
    res.render('codebase/edit', {
      data: codeBaseResult
    })
  })
}

exports.viewCodebase = function (req, res, next) {
  let id = req.params.codebase_id
  let sequelize = req.app.locals.sequelize
  let sqlQuery = 'SELECT *,cb.description ' +
  'FROM codebase AS cb ' +
  'JOIN  domain AS d ' +
  'ON cb.domain_id = d.domain_id ' +
  'WHERE codebase_id = :codebase_id'

  sequelize.query(sqlQuery,
   { replacements: { codebase_id: id }, type: sequelize.QueryTypes.SELECT})
  .then(alldomain => {
    alldomain.forEach(function (allDomainData) {
      res.render('codebase/view', {
        data: allDomainData,
        dateTime: dateTime
      })
    })
  })
}
