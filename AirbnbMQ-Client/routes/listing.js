var ejs=require("ejs");
var http=require("http");
var mq_client = require('../rpc/client');
var userlogs;

exports.createlisting=function(req,res){    //renders listing creation page


    try {

        console.log("create listing");
        var host_id=req.session.hostid;

    if(host_id!=undefined)
    {
        //render create listing page
        //2 rendering in this page
        ejs.renderFile('./AirbnbMQ-Client/views/listing_registration.ejs',function(err,results){

                if(err)
                {
                    throw err;
                }
                else
                {

                    console.log("no error");
                    res.end(results);
                }
            });

        }
        else{
            //no host id so pop up another page

            ejs.renderFile('./AirbnbMQ-Client/views/host_request_form.ejs',function(err,results){

                if(err)
                {
                    throw err;
                }
                else
                {
                    console.log("no error");
                    res.end(results);
                }
            });

        }


    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }




};


exports.getlisting=function(req,res){                   //inside user dashboard


    try {

        console.log("inside get listing");

        var userid=req.session.userid;
        //var hostid=req.session.hostid;
        var hostid=req.session.hostid;
        console.log(userid,hostid);



        userlogs={"page":"DashboardPage","user_id":req.session.userid,"activity":"fetch user listing user","timestamp":Date.now()};

        if(hostid!=undefined) {
            var msg_payload = {
                userid: userid,
                hostid: hostid,
                userlogs:userlogs
            };

            mq_client.make_request('getlisting_queue', msg_payload, function (err, results) {

                if (err) {
                    console.log(err);
                    var data={
                        statusCode:404
                    };
                    res.send(data);
                }
                else {
                    console.log(results);
                    if (results.list && results.count) {
                        var data = {
                            statusCode:200,
                            host:true,
                            isempty: false,           //to say list exists
                            listing: results.listing
                        };
                        res.send(data);
                    }
                    else
                    {
                        var data={
                            statusCode:200,
                            host:true,
                            isempty:true
                        };
                        res.send(data);
                    }

                }
            });
        }
        else {
            var data = {

                host: false

            };
            res.send(data);
        }


    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }


};