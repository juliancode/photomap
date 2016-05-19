// Enter button performs same action as clicking button
$(document).keypress(function(e){
    if (e.which == 13){
        $(".button").click();
    }
});

// Instantiate geocoder and map variables
var geocoder;
var map;

// Initialize function sets up Google Maps and sets long and lat to Bristol
// could change this to get users location and set this as the default location?
function initialize() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(51.454,-2.587);
  var mapOptions = {
    zoom: 5,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

// Sets up arrays and variables to be used
function codeAddress() {
  var locationid = [];
  var locationidlng = [];
  var locationidlat = [];
  var locationnames = [];
  var images = [];
  var links = [];
  var picdata = [];
  var output = "";
  // var currentlocation = "";

  // Gets address from search bar and converts to geocode location
  var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {

    // if geocoder passes as ok uses instagram api to search for long and lat
    if (status == google.maps.GeocoderStatus.OK) {
      $url = "https://api.instagram.com/v1/locations/search?lat=" + results[0].geometry.location.lat() + "&lng=" + results[0].geometry.location.lng() + "&client_id=8e24e687593e46aebc4dce7aaafb4e05";
      
      // sets center to the address given in search
      map.setCenter(results[0].geometry.location);

      // adds marker to the address given
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          title: address
      });

      console.log(results[0].geometry.location);
      
           
      // ajax call to the instagram api with given url
      var ajax = $.ajax({
          type:'GET',
          url:$url,
          dataType:'jsonp',
          success:function(feed) {
            
            // upon success calls the buildArray function
            buildArray(feed);
          }
      });

      // New function using higher order functions
      function buildArray(feed){
        feed.data.map(function(location){
          locationnames.push(location.name);
          locationid.push(location.id);
          locationidlng.push(location.longitude);
          locationidlat.push(location.latitude);
        });
      }
        // Old functiitleon
        // for (var i = 0; i < feed.data.length; i++){
        // locationnames.push(feed.data[i].name);
        // locationid.push(feed.data[i].id);
        // locationidlng.push(feed.data[i].longitude);
        // locationidlat.push(feed.data[i].latitude);
        // }
  
      $.when(ajax).done(function(){
        for (var i = 0; i < locationid.length; i++) {
        $location = "https://api.instagram.com/v1/locations/" + locationid[i] + "/media/recent?client_id=8e24e687593e46aebc4dce7aaafb4e05";
        var ajax1 = $.ajax({
          type:'GET',
          url:$location,
          dataType:'jsonp',
          success:function(feed) {
            getPics(feed);
          }
        })};

        // New code using higher order function .map method
        function getPics(feed) {
          $("#images").html("")
          feed.data.map(function(image) {
            output += '<a href="' + image.link + '" target="_blank"><img class="images" src="' + image.images.low_resolution.url + '"></a>';
            
          });

        loadPics();
        }

        function loadPics(){
          $("#images").append(output);
          $("#near").html('Photos near "' + address + '"');
        }

      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);