/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The event class to govern all functionality that events have.
   *
   * @extends allplayers.entity
   * @param {object} eventInfo The event information.
   */
  allplayers.event = function(eventInfo) {

    /** Set to TRUE if this is an all day event */
    this.allDay = false;

    /** An array of group UUID's that have this Event. */
    this.gids = [];

    /** An array of resource UUID's that are associated with this Event.*/
    this.resources = [];

    /**
     * An associative array of competitor information, where the key is the
     * UUID of the competitor and each entry contains a label and score like
     * the following.
     *
     * <pre><code>
     *   var competitors = {
     *     '123456789' => {
     *       'label':'Competitor 1',
     *       'score':5
     *     },
     *     '232342342' => {
     *       'label':'Competitor 2',
     *       'score':10
     *     }
     *   };
     * </code></pre>
     */
    this.competitors = {};

    /**
     * <p>The category of this event.</p>
     * <ul>
     * <li>Game</li>
     * <li>Meeting</li>
     * <li>Other</li>
     * <li>Party</li>
     * <li>Practice</li>
     * <li>Scrimmage</li>
     * </ul>
     * <p><em>Game</em> and <em>Scrimmage</em> categories require competitors
     * array to be passed and will override the title.</p>
     */
    this.category = eventInfo.category ? eventInfo.category : 'Other';

    /** The date-time object */
    this.date = new allplayers.date(eventInfo.start, eventInfo.end);
    this.start = this.date.start;
    this.end = this.date.end;

    // Derive from allplayers.entity.
    allplayers.entity.call(this, eventInfo);
  };

  // Create the proper derivation.
  allplayers.event.prototype = new allplayers.entity();
  allplayers.event.prototype.constructor = allplayers.event;

  /**
   * Gets an event.
   */
  allplayers.event.prototype.get = function(callback) {

    // Get the event from the API.
    var _this = this;
    allplayers.api.getEvent(this.uuid, {}, function(object) {
      _this.update(object);
      callback(_this);
    });
  };

  /**
   * Save an event to the database.
   */
  allplayers.event.prototype.save = function(callback) {

    // Call the api event save function.
    this.date.start = this.start;
    this.date.end = this.end;
    var _this = this;
    allplayers.api.saveEvent(this.getObject(), function(object) {
      _this.update(object);
      callback(_this);
    });
  };

  /**
   * @see allplayers.entity#update
   */
  allplayers.event.prototype.update = function(date) {

    // Call the entity first.
    allplayers.entity.prototype.update.call(this, date);

    // Now update the start and end dates.
    this.date.update(date.start, date.end);
  };


  /**
   * @see allplayers.entity#getObject
   */
  allplayers.event.prototype.getObject = function() {
    return $.extend(allplayers.entity.prototype.getObject.call(this), {
      gids: this.gids,
      resources: this.resources,
      category: this.category,
      competitors: this.competitors,
      date_time: this.date.getObject()
    });
  };

}(jQuery));
