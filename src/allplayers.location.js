/** The allplayers namespace. */
var allplayers = allplayers || {};

/**
 * @constructor
 * @extends drupal.entity
 * @class The class to govern all location functionality and data.
 *
 * @param {object} object The location information.
 * @param {function} callback The function to be called once the node has
 * been retrieved from the server.
 */
allplayers.location = function(object, callback) {

  // Only continue if the object is valid.
  if (object) {

    /** Street Address. */
    this.street = this.street || '';

    /** City */
    this.city = this.city || '';

    /** State / Province */
    this.state = this.state || '';

    /** Postal Code */
    this.zip = this.zip || '';

    /** Country */
    this.country = this.country || '';

    /** Latitude */
    this.latitude = this.latitude || '';

    /** Longitude */
    this.longitude = this.longitude || '';
  }

  // Derive from drupal.entity.
  drupal.entity.call(this, object, callback);
};

/** Derive from drupal.entity. */
allplayers.location.prototype = new drupal.entity();

/** Reset the constructor */
allplayers.location.prototype.constructor = allplayers.location;
