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
    static counterID = 0;
    // Declare private parametes
    #name = '';
    #latitude = 0;
    #longitude = 0;
    #tag = '';
    #id = '';

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
        this.#tag = tag
        this.#id = GeoTag.counterID++;
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

    /**
     * Getter method for the id of the GeoTag.
     * @return {number} the id of the GeoTag.
     */
    get id() {
        return this.#id;
    }


    // Setter mathods

    /**
     * Setter method for the name of the GeoTag.
     * @param {string} myName the new name of the GeoTag
     */
    set name(myName) {
        this.#name = myName;
    }

    /**
     * Setter method for the latitude of the GeoTag.
     * @param {number} myLat the new name of the GeoTag
     */
    set latitude(myLat) {
        this.#latitude = myLat;
    }

    /**
     * Setter method for the longitude of the GeoTag.
     * @param {number} myLon the new name of the GeoTag
     */
    set longitude(myLon) {
        this.#longitude = myLon;
    }

    /**
     * Setter method for the tag of the GeoTag.
     * @param {string} myTag the new name of the GeoTag
     */
    set tag(myTag) {
        this.#tag = myTag;
    }

    toJSON() {
        // Definiere eine benutzerdefinierte JSON-Repräsentation
        return {
            latitude: this.latitude,
            longitude: this.longitude,
            name: this.name,
            tag: this.tag,
            id: this.id
        };
    }

    isEqual(geoTag) {
        if(geoTag == undefined) {
            throw new Error('Tried comparing two GeoTags, but one is undefined.');
        }
        return(
            this.name === geoTag.name
            && this.tag === geoTag.tag
            && this.latitude === geoTag.latitude
            && this.longitude === geoTag.longitude
        );
    }
}
module.exports = GeoTag;