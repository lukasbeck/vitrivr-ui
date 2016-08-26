<?php

if (isset($_POST['imageData'])) {
	$timestamp = round(microtime(true) * 1000);
	$searchImagePath = 'search_img/'.$timestamp.'.jpg';
	file_put_contents($searchImagePath, base64_decode($_POST['imageData']));
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title>vitrivr</title>
		<meta name="viewport" content="height=770, initial-scale=0.25"/>
		<meta charset="utf-8" />
		<link rel="shortcut icon" href="favicon.ico">

		<link type="text/css" rel="stylesheet" href="css/materialize.min.css" media="screen,projection"/>
		<link type="text/css" rel="stylesheet" href="css/materialdesignicons.css" media="all"/>
		<link type="text/css" rel="stylesheet" href="css/material-icons.css" media="all"/>
		<link type="text/css" rel="stylesheet" href="css/spectrum.css" media="screen,projection" />
		<link type="text/css" rel="stylesheet" href="css/context.standalone.css" media="screen,projection" />
		<link type="text/css" rel="stylesheet" href="css/nouislider.css" media="screen,projection" />
		<link type="text/css" rel="stylesheet" href="video-js.css" media="screen,projection" />
		<link type="text/css" rel="stylesheet" href="css/vis.min.css" media="screen,projection" />
		<link type="text/css" rel="stylesheet" href="css/main.css"  media="screen,projection"/>

		<?php if (isset($_POST['imageData'])) {
			echo '<script type="text/javascript"> window.initialQuery = {';
			echo 'imagePath: "'.$searchImagePath.'", ';
			echo 'lat: '.$_POST['lat'].', ';
			echo 'lng: '.$_POST['lng'].', ';
			echo 'alt: '.$_POST['alt'].', ';
			echo '}; </script>';
		} ?>

		<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBI2-D4Uah81ym41yeEeQ3CJUfhvFs9RyU"></script>

		<script type="text/javascript" src="js/config.js"></script>
		<script type="text/javascript" src="js/jquery-2.1.4.min.js"></script>
		<script type="text/javascript" src="js/interact.min.js"></script>
		<script type="text/javascript" src="js/context.js"></script>
		<script type="text/javascript" src="js/oboe-browser.js"></script>
		<script type="text/javascript" src="js/motionCanvas.js"></script>
		<script type="text/javascript" src="js/sketchCanvas.js"></script>

		<script type="text/javascript" src="js/oms.min.js"></script>
		<script type="text/javascript" src="js/map.js"></script>

		<script type="text/javascript" src="js/infobubble.js"></script> <?php /* Adapted source of infobubble */ ?>
		<script type="text/javascript" src="js/map-icons.min.js"></script>
		<script type="text/javascript" src="js/vis.min.js"></script>
		<script type="text/javascript" src="js/timeline.js"></script>

		<script type="text/javascript" src="js/materialize.min.js"></script>
		<script type="text/javascript" src="js/spectrum.js"></script>
		<script type="text/javascript" src="js/nouislider.js"></script>
		<script type="text/javascript" src="js/tinysort.js"></script>
		<script type="text/javascript" src="video.js"></script>


		<script type="text/javascript" src="js/search.js"></script>
		<script type="text/javascript" src="js/ui_util.js"></script>
		<script type="text/javascript" src="js/init.js"></script>

	</head>

	<body>
		<div class="modal"> <!-- "modal-fixed-footer" -->
			<div class="modal-content">
				<img src="" />
			</div>
			<!-- <div class="modal-footer">
				<a href="#!" class="modal-action modal-close waves-effect btn-flat">Close</a>
        <button id="replay-at-position-button" class="modal-action waves-effect btn-flat "><i class="material-icons left">replay</i>Replay at position</button>
			</div>-->
		</div>

		<div class="main">
			<div class="progress" style="display: none;">
				<div class="determinate" style="width: 0%"></div>
    		<div class="indeterminate"></div>
	  	</div>

			<div class="settings">
				<button id="search-button" class="waves-effect waves-light btn red">
					<i class="material-icons left">search</i>Search
				</button>

				<button id="rf-button" class="btn red disabled">
					<i class="material-icons left">youtube_searched_for</i>Relevance
				</button>

				<div class="weight-slider">
					<label for="global-color-weight">Global Color:</label>
					<div id="global-color-weight" ></div>
				</div>
				<div class="weight-slider">
					<label for="local-color-weight">Local Color:</label>
					<div id="local-color-weight" ></div>
				</div>
				<div class="weight-slider">
					<label for="edge-weight">Edge:</label>
					<div id="edge-weight"></div>
				</div>
				<div class="weight-slider" style="display: none;">
					<label for="motion-weight">Motion:</label>
					<div id="motion-weight" ></div>
				</div>
				<div class="weight-slider">
					<label for="spatial-weight">Spatial:</label>
					<div id="spatial-weight" ></div>
				</div>
				<div class="weight-slider">
					<label for="temporal-weight">Temporal:</label>
					<div id="temporal-weight" ></div>
				</div>

				<button id="slider-defaults-button" class="waves-effect waves-light btn btn-small">
					<i class="material-icons">settings_backup_restore</i>
				</button>
			</div>

			<div class="top">
				<div class="timelineContainer">
					<div class="timeline"></div>
					<!-- <a class="waves-effect waves-white btn red resize-button resize-button-right resize-button-bottom"><i class="medium material-icons">open_with</i></a> -->
				</div>
				<div class="mapContainer">
					<div class="map"></div>
					<!-- <a class="waves-effect waves-white btn red resize-button resize-button-left resize-button-bottom"><i class="medium material-icons">open_with</i></a> -->
				</div>
			</div>

			<div class="bottom">
				<div class="sketchContainer">
					<div class="tool-pane" id="color-tool-pane">
						<div style="width: calc(100% - 60px - 10px); margin-right: 10px; float: left;">
							<label for="draw-radius">Pen Size:</label>
							<div id="draw-radius" ></div>
						</div>
						<div><input type='text' id="colorInput" /></div>
					</div>
					<div id="query-container-pane"></div>

					<!-- <a class="waves-effect waves-white btn red resize-button resize-button-right resize-button-top"><i class="medium material-icons">open_with</i></a> -->
				</div>
				<div class="resultsContainer">
					<!-- <a class="waves-effect waves-white btn red resize-button resize-button-left resize-button-top"><i class="medium material-icons">open_with</i></a> -->
				</div>
			</div>
		</div>

		<!--
		<button id="btnShowTopbar" class="btn waves-effect waves-light red"><i class="material-icons">settings</i></button>
		<button id="btnShowSidebar" class="btn waves-effect waves-light red"><i class="material-icons">create</i></button>

		<div id="sidebar" class="side-nav">
			<ul id="modechoice" class="pagination">
				<li class="active">
					<span id="colorsketchbutton"><i class="mdi mdi-brush"> </i></span>
				</li>
				<!- -<li>
					<span id="motionsketchbutton"><i class="mdi mdi-run"> </i></span>
				</li>- ->
				<li>
					<span id="spatialbutton"><i class="mdi mdi-map-marker-radius"></i></span>
				</li>
				<li>
					<span id="temporalbutton"><i class="mdi mdi-clock"></i></span>
				</li>
				<li>
				<li>
					<span id="filterbutton"><i class="mdi mdi-filter"> </i></span>
				</li>
			</ul>


			<button id="sequence-segmentation-button" class="waves-effect waves-light btn btn-large red" style="width: 100%">
				<i class="material-icons left">settings_ethernet</i>Split video into sequences
			</button>

			<button id="btnAddCanvas" class="btn-floating btn-large waves-effect waves-light red">
				<i class="material-icons">add</i>
			</button>
		</div>

		<div id="sidebarextension" class="side-nav z-depth-4">
			<div id="filter-selection">
				<div id="resultset-filter-selection">

					<p><input class="with-gap" name="result-set" type="radio" id="no-filter"  checked/>
      				<label for="no-filter">No Filter</label></p>

				</div>
			        <div class="input-field">
          				<input id="new_filter" type="text" pattern="[0-9]+(-[0-9]+)*" required>
         				 <label for="new_filter">New Filter</label>
        		</div>
			<button id="new-filter-button" class="btn red">Add new filter</button>

			</div>
		</div>
		-->
	</body>
</html>
