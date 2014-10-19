<!DOCTYPE html>
<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" href="css/style.css" type="text/css">
<body>
	<section>
		<form action="#" method="GET" id="searchform">
			<input type="text" name="query" id="query" />
			<input type="submit" name="submit" id="submit" value="Gogogo!" />
		</form>

        <a href="#" id="show_me">Show my history</a>
		
		<div id="content">
			<div id="venuewrapper">
				<div id="venues"></div>
			</div>
			<div id="mapcontainer">
				<div class="map" id="map"></div>
			</div>
		</div>
	</section>
	
	<script src="http://code.jquery.com/jquery-1.10.0.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&v=3.17"></script>
	<script src="js/site.js" type="text/javascript"></script>
</body>
</html>