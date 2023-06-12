// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.
let scriptsToLoad = ['./javascripts/map-manager.js', './javascripts/location-helper.js', 'https://cdn.jsdelivr.net/npm/geolib/dist/geolib.min.js'];

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...
function updateLocation() {
    try{
        //Get input elements from Tagging container
        let tagging_latitude_element = document.getElementById("latitude");
        let tagging_longitude_element = document.getElementById("longitude");

        //Get input elements from Discovery container
        let discovery_latitude_element = document.getElementById("discovery_latitude");
        let discovery_longitude_element = document.getElementById("discovery_longitude");

        //Get map element
        let map_element = document.getElementById("mapView");
        let tagging_location = {latitude: tagging_latitude_element.getAttribute("value"), longitude: tagging_longitude_element.getAttribute("value")};
        let discovery_location = {latitude: discovery_latitude_element.getAttribute("value"), longitude: discovery_longitude_element.getAttribute("value")};
        let latitude;
        let longitude;

        function updateDOCElements() {
            //Set input elements
            tagging_latitude_element.setAttribute("value",latitude);
            tagging_longitude_element.setAttribute("value",longitude);
            discovery_latitude_element.setAttribute("value",latitude);
            discovery_longitude_element.setAttribute("value",longitude);

            //Map generation
            let taglist_json = map_element.getAttribute("data-tags");
            let GeoTagsArray = JSON.parse(taglist_json);
            let newMapURL = new MapManager("0kxBbT8geCAawUpZoWmJT2RJehiouJBN").getMapUrl(latitude,longitude, GeoTagsArray, 16);
            map_element.setAttribute("src",newMapURL)
        }

        if (isCoordinates(tagging_location)) {
            latitude = tagging_location.latitude;
            longitude = tagging_location.longitude;
            updateDOCElements();
        } else if (isCoordinates(discovery_location)) {
            latitude = discovery_location.latitude;
            longitude = discovery_location.longitude;
            updateDOCElements();
        } else {
            LocationHelper.findLocation(  (locationHelper) => {
                //Get coordinates from LocationHelper
                latitude = locationHelper.latitude;
                longitude = locationHelper.longitude;
                updateDOCElements();
            });
        }
    }
    catch(error) {
        alert("error in updateLocation()");
    }
}

//function isCoordinates(variable) {
//    const coordinatesRegex = /^(-?[0-9]|[1-8][0-9]|90)\.\d{1,15}$/;
//    return typeof variable === 'string' && coordinatesRegex.test(variable);
//}

function isCoordinates(location) {
    // Check if location is an object
    if (typeof location !== 'object' || location === null) {
        return false;
    }
    // Check if location has latitude and longitude properties
    if (!location.hasOwnProperty('latitude') || !location.hasOwnProperty('longitude')) {
        return false;
    }

    // Check that latitude and longitude are numeric values
    if ( (typeof parseFloat(location.latitude)) !== 'number'
        || (typeof parseFloat(location.longitude)) !== 'number'
        || isNaN(parseFloat(location.latitude))
        || isNaN(parseFloat(location.longitude)) ) {
        return false;
    }

    if (parseFloat(location.latitude) < -90 || parseFloat(location.latitude) > 90) {
        return false;
    }
    if (parseFloat(location.longitude) < -180 || parseFloat(location.longitude) > 180) {
        return false;
    }

    return true;
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    let numLoadedScripts = 0;
    scriptsToLoad.forEach((src) => {
        let script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            numLoadedScripts++;
            if (numLoadedScripts === scriptsToLoad.length) {
                updateLocation();
            }
        };
        document.body.appendChild(script);
    });
});

// Define the currentPage variable outside the functions
var currentPage = 1;

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    updatePage();
  }
}

function nextPage() {
  var totalPages = parseInt(document.getElementById('totalPages').textContent);
  if (currentPage < totalPages) {
    currentPage++;
    updatePage();
  }
}

function updatePage() {
  var taglist = JSON.parse(document.getElementById('mapView').getAttribute('data-tags'));
  var resultList = document.getElementById('discoveryResults');
  resultList.innerHTML = '';

  taglist.slice((currentPage - 1) * 5, (currentPage - 1) * 5 + 5).forEach(function(gtag) {
    var li = document.createElement('li');
    li.innerHTML = gtag.name + ' (' + gtag.latitude + ',' + gtag.longitude + ') ' + gtag.tag;
    resultList.appendChild(li);
  });

  document.getElementById('currentPage').textContent = currentPage;
}
