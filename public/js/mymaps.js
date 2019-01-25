google.maps.event.addDomListener(window, 'load', init);
var map, markersArray = [];            
function init() {
  var mapOptions = {
    center: new google.maps.LatLng(44.949249617825004,12.246409686719744),
    zoom: 5,
    gestureHandling: 'auto',
    fullscreenControl: false,
    zoomControl: true,
    disableDoubleClickZoom: true,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
    },
    scaleControl: true,
    scrollwheel: false,
    streetViewControl: true,
    draggable : true,
    clickableIcons: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [{
        "saturation": 36
      }, {
        "color": "#000000"
      },{
        "lightness": 40
      }]
    }, {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [{
        "visibility": "on"
      }, {
        "color": "#000000"
      }, {
        "lightness": 16
      }]
    }, {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [{
      "color": "#000000"
        }, {
          "lightness": 20
        }]
      }, {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 17
        }, {
          "weight": 1.2
        }]
      }, {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#ffffff"
        }]
      }, {
        "featureType": "administrative.country",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#ff0000"
        }, {
          "visibility": "off"
        }]
      }, {
        "featureType": "administrative.province",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#ff0000"
        }]
      }, {
        "featureType": "administrative.province",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{
          "visibility": "on"
        }, {
          "color": "#ffffff"
        }, {
          "weight": "0.01"
        }]
      }, {
        "featureType": "administrative.locality",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.fill",
        "stylers": [{
          "visibility": "on"
        }, {
          "color": "#ffffff"
        }]
      }, {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 20
        }]
      }, {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#000000"
        }]
      }, {
        "featureType": "landscape.man_made",
        "elementType": "labels.text.fill",
        "stylers": [{
        "visibility": "on"
        }, {
          "color": "#808080"
        }]
      }, {
        "featureType": "landscape.man_made",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#000000"
        }]
      }, {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry",
        "stylers": [{
          "visibility": "on"
        }]
      }, {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#000000"
        }]
      }, {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry",
        "stylers": [{
          "visibility": "on"
        }]
      }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
        "color": "#000000"
        }, {
          "lightness": 21
        }]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#ffffff"
        }, {
          "lightness": 17
        }]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 29
      }, {
        "weight": "0.01"
      }]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 18
      }]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{
        "visibility": "on"
      }, {
        "color": "#808080"
      }]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [{
        "hue": "#ff0000"
      }]
      }, {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [{
        "color": "#ffffff"
      }]
      }, {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 16
      }]
      }, {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 19
      }]
      }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
        "lightness": 17
	      }, {
	        "color": "#212121"
	      }]
    }
  ]};
  var bounds = new google.maps.LatLngBounds();
  var mapElement = document.getElementById('performer_map');
  var map = new google.maps.Map(mapElement, mapOptions);              
  /*var locations = [
  {"lat":41.90278349999999,
  "lng":12.496365500000024,
  "marker":{"url":"/images/avnode_marker.svg",
    "scaledSize":{"width":46,"height":78,"f":"px","b":"px"},
    "origin":{"x":0,"y":0},"anchor":{"x":23,"y":78}},
  },
  {"lat":52.3702157,
  "lng":4.895167899999933,
  "marker":{"url":"/images/avnode_marker.svg",
    "scaledSize":{"width":46,"height":78,"f":"px","b":"px"},
    "origin":{"x":0,"y":0},"anchor":{"x":23,"y":78}},
  }];*/
  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      icon: locations[i].marker,
      position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
      map: map,                
      });
    markersArray.push(marker);
    
    bounds.extend(marker.position);              
  }
    google.maps.event.addListener(map, 'zoom_changed', function() {
      zoomChangeBoundsListener = 
          google.maps.event.addListener(map, 'bounds_changed', function(event) {
              if (this.getZoom() > 15 && this.initialZoom == true) {                            
                  this.setZoom(7);
                  this.initialZoom = false;
              }
          google.maps.event.removeListener(zoomChangeBoundsListener);
      });
  });
  map.initialZoom = true;          
  map.fitBounds(bounds);

}