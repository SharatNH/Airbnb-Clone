"use strict";

var mq_client = require('../rpc/client');
var CronJob = require('cron').CronJob;
var dateTime = require('./DateTime');
var winston = require('winston');

var fs = require('fs');
var cronProperty = [];


var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)( { filename: './AirbnbMQ-Client/BiddingLogs/bidding.log', level: 'info', timestamp:false})
	]
});

var user_logger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)( { filename: './AirbnbMQ-Client/userTrackingLogs/userTacking.log', level: 'info', timestamp:false})
	]
});


var cDate = dateTime.getCurrentDateTime();

function onStartUp()
{
	var auctionEnteries = {"cDate":cDate};
	console.log("starting auctions");
	console.log(auctionEnteries);
	mq_client.make_request('getAuctionsToStart',auctionEnteries, function(err,results) {
		console.log("results");
		if(err)
		{
			console.err("An error Occured.");
		}
		else if(results.statusCode == 200)
		{
			console.log("1");
			var i = 0;
			for(i;i<results.property.length; i++)
			{
				startAuctions(results.property[i],function(statusCode){
				});
			}
			var logJob = new CronJob('0 * * * * *', auctionLogs , function() {console.log("Stopping bdidding logs!!");},true);
		}
		else
		{
			console.err("An error Occured.");
		}
	});
}


function startAuctions(entry,callback)
{
	var job = new CronJob(new Date(entry.end_time), function() {
			console.log("Property Auction Finished ");
			var completeAuction = {"auction_id":entry.auction_id,"transaction_date":dateTime.getCurrentDateTime()};

			mq_client.make_request('completeAuction',completeAuction, function(err,results) {
				if(err)
				{
					console.err("An error Occured.");
					//
				}
				else
				{
					var i =0;
					var toDelete;
					for(;i<cronProperty.length;i++)
					{
						if(cronProperty[i].cron == this)
						{
							cronProperty[i].cron.stop();
							toDelete = i;
							break;
						}
					}
					cronProperty.splice(toDelete,1);
					this.stop();
					console.log("Auction Completed");
				}
			});
		}, function () {
			console.log("Stopping cron!!");
		},
		true
	);

	logger.log('info', "Started auction for auction_id"+ entry.auction_id +"time: "+ new Date().toString());
	cronProperty.push({"cron":job,"property_id":entry.property_id,"auction_id":entry.auction_id});
	callback({"statusCode":200});
}

function terminateAuction(entry,callback)
{
	var i =0;
	var toDelete;
	console.log("in auction1");
	for(;i<cronProperty.length;i++)
	{
		if(cronProperty[i].cron == this)
		{
			cronProperty[i].cron.stop();
			toDelete = i;
			break;
		}
	}
	console.log("in auction2");
	cronProperty.splice(toDelete,1);
}

function auctionLogs(req,res)
{

	console.log("auctionLogs");
	var currentTime = {"cDate":dateTime.getCurrentDateTime()};
	console.log(currentTime);

	mq_client.make_request('auctionLogs',currentTime, function(err,results) {
		if(err)
		{
			console.log("1121212");
			console.log(err);
			throw err;
		}
		else if (results.statusCode == 200)
		{
			console.log("2");
			console.log("sdsdsdsdsd"+results.auction.length);
			results.auction.forEach(function(row){
				logger.log('info', "auction_id"+ row.auction_id +" max bid: " +row.bid_price +  " timestamp"+ new Date().toString());
			});
		}
	});
}

exports.startAuctions = startAuctions;
exports.terminateAuction = terminateAuction;
exports.onStartUp = onStartUp;
exports.user_logger=user_logger;