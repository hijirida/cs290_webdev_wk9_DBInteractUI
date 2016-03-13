// **** NEED TO CHANGE HOSTS!!
var hostIP = "52.27.76.189";
// var hostIP = "localhost";

/**********************************
 * Start Here - First load DOM content, then execute...
 **********************************/
document.addEventListener("DOMContentLoaded", function() { 
  //console.log("HELLO wK9 JAVASCRIPT");
  requestTableData();
  listenFormSubmit();
});

// ********************************
// Make request for workout data and return the JSON
// ********************************
function requestTableData() {
  // make a request for
  var req = new XMLHttpRequest();
  var httpString = "http://"+hostIP+":3002?showData=yes"; 
  
  req.open("GET", httpString, true); // true for asynch calls' 
  req.addEventListener('load', function() {
    if (req.status >= 200 && req.status<400) { 
      // for synch calls, all this code would be outside the .addEventListener!
      var reqparse = JSON.parse(req.responseText);
      console.log("reqparse = "+JSON.stringify(reqparse));
      buildTable(reqparse);
    } else {
      console.log("Error in network request: "+request.status.Text);
    }
  });
  req.send(null);
}

// ********************************
// Start listening for a new from submit
// ********************************
function listenFormSubmit() {
  var form = document.querySelector("form");
  form.addEventListener("submit", function(event) {
    console.log("intercepting submit form:"+"\n"+
                     form.elements.name.value+"\n"+
                     form.elements.reps.value+"\n"+
                     form.elements.weight.value+"\n"+
                     form.elements.wtChoice.value+"\n"+
                     form.elements.date.value);
    event.preventDefault(); //this prevents the click event propagating up the DOM
  
    // set up the AJAX request
    var req = new XMLHttpRequest();
    var httpString = "http://"+hostIP+":3002"; 
    var bodyParams = "name="+form.elements.name.value+
                      "&reps="+form.elements.reps.value+
                      "&weight="+form.elements.weight.value+
                      "&date="+form.elements.date.value+
                      "&wtChoice="+form.elements.wtChoice.value;
    req.open("POST", httpString, true); // true for asynch calls'
  
    // must set content type as urlencoded if body is "key=value&key2=value2"
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status<400) { 
          console.log("I'm in the listenFormSubmit listening after sending data");
          // call build table to re-build the table
          console.log("getting response");
          console.log(req.responseText);
          console.log("did I get a response?");
          // TODO: need to delete the table first!!
          deleteTable();
          requestTableData();
        } 
        else {
          console.log("Error in network request: "+req.status.Text);
        }
    });
    console.log("bodyParams = "+bodyParams);
    req.send(bodyParams);
  });
}
  
 
/**********
 * This is the function to build the table below the new workout submition form
 * 
 **********/   
 function buildTable(tableData){
  // TEST CODE: to see if append is working....
  // var newItem = document.createElement("p");
  // newItem.textContent = "Here is some new txt";
  // var placeHere = document.getElementsByTagName("body");
  // placeHere[0].appendChild(newItem);
  
  var newTable = document.createElement("table");
  newTable.setAttribute("id", "theTable");
  //newTable.setAttribute("border", 1);
  document.body.appendChild(newTable);
  var showHeader = true;
  buildRow(newTable, showHeader, 0);
  showHeader = false;

  //console.log("tableData.length = "+tableData.length);
  for (var i=0; i<tableData.length; i++) {
    //console.log("one row to buildRow = "+JSON.stringify(tableData[i]));
    buildRow(newTable, showHeader, tableData[i]);
  }
}
 
 /*************
 * This is the function to build a row in the table 
 *************/
function buildRow(element, showHeader, rowData) {
  //console.log ("I'm in the buildRow function");  

  var aRow = document.createElement("tr");

  if (showHeader == true){
    _buildCol(aRow, showHeader, "ID#");
    _buildCol(aRow, showHeader, "Exercise Name");
    _buildCol(aRow, showHeader, "Reps");
    _buildCol(aRow, showHeader, "Weight");
    _buildCol(aRow, showHeader, "lbs / kg");
    _buildCol(aRow, showHeader, "Date");
    _buildCol(aRow, showHeader, "");
    _buildCol(aRow, showHeader, "");
  }
  
  if (showHeader == false){
    _buildCol (aRow, showHeader, rowData.id);
    _buildCol (aRow, showHeader, rowData.name);
    _buildCol (aRow, showHeader, rowData.reps);
    _buildCol (aRow, showHeader, rowData.weight);
    if (rowData.lbs == true) {
      _buildCol (aRow, showHeader, "lbs");
    } else {
      _buildCol (aRow, showHeader, "kg");
    }
    _buildCol (aRow, showHeader, rowData.date);
    _buildDeleteButton (aRow);
    _buildEditButton (aRow);
  }
  
  function _buildCol(element, showHeader, colData) {
    //console.log("I'm in _buildCol");
    if (showHeader) {
       var aCol = document.createElement("th");
       var colTxt = document.createTextNode(colData);
    } else {
      var aCol = document.createElement("td");
      var colTxt = document.createTextNode(colData);
    }
    aCol.appendChild(colTxt);
    element.appendChild(aCol);
  }
  
  function _buildDeleteButton (element) {
    var aCol = document.createElement("td");
    // from http://www.w3schools.com/jsref/met_document_createelement.asp
    var btn = document.createElement("BUTTON");    // Create a <button> element
    var t = document.createTextNode("Delete");     // Create a text node
    btn.setAttribute("onclick", "deleteRow('workoutTable', this)");
    btn.appendChild(t);                            // Append the text to <button>
    aCol.appendChild(btn);  
    element.appendChild(aCol);
  }
  
  function _buildEditButton (element) {
    var aCol = document.createElement("td");
    // from http://www.w3schools.com/jsref/met_document_createelement.asp
    var btn = document.createElement("BUTTON");    // Create a <button> element
    var t = document.createTextNode("Edit");       // Create a text node
    btn.setAttribute("onclick", "editRow('workoutTable', this)");
    btn.appendChild(t);                            // Append the text to <button>
    aCol.appendChild(btn);  
    element.appendChild(aCol);
  }
  
  element.appendChild(aRow);
}
 
 
/**********
 * This is the function to delete the table before rebuilding a newone
 **********/   
function deleteTable(){
  //console.log ("I'm in the deleteTable function");
  var aTable = document.getElementById("theTable");
  aTable.parentNode.removeChild(aTable);
}
 
function deleteRow (tableName, location) {
        //console.log("someone pressed the DELETE button!!");
        //console.log("deleteRow currentRow = "+location);
        var idNum = location.
                      parentNode.parentNode.getElementsByTagName("td")[0].innerText;
                      // Note: location is the input element, location.parentNode is <td>
                      // location.parentNode.parentNode is <tr>
        console.log("deleteRow idNum = "+idNum);
        var req = new XMLHttpRequest();
        var httpString = "http://"+hostIP+":3002?id="+idNum+"&delete=yes"; 
        req.open("GET", httpString, true); // for asynch calls'
        req.addEventListener('load', 
          function() {
            if (req.status >= 200 && req.status<400) { 
              // for synch calls, all this code would be outside the .addEventListener!
              deleteTable();
              requestTableData();
            } else {
              console.log("inside event listener load: Error in network request");
            }
          }
        );
        req.send(null);
  }
  
  function editRow (tableName, location) {
    console.log("someone pressed the EDIT button!!");
    var idNum = location.
                parentNode.parentNode.getElementsByTagName("td")[0].innerText;
    console.log("editRow idNum = "+idNum);
    var httpString = "http://"+hostIP+":3002/editworkout?id="+idNum+"&edit=yes"; 

    //refreshes the current page to a new URL
    window.location.href = httpString;
  }
  
  //   function editRow (tableName, location) {
  //     console.log("someone pressed the EDIT button!!");
  //     var idNum = location.
  //                 parentNode.parentNode.getElementsByTagName("td")[0].innerText;
  //     console.log("editRow idNum = "+idNum);
  //     var req = new XMLHttpRequest();
  //     var httpString = "http://localhost:3002/editworkout?id="+idNum+"&edit=yes"; 
  //     req.open("GET", httpString, false); // for asynch calls'
  //     req.addEventListener('load', function() {
  //             if (req.status >= 200 && req.status<400) { 
  //               // for synch calls, all this code would be outside the .addEventListener!
  //               var htmlReturn = req.responseText; // This is the new html response
  //               console.log(htmlReturn);
  //               document.getElementsByTagName("BODY")[0].innerHTML(htmlReturn);
  //               //console.log("reqparese = "+reqparse);
  //             } else {
  //               console.log("Error in network request: "+request.status.Text);
  //             }
  //     });
  //     req.send(null);  
  //   }
