/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class Base class for all objects in the AllPlayers API system.
   *
   * @param {@link allplayers.api} api The API interface.
   * @param {object} options The options for this class.
   */
  allplayers.base = function(api, options) {

    /** The API interface */
    this.api = api;

    /** Store the options for this component */
    this.options = options;
  };

  /**
   * Method for printing out log statements.
   */
  allplayers.base.prototype.log = function(text) {

    // For now, just use console, but we may want to change this...
    console.log(text);
  };

}(jQuery));


