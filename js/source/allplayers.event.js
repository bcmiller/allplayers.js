/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The event class to govern all functionality that events have.
   *
   * @extends allplayers.entity
   * @param {@link allplayers.api} api The API interface.
   * @param {object} options The options for this class.
   * @param {object} eventInfo The event information.
   */
  allplayers.event = function(api, options, eventInfo) {

    /** All day flag */
    this.allDay = false;

    /** The start time */
    this.start = null;

    /** The end time */
    this.end = null;

    // Derive from allplayers.entity.
    allplayers.entity.call(this, api, options);

    // Check to make sure the end and start in info are Date objects.
    if (typeof eventInfo.start === 'string') {
      eventInfo.start = new Date(eventInfo.start);
    }

    if (typeof eventInfo.end === 'string') {
      eventInfo.end = new Date(eventInfo.end);
    }

    // Update the data.
    this.update(eventInfo);
  };

  // Create the proper derivation.
  allplayers.event.prototype = new allplayers.entity();
  allplayers.event.prototype.constructor = allplayers.event;

  /**
   * Save an event to the database.
   */
  allplayers.event.prototype.save = function() {

    // Call the api event save function.
    this.api.saveEvent(this);
  };

}(jQuery));
