function Map(div) {
	var latLng = {lat: 47.557993859037765, lng: 7.581424713134766};
	var googleMap = new google.maps.Map(div, {
		center: latLng,
		clickableIcons: false,
		zoom: 14
	});
	var oms = new OverlappingMarkerSpiderfier(googleMap, {
		markersWontMove: true,
		markersWontHide: true,
		nearbyDistance: 40 // increase spiderfier distance from 20px to 40px
	});
	var getPinSymbol = function(color) {
		return {
			path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -1,-30 a 1,1 0 1,1 2,0 1,1 0 1,1 -2,0',
			fillColor: color,
			fillOpacity: 1,
			strokeColor: '#000',
			strokeWeight: 2,
			scale: 1,
		};
	};

	/* Query */
	var queryMarker = new google.maps.Marker({
		position: null,
		map: null,
		draggable: true,
		zIndex: 1000,
		icon: getPinSymbol('#8f78fc')
		//icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_purple.png'
	});
	queryMarker.addListener('click', function(event) {
		queryMarker.setMap(null);
		queryMarker.setPosition(null);
	});

	googleMap.addListener('click', function(event) {
		queryMarker.setMap(googleMap);
		queryMarker.setPosition(event.latLng);
	});

	this.hasQuery = function() {
		return queryMarker.getMap() !== null && queryMarker.getPosition() !== null;
	};

	this.getQuery = function() {
		return queryMarker.getPosition();
	};

	/* Results */
	var resultMarkers = {};
	var infoWindow = new InfoBubble({
		content: '',
		arrowSize: 0,
		maxWidth: 250,
		maxHeight: 250,
		disableAutoPan: true,
		borderWidth: 1,
		borderRadius: 0,
		padding: 0,
		closeSrc: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' // transparent 1x1 image
	});

	this.clearResults = function() {
		for (var m in resultMarkers) {
			resultMarkers[m].setMap(null);
			delete resultMarkers[m];
		}
		resultMarkers = {};
		oms.clearMarkers();
		infoWindow.close();
	};

	this.addResult = function(videoId, latLng, thumbnail) {
    if (!$.isNumeric(latLng.lat) || !$.isNumeric(latLng.lng)) {
      console.log("Warning: passed location contains non-numeric", latLng);
      return;
    }

		var contentString = '<img class="map-thumbnail" style="max-width: 120px;" src="' + thumbnail + '" onClick="showImage(' + videoId + ');" />';
		var resultMarker = new google.maps.Marker({
			position: latLng,
			draggable: false,
			map: googleMap,
			icon: getPinSymbol('#' + scoreToHexColor(0))
		});

		resultMarker.addListener('mouseover', function() {
			infoWindow.setContent(contentString);
			infoWindow.open(googleMap, resultMarker);
		});

		resultMarker.addListener('mouseout', function() {
			infoWindow.close();
		});

		oms.addMarker(resultMarker);
		resultMarkers[videoId] = resultMarker;
  };

	this.setScore = function(videoId, score) {
		if (!resultMarkers.hasOwnProperty(videoId)) {
			return; // Unknown video, ignore
		}
		var scoreMarker = getPinSymbol('#' + scoreToHexColor(score));
		resultMarkers[videoId].setIcon(scoreMarker);
	};

	this.setIndex = function(videoId, index) {
		if (!resultMarkers.hasOwnProperty(videoId)) {
			return; // Unknown video, ignore
		}
		resultMarkers[videoId].setZIndex(index);
	};

	this.centerResults = function() {
		var bounds = new google.maps.LatLngBounds();
		if (this.hasQuery()) {
			bounds.extend(this.getQuery());
		}

		for (m in resultMarkers) {
			var latLng = resultMarkers[m].getPosition();
			bounds.extend(latLng);
		}

		googleMap.setCenter(bounds.getCenter());
		googleMap.fitBounds(bounds);
	};

	/* Other */
	var currentCenter = googleMap.getCenter();
	this.saveCenter = function() {
		currentCenter = googleMap.getCenter();
	};
	this.resize = function() {
		google.maps.event.trigger(googleMap, 'resize');
		googleMap.setCenter(currentCenter);
	};
}
