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

    /** An array of group UUID's that have this Event. */
    this.gids = [];

    /** An array of resource UUID's that are associated with this Event.*/
    this.resources = [];

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

    /** The date-time object */
    this.date_time = new allplayers.date(eventInfo.start, eventInfo.end);

    // Derive from allplayers.entity.
    allplayers.entity.call(this, api, options);

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
    this.api.saveEvent(this.getObject(), function() {
      console.log('Event Saved!!!');
    });
  };

  /**
   * @see allplayers.entity#update
   */
  allplayers.event.prototype.update = function(date) {

    // Call the entity first.
    allplayers.entity.prototype.update.call(this, date);

    // Now update the start and end dates.
    this.date_time.update(date.start, date.end);
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
      date_time: this.date_time.getObject()
    });
  };

}(jQuery));
