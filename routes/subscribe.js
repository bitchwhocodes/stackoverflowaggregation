var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.DB_CONNECT;

var times =[
    {
        "value":"9AM",
        "name":"9:00 AM"
    },
    
    {
        "value":"12PM",
        "name":"12:00 PM"
    },
    
    {
        "value":"5pm",
        "name":"5:00 PM"
    },
    {
        "value":"9PM",
        "name":"9:00 PM"
    },
]

var timezones=[
    {
        "value":"EST",
        "name":"EST"
    },
    
    {
        "value":"MTN",
        "name":"MTN"
    },
    
    {
        "value":"PST",
        "name":"PST"
    },
    
    
]



/* GET home page. */
// this should take the user and subscribe
router.get('/', function(req, res, next) {
    console.log(url)
    MongoClient.connect(url, function(err, db) {
        var collection = db.collection('tags');
        collection.find().toArray(function (err, items) {
            db.close(); 
            var data = formatItemsForList(items);
            console.log(items[0].name);
            console.log(times);
            
            res.render('subscribe', { title: 'Subscribe',tags:data,times:times,zones:timezones}); 
        });
  
    });
    
});

function formatItemsForList(items)
{
    var obj ={}
    var len=items.length;
    for(var i=0;i<len;i++)
    {
        var item = items[i];
        if(!obj[item.Product])
        {
            obj[item.Product]=[];
        }
        obj[item.Product].push(item);
    }
    
    console.log(obj)
    
    return(obj);
}

router.post('/', function(req, res, next) {
     // Get our form values. These rely on the "name" attributes

       MongoClient.connect(url, function(err, db) {
        var collection = db.collection('users');
        req.body.isActive = true;//set user to be active
        collection.update({"useremail":req.body.useremail},req.body,{upsert:true},function(err,result){
           db.close();
           res.render('subscribecomplete', { title: 'Consider Yerself Subscribed' });
        })
     
    });
});







module.exports = router;
