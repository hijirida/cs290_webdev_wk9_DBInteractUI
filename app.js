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

// use handlebars module to serve templated html
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine ('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// set the port for this application to 3002
app.set("port", 3002);

// session package to track user session
var session = require ('express-session');
app.use(session({secret:'someSecretPasswrod'}));

// request library to make http requests
var request = require('request');

// body parser to grab POST parameters
var bodyParser = require ('body-parser');
// this is the middleware to parse the post data of the body
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

// use mysql module to interact with sql database
var mysql = require('mysql');
var pool = mysql.createPool({
  host: 'localhost',
  user: 'student',
  password: 'default',
  database: 'student',
  dateStrings: 'true'
});

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
  console.log("id = "+req.param('id')+" delete = "+req.param('delete')+
              " edit = "+req.param('edit'));
  
  if (req.param('delete')=="yes") { // is this an incoming delete request?
    //then do this
    console.log ("inside delete = yes");
    var createString = "DELETE FROM workouts WHERE id = "+req.param('id');
    pool.query(createString, function (err, result) {
      if (err) throw (err);
      console.log(result);    
    });
    res.send("Delete completed");
 
  } else if (req.param('edit')=="yes") { // is this an incoming edit request?
    console.log ("inside edit = yes");
    var createString = "SELECT * FROM workouts WHERE id = "+req.param('id');
    pool.query(createString, function (err, result) {
      if (err) throw (err);
      console.log(result);
      var context = {};
      context.dataList = result; 
      console.log("context.dataList = "+context.dataList);   
      res.render('editWorkout', context);
    });

  } else {
    console.log ("this is a regular home request");
    var createString = "Select * FROM workouts";
    pool.query(createString, function (err, result) {
      if (err) throw err;
      console.log(result);
      //res.send('Added to database with ID: ' + result.insertId);
      var context = {};
      context.dataList = result;
      res.render('home', context);  // this looks inside views for home.handlebars
    });
  }
};

app.get ('/editworkout', getEditHandlerFunction);

// This is for the /editworkout page
function getEditHandlerFunction (req, res, next) {
 // var context = {};
  console.log("inside the GET EDIT Handler Function");
  var createString = "SELECT * FROM workouts WHERE id = "+req.param('id');
  pool.query(createString, function (err, result) {
      if (err) throw (err);
      console.log(result);
      var context = {};
      context.dataList = result; 
      console.log("context.dataList = "+context.dataList);   
      res.render('editWorkout', context);
    });
  //res.send("done");
} 

// *************************
// POST handler
// *************************

app.post('/', postHandlerFunction);

function postHandlerFunction (req, res) {
  console.log("Someone is calling me with POST");
  console.log ("req.body = "+JSON.stringify(req.body));
  console.log ("req.body.name = "+JSON.stringify(req.body.name));
  var isLBS = (req.body.wtChoice == "lbs");
  if (req.body.reps == "") req.body.reps="NULL";
  if (req.body.weight == "") req.body.weight="NULL";
  if (req.body.date == "") {
   formatDate="NULL";
  } else {
    formatDate="'"+req.body.date+"'";
  }
  console.log("format date = "+formatDate);  
  var createString = 'INSERT INTO workouts(name, reps, weight, date, lbs) VALUES ("'+  
                    req.body.name+'", '+
                    req.body.reps+', '+
                    req.body.weight+', '+
                    //'"'+req.body.date+'", '+
                    formatDate+', '+
                    isLBS+')';
  console.log ("createString = "+createString);
  /*var createString = "INSERT INTO workouts(name, reps, weight, date, lbs) VALUES ("+  
                    req.body.name+", "+
                    "2, "+
                    //req.body.reps+", "+
                    "2, "+
                    //req.body.weight+", "+
                    "2016-01-01, "+
                    req.body.date+", "+
                    "2, "+
                    //req.body.lbs+")";
  */
  pool.query(createString, function (err, result) {
            if (err) throw err;
            //res.send('Added to database with ID: ' + result.insertId);
        });
  res.send("Added a new row");
}


app.post ('/editworkout', postEditHandlerFunction);

// This is for the /editworkout page
function postEditHandlerFunction (req, res, next) {
 // var context = {};
  console.log("inside the POST EDIT Handler Function");
  console.log ("req.body = "+JSON.stringify(req.body));
  console.log ("req.body.name = "+JSON.stringify(req.body.name));
  var isLBS = (req.body.wtChoice == "lbs");
  if (req.body.reps == "") req.body.reps="NULL";
  if (req.body.weight == "") req.body.weight="NULL";
  if (req.body.date == "") {
   formatDate="NULL";
  } else {
    formatDate="'"+req.body.date+"'";
  }
  console.log("format date = "+formatDate);  
  var createString = 'UPDATE workouts SET '+
                    'name='+'"'+req.body.name+'", '+
                    'reps='+req.body.reps+', '+
                    'weight='+req.body.weight+', '+
                    'date='+formatDate+', '+
                    'lbs='+isLBS+
                    ' WHERE id='+req.body.id;
  console.log ("createString = "+createString);
  pool.query(createString, function (err, result) {
            if (err) throw err;
            //res.send('Added to database with ID: ' + result.insertId);
            console.log(result);
        });
  res.send("UPDATED a new row");
} 


function deleteRow(tableID,currentRow) {
  console.log("Inside deletRow function");
}

/*    try {
        var table = document.getElementById(tableID);
        var rowCount = table.rows.length;
        for (var i = 0; i < rowCount; i++) {
            var row = table.rows[i];
*/            /*var chkbox = row.cells[0].childNodes[0];*/
            /*if (null != chkbox && true == chkbox.checked)*/
/*           
            if (row==currentRow.parentNode.parentNode) {
                if (rowCount <= 1) {
                    alert("Cannot delete all the rows.");
                    break;
                }
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
    } catch (e) {
        alert(e);
    }
*/   //getValues();


// *************************
// /reset-table GET handler
// *************************
// NOTE FROM CLASS: this is not a good way to handle databases by resetting them
//                  after visting a web page. but good shortcut for now
app.get ('/reset-table', resetTableFunction);

function resetTableFunction (req, res, next) {
  var context = {};
  console.log ("Inside resetTableFunction");
  // my connection pool is = mysql.pool
  // TODO: Q: why is it mysql.pool? I defined pool = mysql.createPool({...})
  //mysql.pool.query("DROP TABLE IF EXISTS workouts",
  pool.query("DROP TABLE IF EXISTS workouts",

    function(err) {
      var createString = "CREATE TABLE workouts("+
        "id INT PRIMARY KEY AUTO_INCREMENT," +
        "name VARCHAR(255) NOT NULL," +
        "reps INT," +
        "weight INT," +
        "date DATE," +
        "lbs BOOLEAN)";
        //mysql.pool.query(createString, 
        pool.query(createString, 
          function(err) {
            //throw(err);
            console.log("createString = "+createString);
            context.results = "Table reset";
            res.render ('home', context);
          }
        )
    }
  );
}
