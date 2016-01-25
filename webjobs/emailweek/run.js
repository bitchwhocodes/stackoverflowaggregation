var request = require('request');
request('http://taggedytagtag.azurewebsites.net/email/week', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log("complete");
  }
})