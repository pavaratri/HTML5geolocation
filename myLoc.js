window.onload = getMyLocation;

var watchId = null;

function watchLocation() {
	watchId = navigator.geolocation.watchPosition(displayLocation,
													displayError);
}

function clearWatch() {
	if (watchId) {
		navigator.geolocation.clearWatch(watchId);
		watchId = null;
	}
}

function getMyLocation() {

	if (navigator.geolocation) {
	
		//navigator.geolocation.getCurrentPosition(displayLocation, displayError);
		var watchButton = document.getElementById("watch");
		watchButton.onclick = watchLocation;
		var clearWatchButton = document.getElementById("clearWatch");
		clearWatchButton.onclick = clearWatch;
			
	} else {
		
		alert("Oops, no gelocation support");
	
	}
}

var prevCoords = null;

function displayLocation(position) {

	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	
	var div = document.getElementById("location");
	div.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude;
	div.innerHTML += " (with " + position.coords.accuracy + " meters accuracy)";
	
	var km = computeDistance(position.coords, timesSquareCoords);
	var distance = document.getElementById("distance");
	distance.innerHTML = "You are " + km + " km from Times Square.";
	
	if (map == null) {
		showMap(position.coords);
		prevCoords = position.coords;
		
	} 
	else {
		var meters = computeDistance(position.coords, prevCoords) * 1000;
		if (meters > 20) {
		scrollMapToPosition(position.coords);
		prevCoords = position.coords;
		}
	}
}

function displayError(error) {
	var errorTypes = {
		0: "Unknown error",
		1: "Permission denied by user",
		2: "Position is not available",
		3: "Request timed out"
		
	};
	var errorMessage = errorTypes[error.code];
	if (error.code == 0 || error.code == 2) {
		errorMessage = errorMessage + " " + error.message;
		
	}
	var div = document.getElementById("location");
	div.innerHTML = errorMessage;
}



//
// Uses the Spherical Law of Cosines to find the distance
// between two lat/long points
//
function computeDistance(startCoords, destCoords) {
	var startLatRads = degreesToRadians(startCoords.latitude);
	var startLongRads = degreesToRadians(startCoords.longitude);
	var destLatRads = degreesToRadians(destCoords.latitude);
	var destLongRads = degreesToRadians(destCoords.longitude);

	var Radius = 6371; // radius of the Earth in km
	var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + 
					Math.cos(startLatRads) * Math.cos(destLatRads) *
					Math.cos(startLongRads - destLongRads)) * Radius;

	return distance;
}

function degreesToRadians(degrees) {
	radians = (degrees * Math.PI)/180;
	return radians;
}

var timesSquareCoords = {
	latitude: 40.7566,
	longitude: -73.9863	
};

//Google Maps API in Action!
var map;

function showMap(coords) {
	var googleLatAndLong = 
		new google.maps.LatLng(coords.latitude,
							   coords.longitude);
							
	var mapOptions = {
		
		zoom: 10,
		center: googleLatAndLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
		
	};
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);
	
	var title = "Your Location";
	var content = "You are here: " + coords.latitude + ", " + coords.longitude;
	addMarker(map, googleLatAndLong, title, content);
}

//Google Maps Add Marker Function
function addMarker(map, latlong, title, content) {
var markerOptions = {
	
	position: latlong,	
	map: map,	
	title: title,
	clicable: true
	
	
};

var marker = new google.maps.Marker(markerOptions);

var infoWindowOptions = {
	content: content,
	position:latlong
	
};
var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

google.maps.event.addListener(marker, "click", function() {
	
	infoWindow.open(map);
});
}

function scrollMapToPosition(coords) {
	var latitude = coords.latitude;
	var longitude = coords.longitude;
	var latlong = new google.maps.LatLng(latitude, longitude);
	
	map.panTo(latlong);
	
	addMarker(map, latlong, "your new location", "you moved to: " +
								latitude + ", " + longitude);
}
