$(document).ready(function(){ 

	var data = new Object();

	data = getBranches();


	function getBranches(){

		var branches; 

		// GET BRANCH.CSV FROM RESOURCES
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", "resources/branch.csv", true);
		rawFile.onreadystatechange = function () {
		  if (rawFile.readyState === 4) {
		    if (rawFile.status === 200 || rawFile.status == 0) {
		      var allText = rawFile.responseText;
		      branches = csvJSON(allText);
		      return branches;

		      //////////////
		      ////  I cant get the branches (its populated) to 
		      ////	push back up to the global "data" variable
		      //////////////


		    }
		  }
		}
		rawFile.send(null);
	}


	//var csv is the CSV file with headers
	function csvJSON(csv){
	 
	  var lines=csv.split("\n");
	 
	  var result = [];
	 
	  var headers=lines[0].split(",");
	 
	  for(var i=1;i<lines.length;i++){
	 
		  var obj = {};
		  var currentline=lines[i].split(",");
	 
		  for(var j=0;j<headers.length;j++){
			  obj[headers[j]] = currentline[j];
		  }
	 
		  result.push(obj);
	 
	  }
	  
	  return result; //JavaScript object
	}

});



// GOOGLE MAPS

	var map;
	var softchoiceNA = {lat: 40.5314853, lng: -92.9806948};

	function CenterControl(controlDiv, map) {

		// Set CSS for the control border.
		var controlUI = document.createElement('div');
		controlUI.style.backgroundColor = '#fff';
		controlUI.style.border = '2px solid #fff';
		controlUI.style.borderRadius = '3px';
		controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
		controlUI.style.cursor = 'pointer';
		controlUI.style.marginBottom = '22px';
		controlUI.style.textAlign = 'center';
		controlUI.title = 'Click to reset the map';
		controlDiv.appendChild(controlUI);

		// Set CSS for the control interior.
		var controlText = document.createElement('div');
		controlText.style.color = 'rgb(25,25,25)';
		controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
		controlText.style.fontSize = '16px';
		controlText.style.lineHeight = '38px';
		controlText.style.paddingLeft = '2em';
		controlText.style.paddingRight = '2em';
		controlText.innerHTML = 'Reset';
		controlUI.appendChild(controlText);

	  	// Setup the click event listeners: simply set the map to Softchoice North America.
	  	controlUI.addEventListener('click', function() {
	    	map.setCenter(softchoiceNA);
	    	map.setZoom(4);
	  	});

	}

	function initMap() {
	  
	  map = new google.maps.Map(document.getElementById('map'), {
	  	zoom: 4,
	    center: softchoiceNA,
	    zoomControl: true,
	    scaleControl: false,
	    mapTypeControl: false,
	    streetViewControl: false,
	  	center: softchoiceNA,
	  	scrollwheel: false
	  });
	  
	  // Create the Div to hold the control and call the CenterControl() constructor
	  // passing in this Div

	  var centerControlDiv = document.createElement('div');
	  var centerControl = new CenterControl(centerControlDiv, map);

	  centerControlDiv.index = 1;
	  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);
	}
















