var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.DB_CONNECT;

router.get('/', function (req, res, next) {
    console.log(url)
    MongoClient.connect(url, function (err, db) {
        var collection = db.collection('tags');
        collection.find().toArray(function (err, items) {
            db.close();
            var data = formatItemsForList(items);
            console.log(items[0].name);
            res.render('listtags', { title: 'All tags', tags: data });
        });

    });

});

function formatItemsForList(items) {
    var obj = {}
    var len = items.length;
    for (var i = 0; i < len; i++) {
        var item = items[i];
        if (!obj[item.Product]) {
            obj[item.Product] = [];
        }
        obj[item.Product].push(item);
    }

    console.log(obj)

    return (obj);
}

router.get('/:tag', function (req, res, next) {
    var tag = req.params.tag;
    MongoClient.connect(url, function (err, db) {
        var collection = db.collection('tagdata');
        collection.find({ "MSFTTag": tag }).toArray(function (err, result) {
            db.close();
            res.render('listtagdetail', { title: tag, items: result });
        })
    });

});











module.exports = router;
