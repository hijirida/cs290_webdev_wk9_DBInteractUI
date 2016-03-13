
  var form = document.querySelector("form");
  form.addEventListener("submit", function(event) {
    console.log("inside the submit event...");
    console.log("intercepting submit form:"+"\n"+
                form.elements.idindexvalue+"\n"+
                form.elements.name.value+"\n"+
                form.elements.reps.value+"\n"+
                form.elements.weight.value+"\n"+
                form.elements.wtChoice.value+"\n"+
                form.elements.date.value);
    
    event.preventDefault(); //this prevents the click event propagating up the DOM
    // set up the AJAX request
    var req = new XMLHttpRequest();
    var httpString = "http://localhost:3002/editWorkout/"; 
    var bodyParams = "id="+form.elements.idindex.value+
                      "&name="+form.elements.name.value+
                      "&reps="+form.elements.reps.value+
                      "&weight="+form.elements.weight.value+
                      "&date="+form.elements.date.value+
                      "&wtChoice="+form.elements.wtChoice.value;
    
    console.log("bodyParams = "+bodyParams);
    
    req.open("POST", httpString, true); // true for asynch calls'
    // must set content type as urlencoded if body is "key=value&key2=value2"
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
    req.addEventListener('load', function() {
            if (req.status >= 200 && req.status<400) { 
              //for synch calls, all this code would be outside the .addEventListener!
              //var reqparse = JSON.parse(req.responseText);
              //console.log("reqparese = "+reqparse);
              var httpString = "http://localhost:3002"; 
              //refreshes the current page to a new URL
              window.location.href = httpString;
            } 
            else {
              console.log("Error in network request: "+req.status.Text);
            }
    });
    console.log("bodyParams = "+bodyParams);
    req.send(bodyParams);
  });
