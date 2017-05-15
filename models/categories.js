


exports.list = function(req, res){

  console.log('Categories List....');

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM domain',function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
  
            res.render('categories/view',{page_title:"Categories - Node.js",data:rows});
                
           
         });

    });
  
};

exports.add = function(req, res){

    console.log('Add Categories  Page...');

    res.render('categories/add',{page_title:"Add Categories - Node.js"});
};


/*Save the customer*/
exports.save = function(req,res){

    console.log(req.body);
    console.log('Save Categories to DB...');

    var input = JSON.parse(JSON.stringify(req.body));

    req.getConnection(function (err, connection) {
        
        var data = {
            domain      : input.category_name,
            description : input.description
        };
        
        var query = connection.query("INSERT INTO domain set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );

        //  res.render('customers/view',{page_title:"Customers - Node.js",data:rows});
         console.log('success');
         res.redirect('/');
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};

exports.edit = function(req, res){

    console.log('Edit Category  Page...');

    var id = req.params.domain_id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM domain WHERE domain_id = ?',[id],function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('categories/edit',{page_title:"Edit categories - Node.js",data:rows});
                
           
         });
         
         //console.log(query.sql);
    }); 
};

exports.save_edit = function(req,res){

    console.log(req.body);
    console.log('Save Edit Categories to DB...');

    var input = JSON.parse(JSON.stringify(req.body));
    var id    = req.params.domain_id;


    req.getConnection(function (err, connection) {
        
        var data = {
            domain      : input.category_name,
            description : input.description
        };
        
        var query = connection.query("UPDATE domain set ? WHERE domain_id = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );

        //  res.render('customers/view',{page_title:"Customers - Node.js",data:rows});
         console.log('success');
         res.redirect('/categories/view');
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};

exports.delete_category = function(req,res){
          
     var id = req.params.domain_id;
     console.log("Delete id = "+id);
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM domain  WHERE domain_id = ? ",[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/categories/view');
             
        });
        
     });
};