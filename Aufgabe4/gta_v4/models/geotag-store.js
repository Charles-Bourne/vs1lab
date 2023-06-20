// File origin: VS1LAB A3

const GeoTagExamples = require("./geotag-examples");

const GeoTag = require('../models/geotag');
const Console = require("console");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore {

    // Use private array
    // Define the static variable outside the class
    static #currentTags = undefined;

    /**
     * Generate a GeoTagStore with the example tags from geotag-examples
     */
    constructor() {
        if (InMemoryGeoTagStore.#currentTags !== undefined) {
            return;
        }

        InMemoryGeoTagStore.#currentTags = [];
        // Get Examplelist from GeoTagExamples 
        const exampleList =  GeoTagExamples.tagList;

        // Read the examples into the currentTags-Array
        for (let ex of exampleList) {
            //this.addGeoTag(new GeoTag(ex[0], ex[1], ex[2], ex[3]))
            this.addGeoTag(new GeoTag(ex[0], ex[1], ex[2], ex[3]))
        }
    }

    /**
     * Getter-Mehtod for the private currentTags array.
     */
    get AllGeoTags() {
        return InMemoryGeoTagStore.#currentTags;
    }

    /**
     * returns the GeoTag with the given id
     * @param {number} id 
     * @returns matching GeoTag or undefined if no GeoTag was found
     * @throws Error if given id is undefined
     */
    getGeoTagByID(id) {
        if(id == undefined) {
            throw new Error('The given ID is undefined');
        }

        // Create resultArray
        const matchingTags = this.AllGeoTags.filter((tag) => {
            //const nameMatch = tag.id.includes(id && id.toLowerCase());
            //console.log("tag.id == id: " + tag.id + " =?= " + id + " = " + (tag.id == id))
            return tag.id == id;
        });

        return matchingTags[0];
    }

    /**
     * Adds a GeoTag to the currentTags array.
     * @param {GeoTag} geoTag to be added to the store.
     * @throws {Error} when the Tag already exists in the array
     */
    addGeoTag(geoTag) {
        // Check if the Tag exists already
        // Since IDs are always unique, we need to compare the whole GeoTags
        for (let tag of InMemoryGeoTagStore.#currentTags) {
            if(tag.isEqual(geoTag)) {
                throw new Error('This Tag already exists');
            }
        }
        
        InMemoryGeoTagStore.#currentTags.push(geoTag);
    }


    /**
     * Delete GeoTags from the store by name.
     * @param {string} geoTagName the name of the GeoTag to be deleted from the store
     */
    removeGeoTag(id) {
        if (this.getGeoTagByID(id) == undefined) {
            throw new Error('The given ID does not match any GeoTags');
        }

        let index = 0;
        // Count up "index" until the index of the geoTag with the name was found.
        while(InMemoryGeoTagStore.#currentTags[index].id !== id) {
            index++;
        }

        // Split the array into the part before the Geotag and the part after and concatenate
        // those two halves. We are cutting out the element that should be removed,
        InMemoryGeoTagStore.#currentTags = InMemoryGeoTagStore.#currentTags.slice(0, index).concat(InMemoryGeoTagStore.#currentTags.slice(index+1));
    }

    /**
     * Update a GeoTag by giving it's id and the new properties
     * @param {number} id the ID of the GeoTag you want to change
     * @param {string} name the new name 
     * @param {number} lat the new latitude 
     * @param {number} long the new longitude 
     * @param {string} tag the new tag
     * @throw Error if one of the parameters is undefined or if there is no 
     *      GeoTag with the given ID number
     */
    updateGeoTag(id, name, lat, long, tag) {
        // Check if the Parameters are undefined
        if(id == undefined || name == undefined || lat == undefined || tag == undefined) {
            throw new Error('One of the given parameters is undefined.');
        }
        // Create new GeoTag
        let current = this.getGeoTagByID(id);

        // If there is no GeoTag with the given ID, throw error
        if(current == undefined) {
            throw new Error('The given ID does not match any GeoTags');
        }

        // Change properties od the GeoTag
        current.name(name);
        current.latitude(lat);
        current.longitude(long);
        current.tag(tag);
        return current;
    }

    /**
     * Calculate the distance between two locations in km
     * @param {location} locationOne first location
     * @param {location} locationTwo second location
     * @returns {number} the distance between the two locations in km
     */
    getDistanceBetween(locationOne, locationTwo) {
        let lat1 = locationOne.latitude;
        const lon1 = locationOne.longitude;
        let lat2 = locationTwo.latitude;
        const lon2 = locationTwo.longitude;

        /* 
            Use the haversine formula:
        */

        // Distance between the latitudes and longitudes:
        let dLat = (lat2 - lat1) * Math.PI / 180.0;
        let dLon = (lon2 - lon1) * Math.PI / 180.0;
           
        // Convert them to radians:
        lat1 = (lat1) * Math.PI / 180.0;
        lat2 = (lat2) * Math.PI / 180.0;
         
        // Apply formular
        let a = Math.pow(Math.sin(dLat / 2), 2) +
                   Math.pow(Math.sin(dLon / 2), 2) *
                   Math.cos(lat1) *
                   Math.cos(lat2);

        let c = 2 * Math.asin(Math.sqrt(a));

        let distance = 6371 * c; // 6371 = radius of earth
        
        return distance;
    }


    /**
     * Returns all geotags in the proximity of a location.
     * The proximity is computed by means of a radius around the location.
     * @param {*} location The GeoTags should be close to that location.
     * @returns {array} An array of the Tags that are close to the given location
     */
    getNearbyGeoTags(location) {
        // Declare size of radius in km
        let maxDistance = 5;
        // Create empty list of GeoTags
        let nearbyGeoTags = [];

        // Check for each of Tag in the currentlist
        for (const el of InMemoryGeoTagStore.#currentTags) {


            // Calculate the distance of the current tag and the current location of the user
            const tagDistance = this.getDistanceBetween({latitude: el.latitude, longitude: el.longitude}, {latitude: location.latitude, longitude: location.longitude});
            // Add tag to nearbyGeoTags list if distance under maxDistance
            if (tagDistance <= maxDistance) {
                nearbyGeoTags.push(el);
            }
        }

        return nearbyGeoTags;
    }

    /**
     * Searh the Tags closeby that match the given keyword
     * The keyword matching should include partial matches from name or hashtag fields. 
     * @param {*} location The GeoTags should be close to that location.
     * @param {string} keyword that should be included in either the name or the hashtag of the GeoTag.
     * @returns An array with the GeoTags in the proximity of a location that match a keyword.
     */
    searchNearbyGeoTags(location, keyword) {
        // Get the tags that are closeby
        let nearbyTags = this.getNearbyGeoTags(location);

        // Create resultArray
        let matchingTags = [];

        matchingTags = nearbyTags.filter((tag) => {
            const nameMatch = tag.name.toLowerCase().includes(keyword && keyword.toLowerCase());
            const tagMatch = tag.tag.toLowerCase().includes(keyword && keyword.toLowerCase());
            return nameMatch || tagMatch;
        });

        return matchingTags;
    }
}

module.exports = InMemoryGeoTagStore
