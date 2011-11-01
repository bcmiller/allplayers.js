/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The class to govern all location functionality and data.
   *
   * @extends allplayers.entity
   * @param {@link allplayers.api} api The API interface.
   * @param {object} options The options for this class.
   */
  allplayers.location = function(options) {

    /** Street Address. */
    this.street = '';

    /** City */
    this.city = '';

    /** State / Province */
    this.state = '';

    /** Postal Code */
    this.zip = '';

    /** Country */
    this.country = '';

    /** Latitude */
    this.latitude = '';

    /** Longitude */
    this.longitude = '';

    // Derive from allplayers.entity.
    allplayers.entity.call(this, options);
  };

  // Create the proper derivation.
  allplayers.location.prototype = new allplayers.entity();
  allplayers.location.prototype.constructor = allplayers.location;

}(jQuery));
