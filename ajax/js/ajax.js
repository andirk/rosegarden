var f2_api_url = "https://api.foursquare.com/v2/"
var token = "V2IWKJRE3ARNLV5DQEELAKQH5EPU1WQOZJCZXNDURK2VJY0V";
var version_num = "20141020";
var credentials = "?oauth_token=" + token + "&v=" + version_num;

var loc_ready = new $.Deferred();

var device_lat = device_lng = null; // the specific location of the device using this app

var me, me_f2_obj;

var mapper = {
    map: null,
    center_lat: 0,
    center_lng: 0,
    map_ready: $.Deferred(),
    buildMap: function() {
        var map_options = {
            zoom:5,
            center: new google.maps.LatLng(39.25, -98.2), // set center of map to center of USA! USA! USA!
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            panControl: false
        };

        this.map = new google.maps.Map(document.getElementById('map'), map_options);
        console.log('buildMap resolved');
        this.map_ready.resolve();
    },
    placePerson: function(person) {

        var options = {
            map: this.map,
            position: new google.maps.LatLng(person.center_lat, person.center_lng),
            title: "PERSON",
            animation: google.maps.Animation.DROP,
            optimized: false
        };

        var marker = new google.maps.Marker(options);
    }
};


var person = {
    user_id: 0,
    perspective: false,     // used to indicate whether this user is "me"
    first_name: "",
    avatar: "",
    center_lat: null,
    center_lng: null,
    create: function(perspective) {

        this.perspective = perspective;
        this.setLocation();

        if ( this.perspective === true ) {
            var self = this;
            $.when( me_f2_info ).done(function( v1 ) {
                self.setDetails( me_f2_obj );                           // ... after 2 #1) set me user's details
                console.log("f2 data fetched and set to user me");
            });
        }

        console.log("person created");
        return this;
    },
    setLocation: function() {

        if ( this.perspective === true ) {
            $.when( loc_ready).done(function ( v1 ) {
                this.center_lat = device_lat;
                this.center_lng = device_lng;
                console.log("me loc set to geo");
            });
        }
    },
    setDetails: function( f2_user ) {
        this.user_id = f2_user.id;
        this.first_name = f2_user.firstName;
    }
};


// global device location setter function
function setLocation(location) {
    device_lat = this.center_lat = location.coords.latitude;
    device_lng = this.center_lng = location.coords.longitude;

    console.log(location);
    loc_ready.resolve();
}


var mapper_inst = Object.create(mapper);
mapper_inst.setLocation = setLocation.bind(mapper_inst);

navigator.geolocation.getCurrentPosition(mapper_inst.setLocation);      // #1) fetching geo...

var me_f2_info = $.ajax({
    type: "GET",
    url: f2_api_url + "users/self" + credentials,                       // #2) fetching f2 me info...
    success: function(data) {
        console.log("user data fetched successfully");
        me_f2_obj = data.response.user; // store "me"'s f2 info to be used later
    }
});


$(function() {                                                          // #3) ...page is done loading
    console.log("page loaded, let's do stuff");

    mapper_inst.buildMap();                                             // #4) map building...

    me = person.create(true);                                       // ...after 1) #1) me created
    console.log("me created");

    $.when( mapper_inst.map_ready, loc_ready ).done(function ( v1, v2 ) {
        console.log("map created AND location fetched");

        mapper_inst.map.setCenter({lat: mapper_inst.center_lat, lng: mapper_inst.center_lng});  // ...after 4&1) #1) set map center
        mapper_inst.map.setZoom(13);

        mapper_inst.placePerson(me);                                    // ...after 4&1) #2) put "me" on the map
    });

});
