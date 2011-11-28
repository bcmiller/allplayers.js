/** The allplayers namespace. */
var allplayers = allplayers || {};

/**
 * @constructor
 * @extends drupal.node
 * @class The event class to govern all functionality that events have.
 *
 * @param {object} object The event information.
 * @param {function} callback The function to be called once the node has
 * been retrieved from the server.
 */
allplayers.event = function(object, callback) {

  // Only continue if the object is valid.
  if (object) {

    /** Set to TRUE if this is an all day event */
    this.allDay = this.allDay || false;

    /** An array of group UUID's that have this Event. */
    this.gids = this.gids || [];

    /** The description for this event. */
    this.description = this.description || '';

    /** An array of resource UUID's that are associated with this Event.*/
    this.resources = this.resources || [];

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
    this.competitors = this.competitors || {};

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
    this.category = object.category ? object.category : 'Other';

    /** The date-time object */
    this.date = new allplayers.date(object.start, object.end);
    this.start = this.date.start;
    this.end = this.date.end;

    // Declare the api.
    this.api = this.api || new allplayers.event.api();
  }

  // Derive from drupal.node.
  drupal.node.call(this, object, callback);
};

/** Derive from drupal.node */
allplayers.event.prototype = new drupal.node();

/** Reset the constructor */
allplayers.event.prototype.constructor = allplayers.event;

/**
 * Override the update routine.
 *
 * @param {object} object The node object to update.
 */
allplayers.event.prototype.update = function(object) {

  drupal.node.prototype.update.call(this, object);

  // Make sure to user the uuid over the nid.
  if (object) {
    this.id = object.uuid || this.id;
  }
};

/**
 * @see drupal.entity#getObject
 * @return {object} The JSON object to send to the Services endpoint.
 */
allplayers.event.prototype.getObject = function() {

  // Get the object to send to the server.
  return jQuery.extend(drupal.node.prototype.getObject.call(this), {
    allDay: this.allDay,
    gids: this.gids,
    description: this.description,
    resources: this.resources,
    competitors: this.competitors,
    category: this.category,
    date_time: this.date.getObject()
  });
};
