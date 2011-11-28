/** The allplayers namespace. */
var allplayers = allplayers || {};

/**
 * @constructor
 * @class The date class wraps up the AllPlayers Date-Time object used in
 * several parameters for Event creation, etc.
 *
 * <p><strong>Usage:</strong></p>
 * <pre><code>
 *   var start = new Date('2010-09-01T00:00:00');  // Start on 9-1-2011
 *   var end = new Date('2012-09-20T00:00:00');    // End on 9-20-2012
 *   var repeat = {
 *     interval:1,                            // The repeat interval.
 *     freq:'DAILY',                          // Repeat Daily
 *     until:new Date('2012-09-04T00:00:00'), // Go until 9-4-2012
 *     bymonth: ['1'],                        // January
 *     bymonthday: ['3'],                     // 3rd of the month.
 *     byday: [
 *       'SU' => 'SU',                        // Sunday
 *       '+1MO' => '+1MO',                    // First Monday of the Month
 *       '+2WED' => '+2WED',                  // 2nd Wed of the month
 *     ],
 *     exdate: [
 *       '2011-09-04T00:00:00'                // Except 9-4-2011
 *       '2011-10-03T00:00:00'                // Except 10-3-2011
 *     ],
 *     rdate: [
 *       '2011-09-01T00:00:00'                // Add 9-1-2011
 *       '2011-10-04T00:00:00'                // ADD 10-4-2011
 *     ]
 *   };
 *
 *   // Create a new AllPlayers Date object.
 *   var date = new allplayers.date(start, end, repeat);
 *
 *   // Add additional exceptions.
 *   date.addException('2011-09-10T00:00:00');
 *
 *   // Add additional dates.
 *   date.addRDate('2011-10-10T00:00:00');
 * </code></pre>
 *
 * @param {Date} start The start date.
 * @param {Date} end The end date.
 * @param {object} repeat The repeat rule. In the following form.
 */
allplayers.date = function(start, end, repeat) {

  /**
   * Creates a new date based on a parameter which could be a string, Date
   * object, or nothing...
   *
   * @param {optional} date Either a date string, Date object, or nothing...
   * @return {Date} A JavaScript Date object.
   */
  this.newDate = function(date) {
    if (typeof date === 'string') {
      return new Date(date);
    }
    else if (typeof date === 'object') {
      return date;
    }
    else {
      return new Date();
    }
  }

  /** The start date */
  this.start = this.newDate(start);

  /** The end date */
  this.end = this.newDate(end);

  /** The repeat rule */
  this.repeat = repeat ? {
    interval: (repeat.interval ? repeat.interval : 1),
    freq: (repeat.freq ? repeat.freq : 'DAILY'),
    until: this.newDate(repeat.until),
    bymonth: (repeat.bymonth ? repeat.bymonth : []),
    bymonthday: (repeat.bymonthday ? repeat.bymonthday : []),
    byday: (repeat.byday ? repeat.byday : []),
    exdate: (repeat.exdate ? repeat.exdate : []),
    rdate: (repeat.rdate ? repeat.rdate : [])
  } : null;
};

// Need to fix the Date prototype to allow toISOString.
if (!Date.prototype.toISOString) {
  function padzero(n) {
    return n < 10 ? '0' + n : n;
  }
  function pad2zeros(n) {
    if (n < 100) {
      n = '0' + n;
    }
    if (n < 10) {
      n = '0' + n;
    }
    return n;
  }

  /**
   * Provide a toISOString method to the Date prototype.
   *
   * @return {string} An ISO string representation of the date object.
   */
  Date.prototype.toISOString = function() {
    var ISOString = this.getUTCFullYear() + '-';
    ISOString += padzero(this.getUTCMonth() + 1) + '-';
    ISOString += padzero(this.getUTCDate()) + 'T';
    ISOString += padzero(this.getUTCHours()) + ':';
    ISOString += padzero(this.getUTCMinutes()) + ':';
    ISOString += padzero(this.getUTCSeconds()) + '.';
    ISOString += pad2zeros(this.getUTCMilliseconds()) + 'Z';
    return ISOString;
  };
}

/**
 * Updates the date start and end dates and repeat rule.
 *
 * @param {Date} start The new start date.
 * @param {Date} end The new end date.
 * @param {object} repeat The new repeat rule.
 */
allplayers.date.prototype.update = function(start, end, repeat) {
  this.start = start ? this.newDate(start) : this.start;
  this.end = end ? this.newDate(end) : this.end;
  if (repeat) {
    repeat.until = this.newDate(repeat.until);
    jQuery.extend(this.repeat, repeat);
  }
};

/**
 * Adds a generic new date to repeat rule.
 *
 * @param {string} param The repeat rule parameter to set.
 * @param {optional} date Either a date string, Date object, or nothing...
 */
allplayers.date.prototype.addDate = function(param, date) {

  // Normalize the date parameter.
  date = this.newDate(date);

  // Add this date.
  this.repeat[param].push(date);
};

/**
 * Add's an exception date to the repeat rule.
 *
 * @param {Date} except An exception date to remove from the repeat rule.
 */
allplayers.date.prototype.addException = function(except) {

  // Add an exception.
  this.addDate('except', except);
};

/**
 * Adds an additional date to the repeat rule.
 *
 * @param {Date} addition An additional date to add to the repeat rule.
 */
allplayers.date.prototype.addRDate = function(addition) {

  // Add an addition.
  this.addDate('rdate', addition);
};

/**
 * Returns the object which will be passed to the services API.
 *
 * @return {object} The JSON object representation of this object.
 */
allplayers.date.prototype.getObject = function() {
  var i = 0;
  var obj = {
    start: this.start.toISOString(),
    end: this.end.toISOString()
  };

  // If there is a repeat rule, then add that to the object.
  if (this.repeat) {
    obj.repeat = {
      interval: this.repeat.interval,
      freq: this.repeat.freq,
      until: this.repeat.until.toISOString(),
      bymonth: this.repeat.bymonth,
      bymonthday: this.repeat.bymonthday,
      byday: this.repeat.byday,
      exdate: [],
      rdate: []
    };

    // Iterate through the exdate and rdate and add the date strings.
    i = this.repeat.exdate.length;
    while (i--) {
      obj.repeat.exdate.push(this.repeat.exdate[i].toISOString());
    }

    i = this.repeat.rdate.length;
    while (i--) {
      obj.repeat.rdate.push(this.repeat.rdate[i].toISOString());
    }
  }

  return obj;
};
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
// The allplayers namespace.
var allplayers = allplayers || {};

/** The allplayers.event namespace */
allplayers.event = allplayers.event || {};

/**
 * @constructor
 * @extends drupal.api
 * @class The AllPlayers event api class.
 */
allplayers.event.api = function() {

  // Set the resource
  this.resource = 'events';

  // Call the drupal.api constructor.
  drupal.api.call(this);
};

/** Derive from drupal.api. */
allplayers.event.api.prototype = new drupal.api();

/** Reset the constructor. */
allplayers.event.api.prototype.constructor = allplayers.event.api;
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
// The allplayers namespace.
var allplayers = allplayers || {};

/** The allplayers.group namespace */
allplayers.group = allplayers.group || {};

/**
 * @constructor
 * @extends drupal.api
 * @class The AllPlayers group api class.
 */
allplayers.group.api = function() {

  // Set the resource
  this.resource = 'groups';

  // Call the drupal.api constructor.
  drupal.api.call(this);
};

/** Derive from drupal.api. */
allplayers.group.api.prototype = new drupal.api();

/** Reset the constructor. */
allplayers.group.api.prototype.constructor = allplayers.group.api;
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
/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /** The default options. */
  var defaults = {
    dialog: '#calendar-dialog-form'
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
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      editable: true,
      dayClick: function(date, allDay, jsEvent, view) {
        console.log(date);
        console.log(allDay);
        console.log(jsEvent);
        console.log(view);
      },
      eventClick: function(event, jsEvent, view) {
        console.log(event);
        console.log(jsEvent);
        console.log(view);
        //_this.dialog.show().dialog();
      },
      eventDrop: function(event, jsEvent, ui, view) {

        // Save this event.
        event.obj.update(event);
        event.obj.save();
      },
      eventResizeStop: function(event, jsEvent, ui, view) {

        // Save this event.
        event.obj.update(event);
        event.obj.save();
      },
      events: function(start, end, callback) {
        _this.getEvents(start, end, callback);
      }
    });

    /** The calendar dialog to edit events */
    this.dialog = $(options.dialog, context).hide();

    // Store this player instance.
    allplayers.calendars[options.id] = this;

    // TO-DO: MAKE IT SO THAT WE DON'T NEED A GROUP TO GET EVENTS
    this.uuid = '';

    // Create the fullcalendar.
    context.fullCalendar(options);
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
      var query = {search: 'Spring Soccer 2011'};
      allplayers.api.searchGroups(query, function(groups) {
        _this.uuid = groups[0].uuid;
        callback.call(_this);
      });
    }
  };

  /**
   * Get's all the events in this calendar.
   *
   * @param {Date} start The start timeframe.
   * @param {Date} end The end timeframe.
   * @param {function} callback The callback function to return the events.
   */
  allplayers.calendar.prototype.getEvents = function(start, end, callback) {

    // Format the start and end strings according to the AllPlayers API.
    var startString = start.getFullYear() + '-';
    startString += (start.getMonth() + 1) + '-';
    startString += start.getDate();

    var endString = end.getFullYear() + '-';
    endString += (end.getMonth() + 1) + '-';
    endString += end.getDate();

    this.getUUID(function() {
      allplayers.api.getGroupEvents(this.uuid, {
        start: startString,
        end: endString,
        fields: '*',
        limit: 0,
        offset: 0
      }, function(events) {

        // Iterate through the events and make them allplayers.event's
        var i = events.length;
        while (i--) {
          events[i].id = events[i].uuid;
          events[i].obj = new allplayers.event(events[i]);
        }

        // Add this to the events for the calendar.
        callback(events);
      });
    });
  };

}(jQuery));

