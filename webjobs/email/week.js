var request = require('request');
request('http://taggedytagtag.azurewebsites.net/email/day', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log("complete");
  }
})