/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The API class that governs the AllPlayers API.
   *
   * @extends allplayers.base
   * @param {object} options The options for this class.
   */
  allplayers.api = function(options) {

    /** The default options for the api. */
    var defaults = {
      path: 'https://www.pdup.allplayers.com/api/v1/rest'
    };

    // Set the groups path.
    defaults.group_path = defaults.path + '/groups';

    // Derive from allplayers.base.
    options = $.extend(defaults, options);
    allplayers.base.call(this, null, options);
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
    var path = this.options.group_path + '.jsonp?';
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
  allplayers.api.prototype.getGroup = function(uuid, params, callback) {
    var path = this.options.group_path + '/' + uuid + '.jsonp?';
    path += params ? (jQuery.param(params) + '&') : '';
    path += 'callback=?';
    this.get(path, callback);
  };

  /**
   * Returns group albums provided a UUID.
   *
   * @param {string} uuid The univerally unique identifier for this group.
   * @param {function} callback The callback to handle the return JSON data.
   */
  allplayers.api.prototype.getGroupAlbums = function(uuid, params, callback) {
    var path = this.options.group_path + '/' + uuid + '/albums.jsonp?';
    path += params ? (jQuery.param(params) + '&') : '';
    path += 'callback=?';
    this.get(path, callback);
  };

  /**
   * Returns group events provided a UUID.
   *
   * @param {string} uuid The univerally unique identifier for this group.
   * @param {function} callback The callback to handle the return JSON data.
   */
  allplayers.api.prototype.getGroupEvents = function(uuid, params, callback) {
    var path = this.options.group_path + '/' + uuid + '/events.jsonp?';
    path += params ? (jQuery.param(params) + '&') : '';
    path += 'callback=?';
    this.get(path, callback);
  };

  /**
   * Returns group members provided a UUID.
   *
   * @param {string} uuid The univerally unique identifier for this group.
   * @param {function} callback The callback to handle the return JSON data.
   */
  allplayers.api.prototype.getGroupMembers = function(uuid, params, callback) {
    var path = this.options.group_path + '/' + uuid + '/members.jsonp?';
    path += params ? (jQuery.param(params) + '&') : '';
    path += 'callback=?';
    this.get(path, callback);
  };

  /**
   * Returns group photos provided a UUID.
   *
   * @param {string} uuid The univerally unique identifier for this group.
   * @param {function} callback The callback to handle the return JSON data.
   */
  allplayers.api.prototype.getGroupPhotos = function(uuid, params, callback) {
    var path = this.options.group_path + '/' + uuid + '/photos.jsonp?';
    path += params ? (jQuery.param(params) + '&') : '';
    path += 'callback=?';
    this.get(path, callback);
  };

  /**
   * Returns a list of all events.
   */
  allplayers.api.prototype.getEvents = function() {

  };

  /**
   * Saves an event
   */
  allplayers.api.prototype.saveEvent = function(event) {
    console.log('Saving Event: ' + event);
  };

}(jQuery));


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
    var _this = this;
    options = $.extend(defaults, options, {
      editable: true,
      dayClick: this.onDayClick,
      eventClick: this.onEventClick,
      eventDragStop: function(event, jsEvent, ui, view) {

        // Save this event.
        event.obj.save();
      },
      events: function(start, end, callback) {
        _this.getEvents(start, end, callback);
      }
    });

    // Store this player instance.
    allplayers.calendars[options.id] = this;

    // TO-DO: MAKE IT SO THAT WE DON'T NEED A GROUP TO GET EVENTS
    this.uuid = '';

    // The api.
    this.api = new allplayers.api();

    // Create the fullcalendar.
    context.fullCalendar(options);
  };

  allplayers.calendar.prototype.onDayClick = function() {
    console.log('Day has been clicked');
  };

  allplayers.calendar.prototype.onEventClick = function() {
    console.log('Event has been clicked');
  };

  allplayers.calendar.prototype.getUUID = function(callback) {
    if (this.uuid) {
      callback.call(this);
    }
    else {
      var _this = this;
      this.api.getGroups('towncenter', function(groups) {
        _this.uuid = groups[0].uuid;
        callback.call(_this);
      });
    }
  };

  allplayers.calendar.prototype.getEvents = function(start, end, callback) {
    var year = end.getFullYear();
    var month = end.getMonth();
    this.getUUID(function() {
      this.api.getGroupEvents(this.uuid, {
        month: year + '-' + month,
        fields: '*',
        limit: 0,
        offset: 0
      }, function(events) {

        // Iterate through the events and add a new event object.
        var i = events.length;
        while (i--) {
          events[i].ojb = new allplayers.event(events[i]);
        }

        // Add this to the events for the calendar.
        callback(events);
      });
    });
  };

}(jQuery));

/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The base entity class to store the data that is common to all
   * allplayers entities whether it be groups, events, users, etc.
   *
   * @extends allplayers.base
   * @param {@link allplayers.api} api The API interface.
   * @param {object} options The options for this class.
   */
  allplayers.entity = function(api, options) {

    /** The universally unique identifier */
    this.uuid = '';

    /** The title of this entity */
    this.title = '';

    /** The description of this entity */
    this.description = '';

    // Derive from allplayers.base.
    allplayers.base.call(this, api, options);
  };

  // Create the proper derivation.
  allplayers.entity.prototype = new allplayers.base();
  allplayers.entity.prototype.constructor = allplayers.entity;

  /**
   * Update the entity data.
   *
   * @param {object} entity The entity information.
   */
  allplayers.entity.prototype.update = function(entity) {

    // Allow this to update all the parameters based on what was updated.
    $.extend(true, this, entity);
  };
}(jQuery));
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
/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The group class to govern all functionality that groups have.
   *
   * @extends allplayers.entity
   * @param {@link allplayers.api} api The API interface.
   * @param {object} options The options for this class.
   * @param {object} groupInfo The group information.
   */
  allplayers.group = function(api, options, groupInfo) {

    /**
     * A {@link allplayers.location} object.
     */
    this.location = new allplayers.location(api, options);

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
    allplayers.entity.call(this, api, options);

    // Update all the group information.
    this.update(groupInfo);
  };

  // Create the proper derivation.
  allplayers.group.prototype = new allplayers.entity();
  allplayers.group.prototype.constructor = allplayers.group;

  /**
   * Save a group to the database.
   */
  allplayers.group.prototype.save = function() {

    // Call the api group save function.
    this.api.saveGroup(this);
  };

}(jQuery));


/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The groups class to govern lists of groups.
   *
   * @extends allplayers.base
   * @param {@link allplayers.api} api The API interface.
   * @param {object} options The options for this class.
   */
  allplayers.groups = function(api, options) {

    // Derive from allplayers.base.
    allplayers.base.call(this, api, options);
  };

  // Define the prototype for all controllers.
  allplayers.groups.prototype = new allplayers.base();
  allplayers.groups.prototype.constructor = allplayers.groups;

  /**
   * Fetch all groups provided a filter.
   *
   * @param {string} search Search string to filter groups.
   * @param {function} callback The callback function for all the groups.
   */
  allplayers.groups.prototype.getGroups = function(search, callback) {

    this.api.getGroups(search, function(json) {

      // The groups array.
      var groups = [];

      // Iterate through all the groups and return the group objects.
      var i = json.length;
      while (i--) {
        groups.push(new allplayers.group(this.options, this.api, json[i]));
      }

      // Return all the group objects.
      callback(groups);
    });
  };

  /**
   * Returns group information provided a UUID.
   *
   * @param {string} uuid The univerally unique identifier for this group.
   * @param {function} callback The callback to handle the group object.
   */
  allplayers.groups.prototype.getGroup = function(uuid, callback) {

    this.api.getGroup(uuid, function(groupInfo) {

      // Return a new group object.
      return new allplayers.group(this.options, this.api, groupInfo);
    });
  };

}(jQuery));
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
  allplayers.location = function(api, options) {

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
    allplayers.entity.call(this, api, options);
  };

  // Create the proper derivation.
  allplayers.location.prototype = new allplayers.entity();
  allplayers.location.prototype.constructor = allplayers.location;

}(jQuery));
