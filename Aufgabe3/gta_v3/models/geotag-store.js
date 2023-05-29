// File origin: VS1LAB A3

const GeoTagExamples = require("./geotag-examples");

const GeoTag = require('../models/geotag');

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
class InMemoryGeoTagStore{

    // Use private array
    #currentTags = [];

    /**
     * Generate a GeoTagStore with the example tags from geotag-examples
     */
    constructor() {
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
        return this.#currentTags;
    }


    /**
     * Adds a GeoTag to the currentTags array.
     * @param {GeoTag} geoTag to be added to the store.
     */
    addGeoTag(geoTag) {
        this.#currentTags.push(geoTag);
    }


    /**
     * Delete GeoTags from the store by name.
     * @param {string} geoTagName the name of the GeoTag to be deleted from the store
     */
    removeGeoTag(geoTagName) {

        let index = 0;
        // Count up "index" until the index of the geoTag with the name was found.
        while(this.#currentTags[index].name !== geoTagName) {
            index++;
        }

        // Split the array into the part before the Geotag and the part after and concatenate
        // those two halves. We are cutting out the element that should be removed,
        this.#currentTags = this.#currentTags.slice(0, index).concat(this.#currentTags.slice(index+1));

    }


    /**
     * Returns all geotags in the proximity of a location.
     * The proximity is computed by means of a radius around the location.
     * @param {*} location The GeoTags should be close to that location.
     * @returns {} An array of the Tags that are close to the given location
     */
    getNearbyGeoTags(location) {
        // Declare size of radius
        let distance = 500;
        // Create empty list of GeoTags
        let nearbyGeoTags = [];

        // Check for each of Tag in the currentlist
        for (const element of this.#currentTags) {
           
            // Calculate the distance of the locations via the following calculation:
            // d = sqrt((x2​−x1​)^2 + (y2​−y1​)^2)
            let d = Math.sqrt(Math.pow((location.latitude, 2) + Math.pow(location.longitude, 2)));
            if (d <= distance) {
                nearbyGeoTags.push(element);
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

        // check the closeby Tags if they fit the keyword
        for (const el of nearbyTags) {
            if (el.tag.includes(keyword) || el.name.includes(keyword)) {
                matchingTags.push(el);
            }
        }

        return matchingTags;
    }

}

module.exports = InMemoryGeoTagStore
