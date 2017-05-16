
var dateTime = require('node-datetime');


// Customers list functionality

exports.list = function(req, res){

  console.log('Customer List...');

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM user',function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
  
            res.render('customers/view',{page_title:"Customers - Node.js",data:rows, dateTime:dateTime});
                
           
         });

    });
  
};


// Customers add functionality

exports.add = function(req, res){

    console.log('Add Customer  Page...');

    res.render('customers/add',{page_title:"Add Customers - Node.js"});
};


// Customers list functionality

exports.edit = function(req, res){

    console.log('Edit Customer  Page...');

    var id = req.params.user_id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM user WHERE user_id = ?',[id],function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('customers/edit',{page_title:"Edit Customers - Node.js",data:rows, dateTime:dateTime});
                
           
         });
    }); 
};


// Customers save functionality

exports.save = function(req,res){
 
    console.log('Save Customer to DB...');

    var input      = JSON.parse(JSON.stringify(req.body));
    var sampleFile = req.files.uploads;

    var now        = dateTime.create();
    var nowDate    = now.format('Y-m-d');

    var birthdate  = dateTime.create(input.dob);
    var dobformat  = birthdate.format('Y-m-d');

    req.getConnection(function (err, connection) {
        
        var data = {
            
            first_name           : input.f_name,
            last_name            : input.l_name,
            email                : input.email,
            password             : input.password,
            password_reset_token : '',
            dob                  : dobformat,
            phone                : input.phone,
            emp_code             : input.empcode,
            doj                  : nowDate,
            status               : 1,
            auth_key             : '',
            profile_pic          : sampleFile.name
        };

          sampleFile.mv('public/uploads/', function(err) {
            if (err)
              console.log('error '+err)
            else         
              console.log('Uploaded...');
          });


        var query = connection.query("INSERT INTO user set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );

         res.redirect('/customers/view');
          
        });
    
    });
};



// Customers edit and save functionality

exports.save_edit = function(req,res){
    
    var input     = JSON.parse(JSON.stringify(req.body));
    var id        = req.params.user_id;
    
    var dob       = dateTime.create(input.dob);
    var dobformat = dob.format('Y-m-d'); 

    var now       = dateTime.create();
    var nowDate   = now.format('Y-m-d');

    req.getConnection(function (err, connection) {
        
        var data = {
            
            first_name           : input.f_name,
            last_name            : input.l_name,
            email                : input.email,
            password             : input.password,
            password_reset_token : '',
            dob                  : dobformat,
            phone                : input.phone,
            emp_code             : input.empcode,
            doj                  : nowDate,
            status               : 1,
            auth_key             : '',
            profile_pic          : input.uploads        
        };
        
        connection.query("UPDATE user set ? WHERE user_id = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/customers/view');
          
        });
    
    });
};



// Customers delete functionality

exports.delete_customer = function(req,res){
          
     var id = req.params.user_id;

     console.log("Delete id = "+id);

     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM user  WHERE user_id = ? ",[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/customers/view');
             
        });
        
     });
};


