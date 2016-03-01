/**************
 * Author: David Hijirida (hijiridd)
 * course: cs290 Web Dev
 * Assignment: wk9 Database Interactions with UI
 * Due Date: 3/13/2016
 *************/

 /*** Requirements ***
You need to create a single page application with the following functionality:
Visiting the page will show a table displaying all completed exercises. 
The header should list all the columns (id should not be displayed in the 
header or in the table itself. Use hidden inputs to keep track of the id).

At the top of the page there should be a form that lets you enter in all the 
data needed to make a new entry in the table with a button to submit it. 
Hitting that button should add the row to the table if it was successfully 
added to the database. 
If it was not successfully added (probably because name was left blank and it 
is required) it should not add it to the table.

Each row should have two buttons. One to delete the row and one to edit the row.
Hitting the delete button should immediately remove the row from the table and 
from the database.

Hitting the edit button should make it possible to edit the data. 
For this function it is OK to go to another page which will allow you to edit 
that specific exercise, save it and then take you back to the main page. 
The form to edit the exercise should be pre-populated with the existing data 
from that row (in other words if I go to the edit page, and then hit save, 
nothing should change because all the old values were in the edit form).

All interactions, other than updating an exercise, should happen via Ajax. 
This means that at no time should the page refresh. 
Instead Ajax calls should be used to GET or POST to the server and it should 
use the data the server provides to update the page.
 *** END REQUIREMENTS ***/

// ************************
// Section to  import all required packages
// *************************

// use express modules to make it easy to handle input/output
var express = require('express');
var app = express();

// set the port for this application to 3002
app.set("port", 3002);

// session package to track user session
var session = require ('express-session');
app.use(session({secret:'someSecretPasswrod'}));

// request library to make http requests
var request = require('request');

// check for static files (e.g., .css .js files) in public directory 
app.use(express.static('public'));

// import my credentials.js module to use credentials.owmKey for openweathermap key
// allows us to hide/replace key from primary javascript
// TODO: Q: how do you take key out of credentials.js module and avoid exposing on github
var credentials = require('./credentials.js');

// *************************
// start listening on port 3002
// *************************
app.listen (app.get('port'), function() {
  console.log ("app started on http://localhost:"+app.get('port')+" ctrl-C to terminate");
});

// *************************
// GET handler
// *************************
app.get ('/', getHandlerFunction);

// FOR MY EDUCATION: May also define as var getHandlerFunction = function(){...}
// but doesn't "hoist" the definition up if used earlier in the script. It's
// also more flexible to re-assign it different functions in the future.
// I'm using function getHandler(){...} so it's evaluated before code is run.

function getHandlerFunction (req, res, next) {
  var context = {};
  console.log("inside the getHandler Function");
  // other stuff here...
};
 
// *************************
// POST handler
// *************************
/*
app.post('/', postHandlerFunction);

var postHandlerFunction = function (req, res) {
  var context = {};
  // other stuff here...
}
*/