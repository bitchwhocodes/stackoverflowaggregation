var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.DB_CONNECT;
console.log(url);
// This includes a modified node module of stackexhcange to add functionality
var stackexchange = require('stackexchange');


var async = require("async");
 
var options = { version: 2.2 };
var context = new stackexchange(options);


var hasMore = false;
var product='';

var now = new Date();
var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
var timestamp = startOfDay / 1000;
var today = new Date();
var yesterday = new Date();
yesterday.setDate(today.getDate()-2);
var count = 0;

var filter = {
        key:process.env.STACKOVERFLOW,
        pagesize: 100,
        page:1,
        tagged: '',
        sort: 'activity',
        order: 'desc',
        min:timestamp
      };
      
      
function start(res){
    async.waterfall([
        function(cb){
           MongoClient.connect(url, function(err, db) {
            var collection = db.collection('tags');
            collection.find().toArray(function(err, items) {
                db.close(); 
                cb(null,items);
            });
          });  
        },
        getAllTags
    ],function(){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ success: true }));
    })
}

function getAllTags(tags,cb)
{
    async.forEachSeries(tags, function(tag, callback_s1) {
        console.log("this tag"+tag.Tag);
        filter.tagged = tag.Tag;
        product = tag.Product;
        console.log(tag);
        filter.page = 1;
        getTag(callback_s1);
    },
    function(){
        console.log("this is complete all of them")
        cb();
        
    });   
} 

function getTag(callback_s1) {
    async.waterfall([
        function(callback) { 
            getNextSet(callback); },        
        function(err,results, callback) { 
            handleTagResult(err,results,callback);
        }
    ], function(){
        if(hasMore)
        {
            getTag(callback_s1);
        }else{
            callback_s1();
        }
    });
}


function getAllResultsForTag(tag,callback){
  filter.tagged = tag;
  getNextSet(callback);
}

function getNextSet(callback){
   context.questions.unanswered(filter,callback);
   filter.page++;
}

function handleTagResult(results,callback)
{
    hasMore = results.has_more;
    console.log(hasMore+" has more?");
    console.log("has items?"+results.items);
    var items = results.items;
    if(!items.length){
        callback();
        return;
    }
    
   MongoClient.connect(url,function(err,db){
    
     var collection = db.collection("tagdata");
      async.forEach(items, function(document, cb) {
          document.tags.push(filter.tagged);
          document.MSFTProduct = product;
          document.MSFTTag = filter.tagged;

           async.waterfall([
            function(cb2){
                 collection.find({"question_id":document.question_id}).toArray(cb2)
            },
            function(result,cb2)
            {
                
                if(!result.length){
                    console.log("insert into db")
                    collection.insert(document,cb2);
                }else{
                    console.log("update")
                    collection.update({"question_id":document.question_id},
                        document,{upsert:true},cb);
                }
            }
        ],
        function(err){
            cb();
            
        })
       },function(err){
        db.close();
        callback();
    });
   });
}


    
router.get('/', function(req, res, next) {
     start(res);
});


module.exports = router;
