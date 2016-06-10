function Map(div) {
	var latLng = {lat: 47.557993859037765, lng: 7.581424713134766};
	var googleMap = new google.maps.Map(div, {
		center: latLng,
		clickableIcons: false,
		zoom: 14
	});

	var marker;
	var circle;
	googleMap.addListener('click', function(event) {
		if (marker !== undefined) {
			marker.setPosition(event.latLng);
		} else {
			marker = new google.maps.Marker({
				position: event.latLng,
				draggable: true,
				map: googleMap
			});
			circle = new google.maps.Circle({
				radius: 500,
				fillColor: '#AA0000',
				editable: true,
				map: googleMap
			});
			circle.bindTo('center', marker, 'position');
		}
	});

	this.resize = function() {
		google.maps.event.trigger(googleMap, 'resize');
		googleMap.setCenter(latLng);
	};

	this.hasMarker = function() {
		return marker !== undefined;
	}

	this.lat = function() {
		return marker.getPosition().lat();
	};

	this.lng = function() {
		return marker.getPosition().lng();
	};

	this.radius = function() {
		return circle.getRadius();
	};
}
