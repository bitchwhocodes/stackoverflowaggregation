var express = require('express');
var router = express.Router();
var utilities = require('./shared/utilities');

var async = require("async");

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.DB_CONNECT;



router.get('/', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        var collection = db.collection('users');
        collection.find({ 'isActive': true }).toArray(function (err, result) {
            db.close();
            res.render('userlist', { title: 'All Subscribed Users', userlist: result });
        });
    });
});


router.get('/:user', function (req, res) {
    var user = req.params.user;
    var tags = [];
    MongoClient.connect(url, function (err, db) {
        console.log(err)
        async.waterfall([
            function (callback) {
                var collection = db.collection('users');
                collection.find({ 'useremail': user }).toArray(callback);
            },
            function (result,callback) {
                var collection = db.collection('tagdata');
                tags = result[0].tags;
                collection.find({ "MSFTTag": { $in : tags} }).toArray(callback);
            },
            function(result,callback)
            {
                console.log("here is the data"+result)
                var data = utilities.formatData(result);
                res.render("user",{email:user,tags:tags,data:data});
                callback();
            }
        ]
            , function (err) {
              console.log("err")
                
            })
    });

});

module.exports = router;
