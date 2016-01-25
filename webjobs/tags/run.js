var request = require('request');
request('http://taggedytagtag.azurewebsites.net/email/tag', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log("complete");
  }
})