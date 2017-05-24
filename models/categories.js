
// Categories list functionality

exports.list = function (req, res) {
  console.log('Categories List....')

  req.getConnection(function (err, connection) {
    connection.query('SELECT * FROM domain', function (err, rows) {
      if (err) {
        console.log('Error Selecting : %s ', err)
      }
      res.render('categories/view', { page_title: 'Categories - Node.js', data: rows })
    })
  })
}

// Categories Add functionality

exports.add = function (req, res) {
  console.log('Add Categories  Page...')
  var title = req.user.first_name
  var profilePic = req.user.profile_pic

  res.render('categories/add', {
    title: title,
    userPic: profilePic,
    href: 'logout'

  })
}

// Categories save functionality

exports.save = function (req, res) {
  console.log(req.body)
  console.log('Save Categories to DB...')

  var input = JSON.parse(JSON.stringify(req.body))

  req.getConnection(function (err, connection) {
    var data = {
      domain: input.category_name,
      description: input.description
    }

    var query = connection.query('INSERT INTO domain set ? ', data, function (err, rows) {
      if (err) { console.log('Error inserting : %s ', err) }

      console.log('success')
      res.redirect('/')
    })
  })
}

// Categories save functionality

exports.edit = function (req, res) {
  console.log('Edit Category  Page...')

  var id = req.params.domain_id

  req.getConnection(function (err, connection) {
    var query = connection.query('SELECT * FROM domain WHERE domain_id = ?', [id], function (err, rows) {
      if (err) { console.log('Error Selecting : %s ', err) }

      res.render('categories/edit', { page_title: 'Edit categories - Node.js', data: rows })
    })
  })
}

// Categories save and edit functionality

exports.save_edit = function (req, res) {
  console.log('Save Edit Categories to DB...')

  var input = JSON.parse(JSON.stringify(req.body))
  var id = req.params.domain_id

  req.getConnection(function (err, connection) {
    var data = {
      domain: input.category_name,
      description: input.description
    }

    var query = connection.query('UPDATE domain set ? WHERE domain_id = ? ', [data, id], function (err, rows) {
      if (err) { console.log('Error inserting : %s ', err) }

      console.log('success')
      res.redirect('/categories/view')
    })
  })
}

// Categories delete functionality

exports.delete_category = function (req, res) {
  var id = req.params.domain_id

  console.log('Delete id = ' + id)

  req.getConnection(function (err, connection) {
    connection.query('DELETE FROM domain  WHERE domain_id = ? ', [id], function (err, rows) {
      if (err) { console.log('Error deleting : %s ', err) }

      res.redirect('/categories/view')
    })
  })
}

exports.create_category = function (req, res, next) {
  let domain = req.app.locals.Domain
  domain.findAll({
    attribute: 'domain'
  }).then(function (result) {
    if (result) {
      let html = generateOptions(result)
      res.render('categories/create', {
        href: 'logout',
        title: 'ytets',
        html: html
      })
    } else {
      req.app.locals.logger.error('Domain is empty')
      next()
    }
  })
}

exports.save_category = function (req, res) {
  console.log(req.body)

  req.getConnection(function (err, connection) {
    var data = {
      domain: req.body.title,
      description: req.body.description
    }

    req.app.locals.Domain.create(data).then(function (domainData) {
      console.log(domainData)

      let domain = req.app.locals.Domain
      domain.findAll({
        attribute: 'domain'
      }).then(function (allDomain) {
        let allDomainHtml = '<option class="cat_default" value="">' +
          '--Select category--</option>' +
          generateOptions(allDomain) + 
          '<option class="cat_new" value="createNew">' +
          '--Create new--</option>'

        res.json({error: false,
          data: {
            id: domainData.domain_id,
            html: allDomainHtml
          }})
      })
    })
  })
}

function generateOptions (optionData) {
  let html = ''

  if (optionData.length) {
    optionData.forEach(function (element) {
      html += '<option ' +
      'class="cat_' + element.domain_id + '"' +
      ' value=' + element.domain_id + '>' +
      element.domain + '</option>'
    })
  } else if (typeof (optionData) === 'object') {
    html += '<option ' +
      'class="cat_' + optionData.domain_id + '"' +
      ' value=' + optionData.domain_id + '>' +
      optionData.domain + '</option>'
  }

  return html
}
