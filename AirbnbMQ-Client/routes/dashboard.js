var ejs=require("ejs");
var http=require("http");
var mq_client = require('../rpc/client');
var dateTime = require('./DateTime');
var userlogs;

exports.getdashboard=function (req,res) {


    try {

        console.log("inside getdashboard");

        //var hostid=req.session.hostid;
        var hostid=req.session.hostid;
        var userid=req.session.userid;

        userlogs={"page":"DashboardPage","user_id":req.session.userid,"activity":"Dashboard of the user","timestamp":Date.now()};

        console.log(hostid,userid);
        var msg_payload={
            hostid:hostid,
            userid:userid,
            userlogs:userlogs
        };
        mq_client.make_request('getdashboard_queue',msg_payload,function (err,response) {

            console.log(response);

            if(err)
            {
                throw err;
            }
            else
            {
                if(response.code==200)
                {
                    var data={
                        statusCode:200,
                        list:response.listing,
                        approvals:response.approvals
                    };
                    res.send(data);
                }
                else
                {
                    var data={
                        statusCode:404
                    };
                    res.send(data);
                }
            }

        });

    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }



};

exports.hostapprove=function(req,res){



    try {

        var bid=req.param("bid");
        var uid=req.param("uid");
        console.log("uid"+uid);
        var tp=req.param("tp");
        var pid=req.param("pid");
        var sd=req.param("sd");
        var ed=req.param("ed");
        //var uid=req.param("uid");

        //var uid=req.param("uid");

        var tdate=dateTime.getCurrentDateTime();


        userlogs={"page":"DashboardPage","user_id":req.session.userid,"activity":"Host approve","timestamp":Date.now()};

        var msg_payload={
            "bid":bid,
            "transaction_date":tdate,
            "bid":bid,
            "uid":uid,
            "tp":tp,
            "pid":pid,
            "sd":sd,
            "ed":ed,
            userlogs:userlogs

        };

        console.log(msg_payload);
        mq_client.make_request('hostapprove_queue',msg_payload,function(err,results){

            console.log(results);


            if(err)
            {
                console.err("An error Occured loading booking.");
                res.send({"statusCode":404});
            }
            else if(results.statusCode == 200)
            {
                res.send({"statusCode":200});
            }
            else
            {
                res.send({"statusCode":404});
            }


        });




    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }



};

exports.hostdisapprove=function(req,res){



    try {

        var bid=req.param("bid");
        var uid=req.param("uid");
        console.log("uid"+uid);
        var tp=req.param("tp");
        var pid=req.param("pid");
        var sd=req.param("sd");
        var ed=req.param("ed");
        //var uid=req.param("uid");


        userlogs={"page":"DashboardPage","user_id":req.session.userid,"activity":"Host Disapprove","timestamp":Date.now()};

        var msg_payload={
            "bid":bid,
            userlogs:userlogs


        };

        console.log(msg_payload);
        mq_client.make_request('hostdisapprove_queue',msg_payload,function(err,results){

            console.log(results);


            if(err)
            {
                console.err("An error Occured loading booking.");
                res.send({"statusCode":404});
            }
            else if(results.statusCode == 200)
            {
                res.send({"statusCode":200});
            }
            else
            {
                res.send({"statusCode":404});
            }


        });


    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }




};


exports.hideapprovals=function(req,res)
{


    try {

        console.log("inside hideapprovals");
        console.log(req.param("booking_id"));

        userlogs={"page":"DashboardPage","user_id":req.session.userid,"activity":"Hide approvals of user","timestamp":Date.now()};

        var msg_payload={
            booking_id:req.param("booking_id"),
            userid:req.session.userid,
            hostid:req.session.hostid,
            userlogs:userlogs
        };


        mq_client.make_request('hideapprovals_queue',msg_payload,function(err,response) {
            console.log(response);

            console.log(response);

            if (err) {
                throw err;
            }
            else {
                if (response.code == 200) {
                    var data = {
                        statusCode: 200,
                        list: response.listing,
                        approvals: response.approvals
                    };
                    res.send(data);
                }
                else {
                    var data = {
                        statusCode: 404
                    };
                    res.send(data);
                }
            }
        });


    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }


};