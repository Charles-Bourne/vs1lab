// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const myStorage = new GeoTagStore();

// App routes (A3)
/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */
// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  const defaultTaglist = myStorage.AllGeoTags;
  const location = {latitude: "XXXXXXXXXXX", longitude: "XXXXXXXXXXX"};

  res.render('index', { taglist: defaultTaglist, currentlocation: location })
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags
 * by radius around a given location.
 */
router.post('/tagging', (req, res) => {
  const { latitude, longitude, name, hashtag } = req.body;
  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag);
  const location = {latitude: latitude, longitude: longitude};

  myStorage.addGeoTag(newGeoTag);
  const taglist = myStorage.getNearbyGeoTags(location);

  res.render('index.ejs', { taglist, currentlocation: location });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain
 * the term as a part of their names or hashtags.
 * To this end, "GeoTagStore" provides methods to search geotags
 * by radius and keyword.
 */
router.post('/discovery', (req, res) => {
  const { latitude, longitude,  searchterm } = req.body;
  const location = {latitude: latitude, longitude: longitude};

  const taglist = myStorage.searchNearbyGeoTags(location, searchterm);

  res.render('index.ejs', { taglist, currentlocation: location });
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */
// TODO: ... your code here ...
router.get('/api/geotags', (req, res) => {
  const { searchterm, latitude, longitude, pagenumber } = req.query;
  let taglist = myStorage.AllGeoTags;
  let location = {latitude: latitude, longitude: longitude};

  if (latitude && longitude && searchterm) {
    taglist = myStorage.searchNearbyGeoTags(location, searchterm);
  } else if (latitude && longitude) {
    taglist = myStorage.getNearbyGeoTags(location);
  } else if (searchterm) {
    //Only Searchterm is not supported
  }

  if (pagenumber) {
    let taglistLength = taglist.length;
    let maxPages = Math.ceil(taglistLength / 5);
    if (pagenumber > maxPages || pagenumber < 1) {
      res.status(404).json({ error: "page not valid" })
    } else {
      var anfang = (pagenumber-1)*5;
      var ende = pagenumber*5;
      if(taglistLength >= ende) {
        taglist = taglist.slice(anfang, ende);
      } else {
        taglist = taglist.slice(anfang, taglistLength);
      }
      res.status(200).json({taglist, maxPages});
    }
  } else {
    res.status(200).json(taglist);
  }
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */
// TODO: ... your code here ...
router.get('/api/geotags/:id', (req, res) => {
  const { id } = req.params;
  const geoTag = myStorage.getGeoTagByID(id)

  if (geoTag) {
    res.status(200).json(geoTag);
  } else {
    res.status(404).json({ error: 'GeoTag not found' });
  }
});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */
// TODO: ... your code here ...
router.post('/api/geotags', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;
  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag);

  try {
    myStorage.addGeoTag(newGeoTag);
    res.status(201).location(`/api/geotags/${newGeoTag.id}`).json(newGeoTag);
  } catch (error) {
    res.status(409);
  }
});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */
// TODO: ... your code here ...
router.put('/api/geotags/:id', (req, res) => {
  const { id } = req.params;
  const { name, latitude, longitude, hashtag } = req.body;

  try {
    const geoTag = myStorage.updateGeoTag(id, name, latitude, longitude, hashtag);
    res.status(200).json(geoTag)
  } catch (error) {
    res.status(404).json({ error: error.toString() });
  }
});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */
// TODO: ... your code here ...
router.delete('/api/geotags/:id', (req, res) => {
  const { id } = req.params;
  const geoTag = myStorage.getGeoTagByID(id);

  try {
    myStorage.removeGeoTag(id)
    res.status(200).json(geoTag)
  } catch (error) {
    res.status(404).json({ error: error.toString() });
  }
});

module.exports = router;
