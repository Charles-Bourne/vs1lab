// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.
let scriptsToLoad = ['./javascripts/map-manager.js', './javascripts/location-helper.js', 'https://cdn.jsdelivr.net/npm/geolib/dist/geolib.min.js'];

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

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

function getTags(event) {
    event.preventDefault(); // Prevent the default form submission
  
    var latitude = document.getElementById("latitude").value;
    var longitude = document.getElementById("longitude").value;
    var searchTerm = document.getElementById("searchterm").value;
  
    var url = "/api/geotags";
  
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "latitude": latitude,
        "longitude": longitude,
        "searchterm": searchTerm
      },
    })
      .then(function(response) {
        let map_element = document.getElementById("mapView");

        console.log(map_element.getAttribute("data-tags"));
        
        response.json().then(data => {
            console.log(data);
            map_element.setAttribute("data-tags", JSON.parse(data));
            updateLocation();
        })
      })
      .then(function(data) {
        console.log(data);
        // Process the response data
      })
      .catch(function(error) {
        // Handle network errors
        console.error("Network error:", error);
      });
  }
  

function submitTags(event) {
    event.preventDefault(); // Prevent the default form submission

    var latitude = document.getElementById("latitude").value;
    var longitude = document.getElementById("longitude").value;
    var name = document.getElementById("name").value;
    var hashtag = document.getElementById("hashtag").value;

    fetch("/api/geotags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: "latitude=" + encodeURIComponent(latitude) +
            "&longitude=" + encodeURIComponent(longitude) +
            "&name=" + encodeURIComponent(name) +
            "&hashtag=" + encodeURIComponent(hashtag)
    })
      .then(function(response) {
        console.log(response);
        if (response.ok) {
          // Handle the successful response
          updateLocation();
        } else {
          // Handle the error response
          console.error("Failed to add tag");
        }
      })
      .catch(function(error) {
        // Handle network errors
        console.error("Network error:", error);
      });
  }