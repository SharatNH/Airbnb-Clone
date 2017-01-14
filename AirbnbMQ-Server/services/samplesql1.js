var mysql = require('mysql');


con=mysql.createConnection({
    host:'localhost',
    user : 'root',
    password:'USAdream$123',
    database:'admin'
});

exports.exec=function (query,params,callback) {

    console.log("Airbnb nahi aana chahiye!")
    con.query(query,params, function (err, rows, fields){
        if(!err){
            console.log("Rows returned as "+rows);
            callback(err,rows);
        }
        else{
            console.log('MYSQL error encountered as :'+err);
            callback(err,rows);
        }
    })

}