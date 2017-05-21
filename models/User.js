/**
 * Public function findById
 *
 * To get user data by ID
 * 
 * @param  integer   id        User Id of the user
 * @param  function  callback  Passes user data to callers callback function
 * @return function  callback
 */
exports.findById = function(id, callback){
    process.nextTick(function(){
        var res = null;

        for (var i = 0; i < records.length; i++) {
            if ( records[i].id == id ) {
                res = records[i];
            }
        }

        if ( res !== null ) {
            callback(null, res);
        } else {
            callback('User with id ' + id + ' does not exist');
        }

        return callback;
    });
};

/**
 * Public function findByUsername
 *
 * To get user data by username
 * 
 * @param  string    username  User Id of the user
 * @param  function  callback  Passes user data to callers callback function
 * @return function  callback
 */
exports.findByUsername = function(username, callback){
    process.nextTick(function(){
        var res = null;

        for (var i = 0; i < records.length; i++) {
            if ( records[i].username == username ) {
                res = records[i];
            }
        }

        if ( res !== null ) {
            callback(null, res);
        } else {
            callback('Username ' + username + ' does not exist', false);
        }

        return callback;
    });
};