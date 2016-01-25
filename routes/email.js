var express = require('express');
var router = express.Router()
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.DB_CONNECT;
var sendgrid = require("sendgrid")(process.env.SENDGRID);

var async = require("async");
var jade = require('jade');

var hostname ='';
var utilities = require('./shared/utilities');

router.get('/:time', function (req, res, next) {
    var time = req.params.time;
    
    hostname = req.protocol + '://' + req.get('host');
    //Let's get the ball rollin, a rollin 
    async.waterfall([
        function (callback) {
            getUsers(time,callback);
        },
        function (items, callback) {
           doTagRetrieval(items,callback);
        }


    ], function (err) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ success: true,message:"Email has been sent" }));
    }
   )

});

router.get('/user/:email', function (req, res, next) {
    var email = req.params.email;
    
    hostname = req.protocol + '://' + req.get('host');
    //Let's get the ball rollin, a rollin 
    async.waterfall([
        function (callback) {
            getUser(email,callback);
        },
        function (items, callback) {
           doTagRetrieval(items,callback);
        }


    ], function (err) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ success: true ,message:"Email has been sent"}));
    }
   )

});

function doTagRetrieval(items, callback)
{
   
     async.forEachSeries(items, function (item, callback_s1) {
                //console.log(item);
                async.waterfall([
                    function (callback_s2) {
                        //console.log("get docs for user")
                        getDocumentsForUser(item, callback_s2);
                    },
                     function (userEmail, result, callback_s2) {
                        //console.log("send for user");
                        renderHTML(userEmail, result, callback_s2);
                    },
                    
                    function (userEmail, result, callback_s2) {
                        sendEmail(userEmail, result, callback_s2);
                    }
                ]
                    , function () {
                        //one process for one user is complete
                        callback_s1();
                    })
            },
                function () {
                    // entire process for all users are done at this point
                    callback(null);
                });
    
}

// need to determine todays date
// if its daily they get sent. 
// if its weekly we only email them if its been a week

function getUsers(time,callback) {
    MongoClient.connect(url, function (err, db) {
        var collection = db.collection('users');
        collection.find({ 'isActive': true,'email-pref':time }).toArray(callback);
    });
}

function getUser(email,callback) {
   
    MongoClient.connect(url, function (err, db) {
        var collection = db.collection('users');
        collection.find({ 'useremail':email }).toArray(callback);
    });
}

function getDocumentsForUser(results, callback) {
    var user = results;
    var userEmail = user.useremail;
    var tags = user.tags;
    
    MongoClient.connect(url, function (err, db) {
        var collection = db.collection('tagdata');
        collection.find({"MSFTTag": { $in : tags} }).toArray(function (err, result) {
            db.close();
            //console.log(result);
            callback(null, userEmail, result);
        })
    });
}

function renderHTML(userEmail,results,callback)
{
  var resultData = utilities.formatData(results); 
  var unsubscribeLink = hostname + "/unsubscribe?useremail=" + userEmail;
  var locals = {data:resultData,unsubscribe:unsubscribeLink,user:userEmail}
  var render = jade.compileFile('./views/email.jade');
  var html   = render(locals);
  callback(null,userEmail,html);

}



function sendEmail(userEmail, html, callback) {

    console.log("send email")
    var email = new sendgrid.Email();
    email.addTo(userEmail);
    email.setFrom("dothis@andgetweird.com");
    email.setSubject("[Stack Overflow] : Unanswered questions");
    email.setHtml(html);
    sendgrid.send(email);
    callback();
}






module.exports = router;
