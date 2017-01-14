var ejs = require("ejs");
var mq_client = require('../rpc/client');
var dateTime = require('./DateTime');
var logger = require('./auction');
var moment = require('moment');

exports.property = function (req, res) {


    try {

        res.render('property.ejs',function(err, result) {
            // render on success
            if (!err) {
                res.end(result);
            }
            // render or error
            else {
                res.end('An error occurred');
                console.log(err);
            }
        });

    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }


}

exports.displayProperty = function (req, res) {

    try {
    //store product-id in session
        var id = req.param("property_id");
        var price = req.param("property_price");
        req.session.property_id = id;
        var property_click_json = {
            "page": "homePage", "user_id":req.session.userid,"activity": "clicked a property","property_id": id, "timestamp": new Date().toString()
        };

        var property_load_json = {
            "page": "propertyPage", "user_id":req.session.userid,"activity": "viewed a property","property_id": id, "timestamp": new Date().toString()
        };

        logger.user_logger.log('info', property_click_json);

    var msg_payload = { "property_click_json": property_click_json, "property_loaded": property_load_json,"property_id":req.session.property_id};

    console.log("In POST Request = property_id:"+ req.session.property_id);

    mq_client.make_request('logging_queue',msg_payload, function(err,results){

        console.log(results);
        if(err){
            throw err;
        }
        else
        {
            if(results.code == 200){
                console.log("logging");

                res.send({"statusCode":200});
            }
            else {

                console.log("Invalid property");
                res.send({"property":"Fail"});
            }
        }
    });

    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }

}

exports.display_property = function (req, res) {

    res.render("property.ejs");
}

exports.propertydetails = function(req,res)
{


    try {

        console.log("in propertydetails");
        // var msg_payload = { "property_id": req.session.property_id};
    // console.log("checkin"+req.session.checkin);
    var checkin  = getCurrentDateTime(req.session.checkin);
    var checkout  = getCurrentDateTime(req.session.checkout);
    // req.session.checkin = checkin;
    // req.session.checkout = checkout;
        var startDate = moment(checkin);
        var endDate = moment(checkout);
        var secondsDiff = endDate.diff(startDate, 'seconds');
        console.log(secondsDiff);
        var staydays = secondsDiff/60/60/24;
    console.log("checkouttttttttttt"+checkout);
    var msg_payload = { "property_id": req.session.property_id,"checkin":req.session.checkin,"checkout":req.session.checkout};

    console.log("In POST Request = property_id:"+ req.session.property_id);

        mq_client.make_request('property_queue',msg_payload, function(err,results){

            console.log(results);
            if(err){
                throw err;
            }
            else {
                if (results.code == 200) {
                    console.log("valid propertyyyyy");
                    console.log(results.value);
                    console.log("bid");
                    console.log(results.bid);
                    console.log(results.reviewsByUser);
                    var stayrent = results.value[0].price * staydays;
                    req.session.price = results.value[0].price;
                    var total = stayrent + 31;
                    req.session.total = total;
                    req.session.total = total;
                    req.session.stayrent = stayrent;
                    req.session.staydays = staydays;
                    res.send({
                        "statusCode": 200,
                        "property": results.value,
                        "stayrent": stayrent,
                        "bid": results.bid,
                        "reviews": results.reviewsByUser,
                        "checkin": checkin,
                        "checkout": checkout,
                        "guests": req.session.guests,
                        "staydays": staydays,
                        "total": total
                    });
                }
                else {
                    console.log(results);
                    if (err) {
                        throw err;
                    }
                    else {
                        if (results.code == 200) {
                            console.log("valid propertyyyyy");
                            console.log(results.value[0].title);
                            console.log("bid");
                            console.log(results.bid);
                            console.log(results.reviewsByUser);
                            var stayrent = results.value[0].price * staydays;


                            res.send({
                                "statusCode": 200,
                                "property": results.value,
                                "stayrent": stayrent,
                                "bid": results.bid,
                                "reviews": results.reviewsByUser,
                                "checkin": checkin,
                                "checkout": checkout,
                                "guests": req.session.guests,
                                "staydays": staydays,
                                "total": total
                            });
                        }
                        else {

                            console.log("Invalid property");
                            res.send({"property": "Fail"});
                        }
                    }
                }
            }
        });

    }

    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }

}

function getCurrentDateTime(check)
{
    var date = new Date(check);
    date = date.getFullYear() + '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' +
        ('00' + date.getHours()).slice(-2) + ':' +
        ('00' + date.getMinutes()).slice(-2) + ':' +
        ('00' + date.getSeconds()).slice(-2);
    return date;
}

exports.getCurrentDateTime=getCurrentDateTime;

exports.change = function(req,res)
{
    console.log("in change");
    console.log(req.param("month"));

    try {

        console.log("in change");

        var checkin=req.param("checkin");
        var checkout=req.param("checkout");
        var guests=req.param("guests");
        console.log(checkin);
        console.log(checkout);
        var checkin = getCurrentDateTime(checkin);
        var checkout = getCurrentDateTime(checkout);
        req.session.checkin = checkin;
        req.session.checkout = checkout;
        req.session.guests = guests;

        var msg_payload = { "property_id": req.session.property_id, "checkin":checkin,"checkout":checkout, "guests":guests};

        console.log("In POST Request = checkin,checkout,property_id:"+ req.session.property_id + checkout + checkin);

        mq_client.make_request('change_queue',msg_payload, function(err,results){

            console.log(results);
            if(err){
                throw err;
            }
            else
            {
                if(results.code == 200){
                    res.send({"statusCode":200});
                }
                else {

                    console.log("Invalid property");
                    res.send({"property":"Fail"});
                }
            }
        });


    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }

}

exports.details = function(req,res){


    try {

        console.log("in details");
        console.log(req.param("month"));
        console.log("1");
        var enumber =  req.param("number");
        var emonth =  req.param("month");
        var eyear =  req.param("year");
        var ecvv =  req.param("cvv");

        console.log("number entered " + enumber);

        console.log("expiry month " + emonth);
        console.log("expiry year " + eyear);
        console.log("cvv number " + ecvv);

        var len1=enumber.length;
        var len2=ecvv.length;

        var enteredDate = new Date(eyear+'-'+emonth);

        var today=new Date();
        var month=(today.getMonth()+1).toString();
        var year=(today.getFullYear()).toString();

        var str1=eyear+emonth;
        var str2=year+month;

        console.log(str1);
        console.log(str2);

        console.log("month" + month);
        console.log("year" + year);


        if(len1==16 && isNaN(enumber)==false){
            if(len2==3 && isNaN(enumber)==false){
                if(enteredDate>=today){

                    var msg_payload = { "user_id": req.session.userid, "price": req.session.price, "checkin":req.session.checkin,"checkout":req.session.checkout, "property_id":req.session.property_id};

                    console.log("In POST Request = che,property_id:"+ req.session.property_id);
                    console.log(msg_payload);
                    mq_client.make_request('booking_queue',msg_payload, function(err,results){

                        console.log(results);
                        if(err){
                            throw err;
                        }
                        else
                        {
                            if(results.code == 200){
                                res.send({"statusCode":200});
                            }
                            else {

                                console.log("Invalid property");
                                res.send({"property":"Fail"});
                            }
                        }
                    });



                    // res.send({"statusCode": 200});
                }
                else{
                    console.log("wrong place");
                    res.send({"title" : 'Please enter valid card number!'});
                }
            }
            else{
                res.send({"title" : 'Please enter valid cvv number!'});
            }
        }
        else{
            res.send({"title" : 'Please enter valid card number!'});
        }

    }
    catch(e)
    {
        console.log(e);
        res.send({statusCode:417,message:"Could not serve your request"});

    }


};


exports.payment = function(req, res){
    res.render('payment');
};

function make_bid(req,res)
{


    try {

        console.log("in make_bid function")
        // check user already exists
        var bid = req.param("bid");
        var user_id = req.session.userid;
        var bidder = req.session.fname+" " + req.session.lname;
        var property_id = req.session.property_id;
        console.log(property_id);
        var search_json = {
            "user_name":bidder, "amount": bid,"user_id":req.session.userid, "timestamp": new Date().toString()
        };
        // var biddinglogs =  {"user_id": user_id,"user_name":req.session.fname+" "+req.session.lname, "amount": bid, "property_id": property_id, "timestamp": new Date.toString()};
        var msg_payload = {"user_id": user_id, "property_id": property_id, "bid": bid, "date" : dateTime.getCurrentDateTime(),"biddinglogs":search_json};

        console.log("In POST Request to make a bid = user_id:"+ user_id);

        mq_client.make_request('bid_queue',msg_payload, function(err,results){

            console.log(results);
            if(err){
                throw err;
            }
            else
            {
                if(results.code == 200){
                    console.log("valid bid" + results.value);

                    res.send({"statusCode":200, "result": results.value});
                }
                else {

                    console.log("Invalid bid");
                    res.send({"make bid":"Fail"});
                }
            }
        });


    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }
}

exports.make_bid = make_bid;

function load(req,res)
{


    try {

        console.log("in payment load function")
        // check user already exists
        var user_id = req.session.userid;

        var checkin  = getCurrentDateTime(req.session.checkin);
        var checkout  = getCurrentDateTime(req.session.checkout);
        console.log("loadddddddddddd");
        console.log(checkin);
        console.log(checkout);
        var price = req.session.price;

        var msg_payload = { "user_id": user_id };

        console.log("In POST Request = user_id:"+ user_id);

        mq_client.make_request('load_queue',msg_payload, function(err,results){

            console.log(results);
            if(err){
                throw err;
            }
            else
            {
                if(results.code == 200){
                    console.log("valid Login");

                    res.send({"statusCode":200, "result": results.value,
                        "checkin": checkin,
                        "price" : price,
                        "checkout": checkout,
                        "guests": req.session.guests,
                        "staydays": req.session.staydays,
                        "stayrent": req.session.stayrent,
                        "total": req.session.total

                    });
                }
                else {

                    console.log("Invalid Login");
                    res.send({"login":"Fail"});
                }
            }
        });

    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }


}

exports.load=load;

function enter(req,res){

    try {

        var enumber =  req.param("number");
        var emonth =  req.param("month");
        var eyear =  req.param("year");
        var ecvv =  req.param("cvv");

        console.log("number entered " + enumber);

        console.log("expiry month " + emonth);
        console.log("expiry year " + eyear);
        console.log("cvv number " + ecvv);

        var len1=enumber.length;
        var len2=ecvv.length;

        var enteredDate = new Date(eyear+'-'+emonth);

        var today=new Date();
        var month=(today.getMonth()+1).toString();
        var year=(today.getFullYear()).toString();

        var str1=eyear+emonth;
        var str2=year+month;

        console.log(str1);
        console.log(str2);

        console.log("month" + month);
        console.log("year" + year);


        if(len1==16 && isNaN(enumber)==false){
            if(len2==3 && isNaN(enumber)==false){
                if(enteredDate>=today){
                    var msg_payload = { "user_id": req.session.user_id, "enumber": enumber , "emonth": emonth, "eyear": eyear };
                    console.log("in enter function");
                    console.log("In POST Request: Exp. month"+ emonth);

                    mq_client.make_request('add_queue',msg_payload, function(err,results){

                        console.log("Results for guest capacity :" + JSON.stringify(results));
                        if(err){
                            throw err;
                        }
                        else
                        {
                            if(results.code == 200){
                                console.log("price found");
                                res.send({"statusCode": 200});
                            }
                            else {

                                console.log("Invalid num of guests");
                                res.send({"statusCode": 300});
                            }
                        }
                    });
                }
                else{
                    res.send({"title" : 'Please enter valid card number!'});
                }
            }
            else{
                res.send({"title" : 'Please enter valid cvv number!'});
            }
        }
        else{
            res.send({"title" : 'Please enter valid card number!'});
        }



    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }


}

exports.enter=enter;


exports.editproperty=function(req,res)
{


    try {

        console.log("inside editproperty");
        var id = req.param("property_id");
        var sd=req.param("start_date");
        var ed=req.param("end_date");

        req.session.property_id = id;
        res.send({"statusCode":200});


    }
    catch(e)
    {

        res.send({statusCode:417,message:"Could not serve your request"});

    }


}