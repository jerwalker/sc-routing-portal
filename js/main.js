
var locations = new Array();

// Takes a csv file, uses scvJSON function to convert and callbacks when complete
	function getData(filename, callback){

		var filedata; 

		// GET BRANCH.CSV FROM RESOURCES
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", filename, true);
		rawFile.onreadystatechange = function () {
		  if (rawFile.readyState === 4) {
		    if (rawFile.status === 200 || rawFile.status == 0) {
		      var allText = rawFile.responseText;
		      filedata = csvJSON(allText);

		      // return to caller
		      callback(filedata);

		    } 
		  } 

		}
		rawFile.send(null);
	}

// Receives the csv data from getData and turns to JSON object
	function csvJSON(csv){
	 
	 	//breaks csv into separate lines based on line breaks/return
		var lines=csv.split("\n");
		 
		var result = [];

	 
		//Takes header line: split and join replace spaces with underscores. The final Split breaks them up into seperate headers by comma.
	  	var headers=lines[0].replace(/[()\s]/g, "").split(",");
	 
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

// Get Branches
	getData("resources/branch.csv", function(data) {

		if ($.isArray(data)){

			$('#BranchStatus.panel-body').addClass('loaded').empty().html('Data Loaded');
			
			//populates global locations array with sites from branches
			
			$.each(data, function(i, branch){
				locations.push(branch.SiteOwningUser);
			});

			initMap();

		} else {

			$('#BranchStatus.panel-body').addClass('failed');
		}

		

	});

// Get Teams
	getData("resources/tsdteams.csv", function(data) {
	

		if ($.isArray(data)){

			$('#TeamStatus.panel-body').addClass('loaded').empty().html('Data Loaded');

		} else {

			$('#TeamStatus.panel-body').addClass('failed');
		}

	});

// Get Routing
	getData("resources/routing.csv", function(data) {
		
		if ($.isArray(data)){

			$('#RoutingStatus.panel-body').addClass('loaded').empty().html('Data Loaded');

		} else {

			$('#RoutingStatus.panel-body').addClass('failed');
		}

	});

// // Makes map responsive

// 	google.maps.event.addDomListener(window, "load", initMap);
// 	google.maps.event.addDomListener(window, "resize", function() {
// 		google.maps.event.trigger(map, "resize");
// 		map.setCenter(softchoiceNA);
// 	    map.setZoom(4);
// 	});


// GOOGLE MAPS

	var map;
	var geocoder;
	var softchoiceNA = {lat: 40.5314853, lng: -92.9806948};


	function initMap() {
	  
	  	var mapOptions = { 
	  		zoom: 4,
		    center: softchoiceNA,
		    zoomControl: true,
		    scaleControl: false,
		    mapTypeControl: false,
		    streetViewControl: false,
		  	scrollwheel: false,
	  	};

	  	map = new google.maps.Map(document.getElementById("map"), mapOptions);

		 geocoder = new google.maps.Geocoder();


	  	for (i = 0; i < locations.length; i++) {
	  		geocodeAddress(locations,i);
	  	}

	  	// Create the Div to hold the reset control
		  var centerControlDiv = document.createElement('div');
		  var centerControl = new CenterControl(centerControlDiv, map);

		  centerControlDiv.index = 1;
		  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);

	}

	// Reset Control Function
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

	// Geocode Function (for missing long-lat)

		function geocodeAddress(locations,i){
			geocoder.geocode({
				'address':locations[i]
			},

			function (results,status){
				if (status == google.maps.GeocoderStatus.OK) {
					var marker = new google.maps.Marker({
						//icon:'http://maps.google.com/mapfiles/ms/icons/blue.png',
						map: map,
						position: results[0].geometry.location,
						animation: google.maps.Animation.DROP,
					})

					infoWindow(marker,map,locations[i]);
				} else { console.log("Google Status: Failed") }
			});
		}

		function infoWindow(marker, map, title) {
		    google.maps.event.addListener(marker, 'click', function () {
		        var html = "<div><p>" + title + "</p></div>";
		        iw = new google.maps.InfoWindow({
		            content: html,
		            maxWidth: 350
		        });
		        iw.open(map, marker);
		    });
		}






