function api(long, lat) {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var formattedDate = moment(tomorrow).format('YYYY-MM-DD');
    formattedDate += "T12:00:00Z"
    //console.log("fdate",fdate)

    $.ajax({
        url: 'https://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/16/lat/58/data.json',
        method: 'GET'
    })
        .done(function (result) {
            for (var i = 0; i < result.timeSeries.length; i++) {
                if (result.timeSeries[i].validTime.match(formattedDate)) {
                    console.log(result.timeSeries[i].validTime);
                    for (var j = 0; j < result.timeSeries[i].parameters.length; j++) {
                        if (result.timeSeries[i].parameters[j].unit === "Cel") {
                            console.log(`Temp: ${result.timeSeries[i].parameters[j].values} grader celcius`)
                        }
                    }
                }

            }
        })
        .fail(function (xhr, status, error) {
            console.log("Error", xhr, status, error);
            $("#errorDiv").html(`Error! ${xhr.responseJSON.Message}`);
        });
}
var long;
var lat;
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: { lat: 58.999874, lng: 14.749973 } 
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            long = pos.lng;
            lat = pos.lat;
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    map.addListener('click', function (e) {
        placeMarkerAndPanTo(e.latLng, map);
    });
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
    }

function placeMarkerAndPanTo(latLng, map) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
    map.panTo(latLng);
    var longLat = marker.position.toString();
    long = longLat.substring(longLat.indexOf('(') + 1, longLat.indexOf(')') - 1).split(', ')[1];
    lat = longLat.substring(longLat.indexOf('(') + 1, longLat.indexOf(')') - 1).split(', ')[0];
}



$(function () { api(long,lat); });