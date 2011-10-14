/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The API class that governs the AllPlayers API.
   *
   * @extends allplayers.base
   */
  allplayers.api = function(options) {

    /** The default options for the api. */
    var defaults = {
      path: 'https://www.pdup.allplayers.com/api/v1/rest'
    };

    // Derive from allplayers.base.
    allplayers.base.call($.extend(defaults, options));
  };

  /**
   * Common callback function for data retrieval for the API.
   */
  allplayers.api.prototype.get = function(path, callback) {
    $.getJSON(path, function(data, textStatus) {
      if (textStatus == 'success') {
        callback(data);
      }
      else {
        this.log('Error: ' + textStatus);
      }
    });
  };

  /**
   * Returns all the groups.
   *
   * <strong>Usage:</strong>
   * <code>
   *   var api = new allplayers.api();
   *   api.getGroups('', function(groups) {
   *    var i = groups.length;
   *    while (i--) {
   *      console.log(groups[i].title + ' found!');
   *    }
   *   });
   * </code>
   *
   * @param {string} search The search string to use when getting the groups.
   * @param {function} callback A callback function to handle the groups
   * returned from this api call. See usage.
   */
  allplayers.api.prototype.getGroups = function(search, callback) {
    var path = this.options.path + '/groups?';
    path += search ? 'search="' + encodeURIComponent(search) + '"&' : '';
    path += 'callback=?';
    this.get(path, callback);
  };

  /**
   * Returns group information provided a UUID.
   *
   * @param {string} uuid The univerally unique identifier for this group.
   * @param {function} callback The callback to handle the return JSON data.
   */
  allplayers.api.prototype.getGroup = function(uuid, callback) {
    var path = this.options.path + '/groups/' + uuid + '?callback=?';
    this.get(path, callback);
  };

  /**
   * Returns group albums provided a UUID.
   *
   * @param {string} uuid The univerally unique identifier for this group.
   * @param {function} callback The callback to handle the return JSON data.
   */
  allplayers.api.prototype.getGroupAlbums = function(uuid, callback) {
    var path = this.options.path + '/groups/' + uuid + '/albums?callback=?';
    this.get(path, callback);
  };

  /**
   * Returns group events provided a UUID.
   *
   * @param {string} uuid The univerally unique identifier for this group.
   * @param {function} callback The callback to handle the return JSON data.
   */
  allplayers.api.prototype.getGroupEvents = function(uuid, callback) {
    var path = this.options.path + '/groups/' + uuid + '/events?callback=?';
    this.get(path, callback);
  };

  /**
   * Returns group members provided a UUID.
   *
   * @param {string} uuid The univerally unique identifier for this group.
   * @param {function} callback The callback to handle the return JSON data.
   */
  allplayers.api.prototype.getGroupMembers = function(uuid, callback) {
    var path = this.options.path + '/groups/' + uuid + '/members?callback=?';
    this.get(path, callback);
  };

}(jQuery));


/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class Base class for all objects in the AllPlayers API system.
   *
   * @param {object} options The options for this component.
   */
  allplayers.base = function(options) {

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


/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /** The default options. */
  var defaults = {

  };

  // Store all the calendar instances.
  allplayers.calendars = {};

  // Add a way to instanciate using jQuery prototype.
  if (!$.fn.allplayers_calendar) {
    $.fn.allplayers_calendar = function(options) {
      return $(this).each(function() {
        if (!allplayers.calendars[$(this).selector]) {
          new allplayers.calendar($(this), options);
        }
      });
    };
  }

  /**
   * @class The AllPlayers calendar JavaScript API
   *
   * <p><strong>Usage:</strong>
   * <pre><code>
   *
   *   // Create a calendar
   *   var player = $("#calendar").apcicalendar({
   *
   *   });
   *
   * </code></pre>
   * </p>
   *
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  allplayers.calendar = function(context, options) {
    // Make sure we provide default options...
    options = $.extend(defaults, options, {
      dayClick: this.onDayClick,
      eventClick: this.onEventClick,
      events: this.getEvents
    });

    // Store this player instance.
    APCI.calendars[options.id] = this;

    // Create the fullcalendar.
    context.fullCalendar(options);
  };

  allplayers.calendar.prototype.onDayClick = function() {
    console.log('Day has been clicked');
  };

  allplayers.calendar.prototype.onEventClick = function() {
    console.log('Event has been clicked');
  };

  allplayers.calendar.prototype.getEvents = function(start, end, callback) {

    // Get the groups involved.
    $.ajax(
    );


    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var events = [
      {
        title: 'Test Event',
        start: new Date(y, m, d - 2),
        end: new Date(y, m, d)
      }
    ];
    callback(events);
  };

}(jQuery));

/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The base entity class to store the data that is common to all
   * allplayers entities whether it be groups, events, users, etc.
   */
  allplayers.entity = function() {

    /** The universally unique identifier */
    this.uuid = '';

    /** The title of this entity */
    this.title = '';

    /** The description of this entity */
    this.description = '';
  };

  /**
   * Update the entity data.
   *
   * @param {object} entity The entity information.
   */
  allplayers.entity.update = function(entity) {

    // Allow this to update all the parameters based on what was updated.
    $.extend(true, this, entity);
  };
}(jQuery));
/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The group class to govern all functionality that groups have.
   *
   * @extends allplayers.entity
   */
  allplayers.group = function() {

    /**
     * A {@link allplayers.location} object.
     */
    this.location = new allplayers.location();

    /** The group activity level */
    this.activity_level = 0;

    /** List in directory. */
    this.list_in_directory = 0;

    /** If the group is active. */
    this.active = false;

    /** Registration fee's enabled */
    this.registration_fees_enabled = '';

    /** Approved for payment */
    this.approved_for_payment = '';

    /** Accept AMEX credit cards */
    this.accept_amex = '';

    /** Primary Color */
    this.primary_color = '';

    /** Secondary Color */
    this.secondary_color = '';

    /** The node status */
    this.node_status = 0;

    /** The group logo URL */
    this.logo = '';

    /** The Group URI */
    this.uri = '';

    /** The Group URL */
    this.url = '';

    /** Array of groups above */
    this.groups_above_uuid = [];

    // Derive from allplayers.entity.
    allplayers.entity.call(this);
  };

  // Create the proper derivation.
  allplayers.group.prototype = new allplayers.entity();
  allplayers.group.prototype.constructor = allplayers.group;


}(jQuery));


/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The groups class to govern lists of groups.
   */
  allplayers.groups = function(options) {

    /** A list of all groups within a query */
    this.groups = [];

    // Derive from allplayers.api.
    allplayers.api.call($.extend(defaults, options));
  };

  // Define the prototype for all controllers.
  allplayers.groups.prototype = new allplayers.api();
  allplayers.groups.prototype.constructor = allplayers.groups;

  /**
   * Fetch all groups provided a filter.
   *
   * @param {string} search Search string to filter groups.
   */
  allplayers.groups.prototype.getGroups = function(search) {


  };

}(jQuery));
/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The class to govern all location functionality and data.
   *
   * @extends allplayers.entity
   */
  allplayers.location = function() {

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
    allplayers.entity.call(this);
  };

  // Create the proper derivation.
  allplayers.location.prototype = new allplayers.entity();
  allplayers.location.prototype.constructor = allplayers.location;

}(jQuery));
