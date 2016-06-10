videojs.options.flash.swf = "video-js.swf";
var shotStartTime = 0;

function remove_emenent(arr, val) {
	var i = arr.indexOf(val);
	return i>-1 ? this.splice(i, 1) : [];
};

/* map */
var map;
$(document).ready(function() {
	map = new Map($('#map').get(0));
});

$(function() {
	/*  sliders  */
	noUiSlider.create($('#draw-radius').get(0), {
		start : 10,
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
		start : 100 * ScoreWeights.globalcolor,
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
		start : 100 * ScoreWeights.localcolor,
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
		start : 100 * ScoreWeights.edge,
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
		start : 100 * ScoreWeights.motion,
		step : 1,
		range : {
			'min' : 0,
			'max' : 100
		},
		format : wNumb({
			decimals : 0
		})
	});
	

	function updateSliders(){
		ScoreWeights.globalcolor = $('#global-color-weight').get(0).noUiSlider.get();
		ScoreWeights.localcolor = $('#local-color-weight').get(0).noUiSlider.get();
		ScoreWeights.edge = $('#edge-weight').get(0).noUiSlider.get();
		ScoreWeights.motion = $('#motion-weight').get(0).noUiSlider.get();
		normalizeScoreWeights();
		
		updateScores(true);
		
	}
	
	$('#global-color-weight').get(0).noUiSlider.on('change', updateSliders);
	$('#local-color-weight').get(0).noUiSlider.on('change', updateSliders);
	$('#edge-weight').get(0).noUiSlider.on('change', updateSliders);
	$('#motion-weight').get(0).noUiSlider.on('change', updateSliders);

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

		} else if ($('#filterbutton').parent().hasClass('active')) {
			$('#sidebarextension').addClass('open');
			$('#btnShowSidebar').addClass('open');
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
		$('#map').hide();

		$('#btnAddCanvas').show();
		$('#color-tool-pane').show();
		$('#sidebarextension').removeClass('open');
		$('#btnShowSidebar').removeClass('open');

		$(this).parent().siblings().removeClass('active');
		$(this).parent().addClass('active');
	});

	$('#motionsketchbutton').on('click', function(event) {
		$('.query-input-container').show();
		$('.colorsketch').hide();
		$('.motionsketch').show();
		$('#map').hide();

		$('#btnAddCanvas').show();
		$('#color-tool-pane').hide();
		$('#sidebarextension').removeClass('open');
		$('#btnShowSidebar').removeClass('open');

		$(this).parent().siblings().removeClass('active');
		$(this).parent().addClass('active');
	});

	$('#spatialbutton').on('click', function(event) {
		$('.query-input-container').hide();
		$('.colorsketch').hide();
		$('.motionsketch').hide();
		$('#map').show();
		map.resize();

		$('#btnAddCanvas').hide();
		$('#color-tool-pane').hide();
		$('#sidebarextension').removeClass('open');
		$('#btnShowSidebar').removeClass('open');

		$(this).parent().siblings().removeClass('active');
		$(this).parent().addClass('active');
	});

	$('#filterbutton').on('click', function(event) {
		$('.motionsketch').show();
		$('#color-tool-pane').hide();
		$('#sidebarextension').addClass('open');
		$('#btnShowSidebar').addClass('open');
		$('#filter-selection').show();
		$(this).parent().siblings().removeClass('active');
		$(this).parent().addClass('active');
	}); 

	$('#search-button').click(function(){
		search();
		$('#btnShowSidebar').click();
	});
	
	$('#sequence-segmentation-button').click(sequenceSegmentation);
	
	$('#rf-button').click(function(){
		search(-1, rf_positive, rf_negative);
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
	
	/* video player */
	videojs('videoPlayer').on('loadeddata', function() {
		videojs('videoPlayer').currentTime(shotStartTime);
		videojs('videoPlayer').play();
	});
	


});
