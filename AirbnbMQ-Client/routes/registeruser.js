var ejs=require("ejs");
var http=require("http");
var mq_client=require('../rpc/client');

exports.registeruser=function(req,res){



    try {

        userlogs={"page":"SignUpPage","user_id":req.session.userid,"activity":"user creation","timestamp":Date.now()};

        console.log("inside registeruser.js ");
        var firstname=req.param("firstname");
        var lastname=req.param("lastname");
        var email=req.param("email");
        var password=req.param("password");

        var msg_payload={
            "firstname":firstname,
            "lastname":lastname,
            "email":email,
            "password":password,
            "userlogs":userlogs
        };

        console.log(msg_payload);

        mq_client.make_request('registeruser_queue',msg_payload,function(err,results){

            if(err)
            {
                throw err;
            }
            else
            {
                console.log(results);
                if(results.code==200)
                {
                    json_response={"statusCode":200};
                    res.send(json_response);
                }
                else if(results.code==400)
                {
                    json_response={"statusCode":400};
                    res.send(json_response);
                }
                else
                {
                    json_response={"statusCode":400};
                    res.send(json_response);
                }
            }
        });

    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }



};

exports.adminrequest=function(req,res)
{



    try {

        console.log("inside admin request");

        var user_id=req.session.userid;

        userlogs={"page":"CreateListingPage","user_id":req.session.userid,"activity":"creating a listing","timestamp":Date.now()};

        var msg_payload={
            user_id:user_id,
            userlogs:userlogs

        };

        mq_client.make_request('makehost_queue',msg_payload,function(err,result){
            if(err)
            {
                console.log("1");
                json_response={statusCode:404};
                res.send(json_response);
            }
            else
            {
                console.log("2");
                json_response={statusCode:200};
                res.send(json_response);
            }
        })

    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }

};

exports.changepassword=function(req,res)
{


    try {

        console.log("inside changepassword");

        var user_id=req.session.userid;

        userlogs={"page":"DashboardPage","user_id":req.session.userid,"activity":"Update the user password","timestamp":Date.now()};

        console.log(req.param("password"));
        var msg_payload={
            user_id:user_id,
            password:req.param("password"),
            userlogs:userlogs
        };

        mq_client.make_request('password_queue',msg_payload,function(err,results){
            if(err)
            {
                console.log("1");
                json_response={statusCode:404};
                res.send(json_response);
            }
            else
            {
                console.log(results);
                console.log("2");
                json_response={statusCode:200};
                res.send(json_response);
            }
        })

    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }



};

exports.changeemail=function(req,res)
{


    try {

        console.log("inside email");

        var user_id=req.session.userid;
        var user=req.session.user;

        console.log(req.param("email"));

        var newemail=req.param("email");


        if(user==newemail)
        {
            console.log("inside equals");
           json_response={statusCode:400};

            res.send(json_response);
        }
        else
        {
            console.log("will call the queue");

            userlogs={"page":"DashboardPage","user_id":req.session.userid,"activity":"change user email","timestamp":Date.now()};

            var msg_payload={
                user_id:user_id,
                newemail:newemail,
                userlogs:userlogs
            };



            mq_client.make_request('email_queue',msg_payload,function(err,results){
                console.log(results);
                if(err)
                {
                    console.log("1");
                    json_response={statusCode:404};
                    res.send(json_response);
                }
                else if(results.code==200)
                {

                    console.log("2");
                    json_response={statusCode:200};
                    res.send(json_response);
                }
                else
                {
                    console.log(results);
                    console.log("2");
                    json_response={statusCode:400};
                    res.send(json_response);

                }
            })

        }




    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }



};