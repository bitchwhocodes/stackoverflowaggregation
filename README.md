# Stack Overflow Aggregation
Node Express app that aggregates Stack Overflow unanswered questions - dumps in mongo

## What this Application does
This app allows users to subscribe so that they can get the latest unanswered questions on Stack Overflow
searched by predefined tags. You could modify your search terms. 

It polls Stack overflow daily, which is triggered by a [Web Job in Azure](https://azure.microsoft.com/en-us/documentation/articles/web-sites-create-web-jobs/).

## Dependancies
This application includes the node modules, as it has MODIFIED the stackoverflow module to include 
the unanswered endpoint. It requires:
* MongoDB module
* SendGrid module
* Async module
* Stackoverflow module ( modified and NOT INCLUDED in the package.json)
* DotEnv for env variables

## What can be learned from here
* Potentially excessive and arguably bad use of the Async library for all the crazy async shit that is 
going on to poll the api repeatedly and then dump into the db.
* Rendering of Jade to html string for Email
* Example of using the Send Grid API for email
* Example of using $in operator in Mongo 

## APIS
You will need keys for:
* SendGrid API
* StackOverflow API

## ENV 
You will need to set environment variables for the DB connection, the api keys. 

 
