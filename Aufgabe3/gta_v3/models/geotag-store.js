// File origin: VS1LAB A3

const GeoTagExamples = require("./geotag-examples");

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

    
    #currentTags = [];

    /**
     * Generate a GeoTagStore with the example tags from geotag-examples
     */
    InMemoryGeoTagStore() {
        let examples = new(GeoTagExamples);
        let exampleList = examples.tagList();

        for (let ex of exampleList) {
            this.#currentTags.push(new GeoTag(ex[0], ex[1], ex[2], ex[3]));
        }
    }


    // Provide a method 'addGeoTag' to add a geotag to the store.
    /**
     * Adds a GeoTag to the currentTags array.
     * @param {GeoTag} geoTag to be added to the store.
     */
    addGeoTag(geoTag) {
        this.#currentTags.push(geoTag);
    }


    // Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
    /**
     * Delete GeoTags from the store by name.
     * @param {string} geoTagName the name of the GeoTag to be deleted from the store
     */
    removeGeoTag(geoTagName) {

        let index = 0;
        // Count up "index" until the index of the geoTag with the name was found.
        while(this.#currentTags[index].getName() != geoTagName) {
            index++;
        }

        // Split the array into the part before the Geotag and the part after and concatenate
        // those two halves. We are cutting out the element thatshould be removed,
        this.#currentTags = this.#currentTags.slice(0, index).concat(this.#currentTags.slice(index+1));

    }


    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    // Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
    // - The location is given as a parameter.
    // - The proximity is computed by means of a radius around the location.
    /**
     * Return the Tags that are closeby to the given location
     * @param {*} location The GeoTags should be close to that location.
     * @returns {} An array of the Tags that are close to the given location
     */
    getNearbyGeoTags(location) {
        // Declare size of radius
        let distance = 3;
        // Create empty list of GeoTags
        let nearbyGeoTags = [];

        // Check for each of Tag in the currentlist
        for (const element of this.#currentTags) {
           
            // Calculate the distance of the locations via the following calculation:
            // d = sqrt((x2​−x1​)^2 + (y2​−y1​)^2)
            // Assuming that location[0] is the latitude and location[1] is the longitude
            let d = sqrt(pow((element.getLatitude()-location[0]), 2) + pow((element.getLongitude()-location[1]), 2));
            if (d <= distance) {
                nearbyGeoTags.push(element);
            }

            return nearbyGeoTags;
        }

    }


    // Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
    // - The proximity constrained is the same as for 'getNearbyGeoTags'.
    // - Keyword matching should include partial matches from name or hashtag fields. 
    /**
     * Searh the Tags closeby that match the given keyword
     * @param {*} location The GeoTags should be close to that location.
     * @param {string} keyword that should be included in either the name or the hashtag of the GeoTag.
     * @returns An array with the GeoTags that are close to the location and match the keyword.
     */
    searchNearbyGeoTags(location, keyword) {

        // Get the tags that are closeby        
        let nearbyTags = getNearbyGeoTags(location);

        // Create resultArray
        let matchingTags = [];

        // check the closeby Tags if they fit the keyword
        for (const el of nearbyTags) {
            if (el.getTag().includes(keyword) || el.getName().includes(keyword)) {
                matchingTags.push(el);
            }
        }

        return matchingTags;
    }

}

module.exports = InMemoryGeoTagStore
