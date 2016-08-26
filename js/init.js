videojs.options.flash.swf = "video-js.swf";
var shotStartTime = 0;

function remove_emenent(arr, val) {
	var i = arr.indexOf(val);
	return i>-1 ? this.splice(i, 1) : [];
};

$(document).ready(function() {
	window.map = new Map($('.map')[0]);
	window.timeline = new Timeline($('.timeline')[0]);

	$('.modal').click(function() {
		$('.modal').closeModal();
	});

	$('.timelineContainer, .mapContainer, .sketchContainer, .resultsContainer').click(function(e) {
		if (this != e.target) {
			return;
		}

		// Get current container
		var container = this; //$(this).parent()[0];

		// Get other row element
		var thisRow = container;
		var otherRow = $(container).siblings()[0];
		var thisCol = $(container).parent()[0];
		var otherCol = $(thisCol).siblings()[2];

		window.map.saveCenter();
		$('.settings').toggleClass('minimize');
		$(otherCol).toggleClass('minimize');
		$(thisCol).toggleClass('maximize');

		$(otherRow).toggleClass('minimize');
		$(thisRow).toggleClass('maximize');

		var intervalId = window.setInterval(function() { window.map.resize(); }, 250);
		$(this).one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
			window.clearInterval(intervalId);
			window.map.resize();
		});
	});
});

function updateSliders() {

	ScoreWeights.globalcolor = $('#global-color-weight').get(0).noUiSlider.get();
	ScoreWeights.localcolor = $('#local-color-weight').get(0).noUiSlider.get();
	ScoreWeights.edge = $('#edge-weight').get(0).noUiSlider.get();
	ScoreWeights.motion = $('#motion-weight').get(0).noUiSlider.get();
	ScoreWeights.spatial = $('#spatial-weight').get(0).noUiSlider.get();
	ScoreWeights.temporal = $('#temporal-spatial').get(0).noUiSlider.get();
	normalizeScoreWeights();

	updateScores(true);

}

function readSliders() {

	ScoreWeights.globalcolor = $('#global-color-weight').get(0).noUiSlider.get();
	ScoreWeights.localcolor = $('#local-color-weight').get(0).noUiSlider.get();
	ScoreWeights.edge = $('#edge-weight').get(0).noUiSlider.get();
	ScoreWeights.motion = $('#motion-weight').get(0).noUiSlider.get();
	ScoreWeights.spatial = $('#spatial-weight').get(0).noUiSlider.get();
	ScoreWeights.temporal = $('#temporal-weight').get(0).noUiSlider.get();

}

function setSliders() {
	$('#global-color-weight').get(0).noUiSlider.set(ScoreWeights.globalcolor);
	$('#local-color-weight').get(0).noUiSlider.set(ScoreWeights.localcolor);
	$('#edge-weight').get(0).noUiSlider.set(ScoreWeights.edge);
	$('#motion-weight').get(0).noUiSlider.set(ScoreWeights.motion);
	$('#spatial-weight').get(0).noUiSlider.set(ScoreWeights.spatial);
	$('#temporal-weight').get(0).noUiSlider.set(ScoreWeights.temporal);
}


$(function() {
	/*  sliders  */
	noUiSlider.create($('#draw-radius').get(0), {
		start : 50,
		step : 1,
		range : {
			'min' : 1,
			'max' : 100
		},
		format : wNumb({
			decimals : 0
		})
	});

	$('#draw-radius').get(0).noUiSlider.on('change', function(e) {
		var width = e[0];
		for (el in shotInputs) {
			shotInputs[el].color.setLineWidth(width);
		}

	});

	noUiSlider.create($('#global-color-weight').get(0), {
		start : ScoreWeights.globalcolor,
		step : 1,
		range : {
			'min' : 0,
			'max' : 100
		},
		format : wNumb({
			decimals : 0
		})
	});

	noUiSlider.create($('#local-color-weight').get(0), {
		start : ScoreWeights.localcolor,
		step : 1,
		range : {
			'min' : 0,
			'max' : 100
		},
		format : wNumb({
			decimals : 0
		})
	});

	noUiSlider.create($('#edge-weight').get(0), {
		start : ScoreWeights.edge,
		step : 1,
		range : {
			'min' : 0,
			'max' : 100
		},
		format : wNumb({
			decimals : 0
		})
	});

	noUiSlider.create($('#motion-weight').get(0), {
		start : ScoreWeights.motion,
		step : 1,
		range : {
			'min' : 0,
			'max' : 100
		},
		format : wNumb({
			decimals : 0
		})
	});

	noUiSlider.create($('#spatial-weight').get(0), {
		start : ScoreWeights.spatial,
		step : 1,
		range : {
			'min' : 0,
			'max' : 100
		},
		format : wNumb({
			decimals : 0
		})
	});

	noUiSlider.create($('#temporal-weight').get(0), {
		start : ScoreWeights.temporal,
		step : 1,
		range : {
			'min' : 0,
			'max' : 100
		},
		format : wNumb({
			decimals : 0
		})
	});

	$('#global-color-weight').get(0).noUiSlider.on('change', function(_, __, val){

		if(val > ScoreWeights.globalcolor){
			readSliders();
			var sum = sumWeights();
			if(sum > 100){
				var scale = (100 - val) / (sum - ScoreWeights.globalcolor);
				$('#local-color-weight').get(0).noUiSlider.set(ScoreWeights.localcolor * scale);
				$('#edge-weight').get(0).noUiSlider.set(ScoreWeights.edge * scale);
				$('#motion-weight').get(0).noUiSlider.set(ScoreWeights.motion * scale);
				$('#spatial-weight').get(0).noUiSlider.set(ScoreWeights.spatial * scale);
				$('#temporal-weight').get(0).noUiSlider.set(ScoreWeights.temporal * scale);
			}
		}
		updateScores(true);
	});
	$('#local-color-weight').get(0).noUiSlider.on('change', function(_, __, val){

		if(val > ScoreWeights.localcolor){
			readSliders();
			var sum = sumWeights();
			if(sum > 100){
				var scale = (100 - val) / (sum - ScoreWeights.localcolor);
				$('#global-color-weight').get(0).noUiSlider.set(ScoreWeights.globalcolor * scale);
				$('#edge-weight').get(0).noUiSlider.set(ScoreWeights.edge * scale);
				$('#motion-weight').get(0).noUiSlider.set(ScoreWeights.motion * scale);
				$('#spatial-weight').get(0).noUiSlider.set(ScoreWeights.spatial * scale);
				$('#temporal-weight').get(0).noUiSlider.set(ScoreWeights.temporal * scale);
			}
		}
		updateScores(true);
	});
	$('#edge-weight').get(0).noUiSlider.on('change', function(_, __, val){
		console.log(_);
		if(val > ScoreWeights.edge){
			readSliders();
			var sum = sumWeights();
			if(sum > 100){
				var scale = (100 - val) / (sum - ScoreWeights.edge);
				$('#global-color-weight').get(0).noUiSlider.set(ScoreWeights.globalcolor * scale);
				$('#local-color-weight').get(0).noUiSlider.set(ScoreWeights.localcolor * scale);
				$('#motion-weight').get(0).noUiSlider.set(ScoreWeights.motion * scale);
				$('#spatial-weight').get(0).noUiSlider.set(ScoreWeights.spatial * scale);
				$('#temporal-weight').get(0).noUiSlider.set(ScoreWeights.temporal * scale);
			}
		}
		updateScores(true);
	});
	$('#motion-weight').get(0).noUiSlider.on('change', function(_, __, val){

		if(val > ScoreWeights.motion){
			readSliders();
			var sum = sumWeights();
			if(sum > 100){
				var scale = (100 - val) / (sum - ScoreWeights.motion);
				$('#global-color-weight').get(0).noUiSlider.set(ScoreWeights.globalcolor * scale);
				$('#local-color-weight').get(0).noUiSlider.set(ScoreWeights.localcolor * scale);
				$('#edge-weight').get(0).noUiSlider.set(ScoreWeights.edge * scale);
				$('#spatial-weight').get(0).noUiSlider.set(ScoreWeights.spatial * scale);
				$('#temporal-weight').get(0).noUiSlider.set(ScoreWeights.temporal * scale);
			}
		}
		updateScores(true);
	});
	$('#spatial-weight').get(0).noUiSlider.on('change', function(_, __, val){

		if(val > ScoreWeights.spatial){
			readSliders();
			var sum = sumWeights();
			if(sum > 100){
				var scale = (100 - val) / (sum - ScoreWeights.spatial);
				$('#global-color-weight').get(0).noUiSlider.set(ScoreWeights.globalcolor * scale);
				$('#local-color-weight').get(0).noUiSlider.set(ScoreWeights.localcolor * scale);
				$('#edge-weight').get(0).noUiSlider.set(ScoreWeights.edge * scale);
				$('#motion-weight').get(0).noUiSlider.set(ScoreWeights.motion * scale);
				$('#temporal-weight').get(0).noUiSlider.set(ScoreWeights.temporal * scale);
			}
		}
		updateScores(true);
	});
	$('#temporal-weight').get(0).noUiSlider.on('change', function(_, __, val){

		if(val > ScoreWeights.spatial){
			readSliders();
			var sum = sumWeights();
			if(sum > 100){
				var scale = (100 - val) / (sum - ScoreWeights.spatial);
				$('#global-color-weight').get(0).noUiSlider.set(ScoreWeights.globalcolor * scale);
				$('#local-color-weight').get(0).noUiSlider.set(ScoreWeights.localcolor * scale);
				$('#edge-weight').get(0).noUiSlider.set(ScoreWeights.edge * scale);
				$('#motion-weight').get(0).noUiSlider.set(ScoreWeights.motion * scale);
				$('#spatial-weight').get(0).noUiSlider.set(ScoreWeights.spatial * scale);
			}
		}
		updateScores(true);
	});

	/*  color picker  */
	$("#colorInput").spectrum({
		showPaletteOnly : true,
		togglePaletteOnly : true,
		togglePaletteMoreText : 'more',
		togglePaletteLessText : 'less',
		color : '#000',
		palette : [["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"], ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#0101ff", "#90f", "#f0f"], ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"], ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"], ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"], ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"], ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"], ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"],
 [
 "#b78a85",
 "#7f534b",
 "#997657",
 "#7d7060",
 "#694e2a",
 "#747e43",
 "#b3c65e",
 "#66aa83",
 ],["#88d4e9",
 "#5d6c8b",
 "#4a1ecf",
 "#b890bd",
 "#431012"
		]],
		hideAfterPaletteSelect: true, //possibly remove this again
		change : function(color) {
			for (el in shotInputs) {
				shotInputs[el].color.setColor(color);
			}
		}
	});

	/*  context menu  */
	context.init({
		compress : true
	});


	/*  buttons  */
	$("#btnAddCanvas").click(function(e) {
		e.preventDefault();
		newShotInput();
	});

	$('#btnShowSidebar').click(function() {
		if ($('#sidebar').hasClass('open') && $('#sidebarextension').hasClass('open')) {
			$('#sidebarextension').removeClass('open');
			$('#btnShowSidebar').removeClass('open');

		}
		$('#sidebar').toggleClass('open');
		$('body').toggleClass('push-toright');
	});

	$('#btnShowTopbar').click(function() {
		$('body').toggleClass('push-tobottom');
		$('#btnShowTopbar').toggleClass('topOpen');
		$('#btnShowSidebar').toggleClass('topOpen');
		$('#sidebarextension').toggleClass('topOpen');
		$('#topbar').toggleClass('open');
	});

	$('#colorsketchbutton').on('click', function(event) {
		$('.query-input-container').show();
		$('.colorsketch').show();
		$('.motionsketch').hide();
		$('.objectsketch').hide();
		$('#map').hide();
		$('#timeline').hide();

		$('#btnAddCanvas').show();
		$('#color-tool-pane').show();
		$('#sidebarextension').removeClass('open');
		$('#btnShowSidebar').removeClass('open');

		$(this).parent().siblings().removeClass('active');
		$(this).parent().addClass('active');
	});

	/*
	$('#motionsketchbutton').on('click', function(event) {
		$('.query-input-container').show();
		$('.colorsketch').hide();
		$('.motionsketch').show();
		$('.objectsketch').show();
		$('#map').hide();
		$('#timeline').hide();

		$('#btnAddCanvas').show();
		$('#color-tool-pane').hide();
		$('#sidebarextension').removeClass('open');
		$('#btnShowSidebar').removeClass('open');

		$(this).parent().siblings().removeClass('active');
		$(this).parent().addClass('active');
	});
	*/

	$('#spatialbutton').on('click', function(event) {
		$('.query-input-container').hide();
		$('.colorsketch').hide();
		$('.motionsketch').hide();
		$('#map').show();
		$('#timeline').hide();
		map.resize();

		$('#btnAddCanvas').hide();
		$('#color-tool-pane').hide();
		$('#sidebarextension').removeClass('open');
		$('#btnShowSidebar').removeClass('open');

		$(this).parent().siblings().removeClass('active');
		$(this).parent().addClass('active');
	});

	$('#temporalbutton').on('click', function(event) {
		$('.query-input-container').hide();
		$('.colorsketch').hide();
		$('.motionsketch').hide();
		$('#map').hide();
		$('#timeline').show();

		$('#btnAddCanvas').hide();
		$('#color-tool-pane').hide();
		$('#sidebarextension').removeClass('open');
		$('#btnShowSidebar').removeClass('open');

		$(this).parent().siblings().removeClass('active');
		$(this).parent().addClass('active');
	});

	$('#filterbutton').on('click', function(event) {
		$('.motionsketch').show();
		$('.objectsketch').show();
		$('.audiosketch').hide();
		$('#color-tool-pane').hide();
		$('#sidebarextension').addClass('open');
		$('#btnShowSidebar').addClass('open');
		$('#concept-selection').hide();
		$('#filter-selection').show();
		$(this).parent().siblings().removeClass('active');
		$(this).parent().addClass('active');
	});

	$('#search-button').click(function(){
		search();
//		$('#btnShowSidebar').click();
	});

//	$('#sequence-segmentation-button').click(sequenceSegmentation);

	$('#rf-button').click(function() {
		if (!$(this).hasClass('disabled')) {
			search(-1, rf_positive, rf_negative);
		}
	});

	$('#slider-defaults-button').click(function() {
		restoreDefaultScoreWeights();
		setSliders();
		updateScores(true);
	});

	$('#replay-at-position-button').click(function(){
		videojs('videoPlayer').currentTime(shotStartTime);
		videojs('videoPlayer').play();
	});

	$('#new-filter-button').click(function() {
		if(!$('#new_filter').get(0).validity.patternMismatch){
			var filterName = $('#new_filter').val();
			addResultSetFilter('v' + filterName);
			$('#new_filter').val('');
		}

	});

	/*  add first canvas  */
	newShotInput();

	/* Check & load search image if given */
	if (window.initialQuery !== undefined) {
		console.log(window.initialQuery);
		console.log(shotInputs);
		console.log(window.map);
		shotInputs['shotInput_0'].color.loadImageFromUrl(window.initialQuery.imagePath);
		window.map.setLatLng({'lat': window.initialQuery.lat, 'lng': window.initialQuery.lng});
	}

	/* video player */
	/*
	videojs('videoPlayer').on('loadeddata', function() {
		videojs('videoPlayer').currentTime(shotStartTime);
		videojs('videoPlayer').play();
	});
	*/

	$('#btnShowSidebar').click();
	setTimeout(function(){$('#btnShowTopbar').click();}, 500);

});
