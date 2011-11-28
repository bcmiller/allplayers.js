/** The allplayers namespace. */
var allplayers = allplayers || {};

/**
 * @constructor
 * @extends drupal.entity
 * @class The group class to govern all functionality that groups have.
 *
 * @param {object} object The group information.
 * @param {function} callback The function to call when this group is retrieved.
 */
allplayers.group = function(object, callback) {

  // Only continue if the object is valid.
  if (object) {

    /** A {@link allplayers.location} object. */
    this.location = this.location || new allplayers.location();

    /** The group activity level */
    this.activity_level = this.activity_level || 0;

    /** List in directory. */
    this.list_in_directory = this.list_in_directory || 0;

    /** If the group is active. */
    this.active = this.active || false;

    /** Registration fee's enabled */
    this.registration_fees_enabled = this.registration_fees_enabled || '';

    /** Approved for payment */
    this.approved_for_payment = this.approved_for_payment || '';

    /** Accept AMEX credit cards */
    this.accept_amex = this.accept_amex || '';

    /** Primary Color */
    this.primary_color = this.primary_color || '';

    /** Secondary Color */
    this.secondary_color = this.secondary_color || '';

    /** The node status */
    this.node_status = this.node_status || 0;

    /** The group logo URL */
    this.logo = this.logo || '';

    /** The Group URI */
    this.uri = this.uri || '';

    /** The Group URL */
    this.url = this.url || '';

    /** Array of groups above */
    this.groups_above_uuid = this.groups_above_uuid || [];

    /** The search parameter for this group. */
    this.search = this.search || '';

    /** The groups api. */
    this.api = this.api || new allplayers.group.api();
  }

  // Derive from drupal.node.
  drupal.node.call(this, object, callback);
};

/** Derive from drupal.node. */
allplayers.group.prototype = new drupal.node();

/** Reset the constructor. */
allplayers.group.prototype.constructor = allplayers.group;

/**
 * Override the update routine.
 *
 * @param {object} object The node object to update.
 */
allplayers.group.prototype.update = function(object) {

  drupal.node.prototype.update.call(this, object);

  // Make sure to user the uuid over the nid.
  if (object) {
    this.id = object.uuid || this.id;
  }
};

/**
 * Returns the events for this group.
 *
 * @param {object} params An object of the following parameters.
 * <ul>
 * <li><strong>start</strong> - The start date to get the events.</li>
 * <li><strong>end</strong> - The end date to get the events.</li>
 * <li><strong>fields</strong> - The fields to get.</li>
 * <li><strong>limit</strong> - The limit of events to get.</li>
 * <li><strong>offset</strong> - The offset of events for pagination.</li>
 * </ul>
 *
 * @param {function} callback The callback function to get the events.
 */
allplayers.group.prototype.getEvents = function(params, callback) {

  // Get the events within this group.
  this.api.getItems(this, 'events', params, function(events) {

    // Iterate through the events and create an event object out of them.
    var i = events.length;
    while (i--) {
      events[i] = new allplayers.event(events[i]);
    }

    // Call the callback.
    callback(events);
  });
};

/**
 * Returns the upcoming events for this group.
 *
 * @param {object} params An object of the following parameters.
 * <ul>
 * <li><strong>start</strong> - The start date to get the events.</li>
 * <li><strong>end</strong> - The end date to get the events.</li>
 * <li><strong>fields</strong> - The fields to get.</li>
 * <li><strong>limit</strong> - The limit of events to get.</li>
 * <li><strong>offset</strong> - The offset of events for pagination.</li>
 * </ul>
 *
 * @param {function} callback The callback function to get the events.
 */
allplayers.group.prototype.getUpcomingEvents = function(params, callback) {

  // Get the events within this group.
  this.api.getItems(this, 'events/upcoming', params, function(events) {

    // Iterate through the events and create an event object out of them.
    var i = events.length;
    while (i--) {
      events[i] = new allplayers.event(events[i]);
    }

    // Call the callback.
    callback(events);
  });
};
