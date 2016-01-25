var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.DB_CONNECT;





router.get('/', function(req, res, next) {
    var useremail = (req.query.useremail) ? req.query.useremail : "";
    res.render('unsubscribe', { title: 'Unsubscribe YerSelf',useremail:useremail });
});

router.post('/', function(req, res, next) {
    console.log(req.body)
    MongoClient.connect(url, function(err, db) {
        console.log(err);
        console.log(db)
        var collection = db.collection('users');
        var useremail = req.body.useremail;
        
        collection.update({useremail:useremail}, {$set:{isActive:false}},function(err,result){
           db.close();
          res.render('index', { title: 'Unsubscribe Successful'});
        })
    });
    
});

module.exports = router;
