/*!
 * Local Venue Search powered by Foursquare and Google Maps w/ Retina Support
 * Author: Nick Rivers @nickthedev @blueprinttweets
 * Company: Blueprint
 * Feel free to use, modify as you please. Follow us on twitter. :)
 */


$(function() {
	var lat = "";
    var lng = "";
	var appendeddatahtml = "";
	var arguments = "";
	var str = "";
    var icon_size = "64";
	var newstr = "";
	var phone = "";
	var rating = "";
	var icon = "";
	var address = "";
	
	$("#query").click(function(){
		$(this).val("");
	});
	
	$("#query").blur(function(){
		if ($(this).val() == "") {
			$(this).val("Example: Happy Hour");
		}
		
		if ($(this).val() != "Example: Happy Hour") {
			$(this).addClass("focus");
		} else {
			$(this).removeClass("focus");
		}
	});
	
	$("#searchform").submit(function(event){
		event.preventDefault();
		if (!lat) {
			navigator.geolocation.getCurrentPosition(getLocation);
		} else {
			getVenues();
		}
	});
	
	function getLocation(location) {
	    lat = location.coords.latitude;
	    lng = location.coords.longitude;
		getVenues();
	}
	
	function getVenues() {
		$.ajax({
	  		type: "GET",
	  		url: "https://api.foursquare.com/v2/venues/explore?ll="+lat+","+lng+"&client_id=TVVOUSGJOCBUQSWTWOK3DGPO5BFX3FPYYH1FWMYWFQG2CYOW&client_secret=MKNLNNOKZ5IAJLVLYP1WW03J2XOPJF1EVWJBCEERU0VGJQ2N&v=20130619&query="+$("#query").val()+"",
	  		success: function(data) {
				$("#venues").show();
				var dataobj = data.response.groups[0].items;
				$("#venues").html("");
				
				// Rebuild the map using data.
				var myOptions = {
					zoom:11,
					center: new google.maps.LatLng(lat,lng-.2),
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					panControl: false
				},
				map = new google.maps.Map(document.getElementById('map'), myOptions);
				
				// Build markers and elements for venues returned.
				$.each( dataobj, function() {
					if (this.venue.categories[0]) {
						str = this.venue.categories[0].icon.prefix;
                        icon_size = "64";
						newstr = str.substring(0, str.length - 0);
						icon = newstr+icon_size+this.venue.categories[0].icon.suffix;
					} else {
						icon = "";
					}
					
					if (this.venue.contact.formattedPhone) {
						phone = "Phone:"+this.venue.contact.formattedPhone;
					} else {
						phone = "";
					}
					
					if (this.venue.location.address) {
						address = '<p class="subinfo">'+this.venue.location.address+'<br>';
					} else {
						address = "";
					}
					
					if (this.venue.rating) {
						rating = '<span class="rating">'+this.venue.rating+'</span>';
					}
					
					appendeddatahtml = '<div class="venue"><h2><span>'+this.venue.name+'<img class="icon" src="'+icon+'"> '+rating+'</span></h2>'+address+phone+'</p><p><strong>Total Checkins:</strong> '+this.venue.stats.checkinsCount+'</p></div>';
					$("#venues").append(appendeddatahtml);
					
					// Build markers
					var markerImage = {
					url: 'images/icons/whiskey_barrel.png',
					scaledSize: new google.maps.Size(24, 24),
					origin: new google.maps.Point(0,0),
					anchor: new google.maps.Point(24/2, 24)
					},
					markerOptions = {
					map: map,
					position: new google.maps.LatLng(this.venue.location.lat, this.venue.location.lng),
					title: this.venue.name,
					animation: google.maps.Animation.DROP,
					icon: markerImage,
					optimized: false
					},
					marker = new google.maps.Marker(markerOptions)
					
				});
			}
		});
	}
	
	function mapbuild() {
		$("#venues").hide();
		var myOptions = {
		zoom:5,
		center: new google.maps.LatLng(38.962612,-99.080879),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false
		},
		map = new google.maps.Map(document.getElementById('map'), myOptions);
	}
	
	mapbuild();
});