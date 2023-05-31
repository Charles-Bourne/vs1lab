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

        if (isCoordinates(tagging_latitude_element.getAttribute("value"))
            && isCoordinates(tagging_longitude_element.getAttribute("value")) 
            && isCoordinates(discovery_latitude_element.getAttribute("value")) 
            && isCoordinates(discovery_longitude_element).getAttribute("value")) {
            console.log("function updateLocation() is aborted. Nothing to do.");
            return;
        }
        
        LocationHelper.findLocation((locationHelper) => {
            //Get coordinates from LocationHelper
            let latitude = locationHelper.latitude;
            let longitude = locationHelper.longitude;

            //Set input elements
            tagging_latitude_element.setAttribute("value",latitude);
            tagging_longitude_element.setAttribute("value",longitude);
            discovery_latitude_element.setAttribute("value",latitude);
            discovery_longitude_element.setAttribute("value",longitude);

            //Map generation
            let taglist_json = map_element.getAttribute("data-tags");
            let GeoTagsArray = JSON.parse(taglist_json);
            let newMapURL = new MapManager("0kxBbT8geCAawUpZoWmJT2RJehiouJBN").getMapUrl(latitude,longitude, GeoTagsArray, 13);
            map_element.setAttribute("src",newMapURL)
        });
    }
    catch(error) {
        alert("error in updateLocation()");
    }
}

function isCoordinates(variable) {
    const coordinatesRegex = /^(-?[0-9]|[1-8][0-9]|90)\.\d{1,15}$/;
    return typeof variable === 'string' && coordinatesRegex.test(variable);
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
    //alert("Please change the script 'geotagging.js'");
});