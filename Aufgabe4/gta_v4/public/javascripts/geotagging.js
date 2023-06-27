// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.
let scriptsToLoad = ['./javascripts/map-manager.js', './javascripts/location-helper.js', 'https://cdn.jsdelivr.net/npm/geolib/dist/geolib.min.js'];
let lastSearchterm;

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

function getTags() {
  var latitude = document.getElementById("latitude").value;
  var longitude = document.getElementById("longitude").value;
  var currentSearchterm = document.getElementById("searchterm").value;
  var pageNumber = document.getElementById("currentPage").innerHTML;

  if (lastSearchterm != currentSearchterm) {
      lastSearchterm = currentSearchterm;
      pageNumber = 1;
      document.getElementById("currentPage").innerHTML = pageNumber;
  }

        // Build the URL with query parameters
  var url = "/api/geotags";
  url += "?latitude=" + encodeURIComponent(latitude);
  url += "&longitude=" + encodeURIComponent(longitude);
  url += "&searchterm=" + encodeURIComponent(currentSearchterm);
  url += "&pagenumber=" + encodeURIComponent(pageNumber);

  fetch(url)
    .then(function (response) {
      let map_element = document.getElementById("mapView");
      response.json().then(function (data) {
        var jsonTaglist = JSON.parse(JSON.stringify(data))["taglist"];
        var jsonPageNumber = JSON.parse(JSON.stringify(data))["maxPages"];
        map_element.setAttribute("data-tags", JSON.stringify(jsonTaglist));
        updateLocation();
        updateTaglist(jsonTaglist);
        document.getElementById("totalPages").innerHTML = jsonPageNumber;
      });
    })
    .catch(function (error) {
      console.error("Network error:", error);
    });
}


function updateTaglist(data) {
  var taglistElement = document.getElementById("discoveryResults");
  taglistElement.innerHTML = "";

  data.forEach(function (tag) {
    var li = document.createElement("li");
    li.textContent = tag.name + " (" + tag.latitude + "," + tag.longitude + ") " + tag.tag ;
    taglistElement.appendChild(li);
  });
}
  

function submitTags() {

    var latitude = document.getElementById("latitude").value;
    var longitude = document.getElementById("longitude").value;
    var name = document.getElementById("name").value;
    var hashtag = document.getElementById("hashtag").value;

    fetch("/api/geotags", {
      method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
      body: JSON.stringify({
        name: name,
        latitude: latitude,
        longitude: longitude,
        hashtag: hashtag,
      }),
    })
      .then(function(response) {
        getTags();
      })
      .catch(function(error) {
        // Handle network errors
        console.error("Network error:", error);
      });
  }

function prevPage() {
  var pageNumber = document.getElementById("currentPage").innerHTML;
  var newPageNumber = parseInt(pageNumber) - 1;
  if(pageNumber > 1){
    document.getElementById("currentPage").innerHTML = newPageNumber;
  getTags();
  }
}

function nextPage() {
  var pageNumber = document.getElementById("currentPage").innerText;
  var newPageNumber = parseInt(pageNumber) + 1;
  if(pageNumber < document.getElementById("totalPages").innerHTML){
    document.getElementById("currentPage").innerHTML = newPageNumber;
  getTags();
  }
}