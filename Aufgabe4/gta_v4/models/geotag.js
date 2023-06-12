// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
    // Declare private parametes
    #name = '';
    #latitude = 0;
    #longitude = 0;
    #tag = '';
    #id = (this.name + this.latitude + this.longitude + this.tag).toString().toLowerCase();

    /**
     * Generate a GeoTag for the specified parameters.
     * @param {string} name The name of the GeoTag
     * @param {number} latitude The GeoTags latitude
     * @param {number} longitude The mGeoTags longitude
     * @param {string} tag The GeoTags hashtag
     */
    constructor (name, latitude, longitude, tag) {
        this.#name = name;
        this.#latitude = latitude;
        this.#longitude = longitude;
        this.#tag = tag;
    }

    // Getter methods
    
    /**
     * Getter method for the name of the GeoTag.
     * @return {string} the name of the GeoTag.
     */
    get name() {
        return this.#name;
    }

    /**
     * Getter method for the latitude of the GeoTag.
     * @return {number} the latitude of the GeoTag.
     */
    get latitude() {
        return this.#latitude;
    }

    /**
     * Getter method for the longitude of the GeoTag.
     * @return {number} the longitude of the GeoTag.
     */
    get longitude() {
        return this.#longitude;
    }

    /**
     * Getter method for the hashtag of the GeoTag.
     * @return {string} the hashtag of the GeoTag.
     */
    get tag() {
        return this.#tag;
    }

    get id() {
        return this.#id;
    }

    toJSON() {
        // Definiere eine benutzerdefinierte JSON-Repräsentation
        return {
            latitude: this.latitude,
            longitude: this.longitude,
            name: this.name
        };
    }
}

//['Castle', 49.013790, 8.404435, '#sight']
// name, latitute, longitute, tag

module.exports = GeoTag;