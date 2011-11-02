/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * A static object that represents the AllPlayers API.
   */
  allplayers.api = {

    /** The AllPlayers API path */
    path: 'http://www.ttidwell.allplayers.com:8080/api/v1/rest',

    /**
     * API function to get any results from the AllPlayers API.
     *
     * @param {string} type The content type returned from the API
     * (groups, events, resources, etc).
     *
     * @param {object} params The additional params for this API.
     * <ul>
     * <li><strong>uuid</strong> - The universal unique ID.</li>
     * <li><strong>filter</strong> - Additional content type filter.</li>
     * <li><strong>query</strong> - key-value pairs to add to query string.</li>
     * </ul>
     *
     * @param {function} callback The callback function.
     */
    get: function(type, params, callback) {
      var path = allplayers.api.path + '/' + type;
      path += params.uuid ? ('/' + params.uuid) : '';
      path += params.filter ? ('/' + params.filter) : '';
      path += '.jsonp?';
      path += params.query ? (jQuery.param(params.query) + '&') : '';
      $.ajax({
        url: path,
        dataType: 'jsonp',
        success: function(data, textStatus) {
          if (textStatus == 'success') {
            callback(data);
          }
          else {
            console.log('Error: ' + textStatus);
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          console.log(xhr.responseText);
          callback(null);
        }
      });
    },

    /**
     * API function to save any object on the AllPlayers server.  If the object
     * already has a UUID, then this is a simple update, otherwise it will
     * create a new object.
     *
     * @param {string} type The content type returned from the API
     * (groups, events, resources, etc).
     *
     * @param {object} object The object you wish to update on the server.
     * @param {function} callback The function to be called when the entity has
     * finished updating.
     */
    save: function(type, object, callback) {
      var path = allplayers.api.path + '/' + type;
      path += object.uuid ? ('/' + object.uuid) : '';
      path += '.json';
      $.ajax({
        url: path,
        dataType: 'json',
        type: (object.uuid) ? 'PUT' : 'POST',
        data: object,
        success: function(data, textStatus) {
          if (textStatus == 'success') {
            callback(data);
          }
          else {
            console.log('Error: ' + textStatus);
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          console.log(xhr.responseText);
          callback(null);
        }
      });
    },

    /**
     * Get the groups based on a search query.
     *
     * @see https://www.allplayers.com/api/v1/rest/wadl/describe.xml#search
     */
    searchGroups: function(query, callback) {
      allplayers.api.get('groups', {
        query: query
      }, callback);
    },

    /**
     * Return a group provided a uuid.
     *
     * @see https://www.allplayers.com/api/v1/rest/wadl/describe.xml#uuid
     */
    getGroup: function(uuid, query, callback) {
      allplayers.api.get('groups', {
        uuid: uuid,
        query: query
      }, callback);
    },

    /**
     * Saves a group
     */
    saveGroup: function(group, callback) {
      callback(group);
    },

    /**
     * Returns a groups albums provided a uuid.
     *
     * @see https://www.allplayers.com/api/v1/rest/wadl/describe.xml#albums
     */
    getGroupAlbums: function(uuid, query, callback) {
      allplayers.api.get('groups', {
        uuid: uuid,
        query: query,
        filter: 'albums'
      }, callback);
    },


    /**
     * Returns a groups events provided a uuid.
     *
     * @see https://www.allplayers.com/api/v1/rest/wadl/describe.xml#events
     */
    getGroupEvents: function(uuid, query, callback) {
      allplayers.api.get('groups', {
        uuid: uuid,
        query: query,
        filter: 'events'
      }, callback);
    },

    /**
     * Returns a groups members provided a uuid.
     *
     * @see https://www.allplayers.com/api/v1/rest/wadl/describe.xml#members
     */
    getGroupMembers: function(uuid, query, callback) {
      allplayers.api.get('groups', {
        uuid: uuid,
        query: query,
        filter: 'members'
      }, callback);
    },

    /**
     * Returns a groups photos provided a uuid.
     *
     * @see https://www.allplayers.com/api/v1/rest/wadl/describe.xml#photos
     */
    getGroupPhotos: function(query, callback) {
      allplayers.api.get('groups', {
        query: query,
        filter: 'photos'
      }, callback);
    },

    /**
     * Returns an event.
     */
    getEvent: function(uuid, fields, callback) {
      allplayers.api.get('events', {
        uuid: uuid,
        query: {
          fields: fields
        }
      }, callback);
    },

    /**
     * Saves an event
     */
    saveEvent: function(event, callback) {
      allplayers.api.save('events', event, callback);
    }
  };
}(jQuery));


/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The base entity class to store the data that is common to all
   * allplayers entities whether it be groups, events, users, etc.
   *
   * @param {object} options The options for this class.
   */
  allplayers.entity = function(object) {

    /** The universally unique identifier */
    this.uuid = '';

    /** The title of this entity */
    this.title = '';

    /** The description of this entity */
    this.description = '';

    // If object is a string, assume it is a UUID and get it.
    this.update(object);
  };

  /**
   * Get's an object from the AllPlayers API.
   *
   * @param {function} callback The callback function when the object is
   * retrieved.
   */
  allplayers.entity.prototype.get = function(callback) {
  };

  /**
   * Update the entity data.
   *
   * @param {object} entity The entity information.
   */
  allplayers.entity.prototype.update = function(object) {

    // Update the object.
    if (object) {

      // Update the params.
      for (var param in object) {
        if (object.hasOwnProperty(param) && this.hasOwnProperty(param)) {
          this[param] = object[param];
        }
      }
    }
  };

  /**
   * Returns the object to send during PUT's and POST's during a save or add.
   *
   * @return {object} An object of the data when saving to the server.
   */
  allplayers.entity.prototype.getObject = function() {
    return {
      uuid: this.uuid,
      title: this.title,
      description: this.description
    };
  };
}(jQuery));
/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
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
      $.extend(this.repeat, repeat);
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

}(jQuery));
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
/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The group class to govern all functionality that groups have.
   *
   * @extends allplayers.entity
   * @param {object} options The options for this class.
   * @param {object} groupInfo The group information.
   */
  allplayers.group = function(groupInfo) {

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
    allplayers.entity.call(this, groupInfo);
  };

  // Create the proper derivation.
  allplayers.group.prototype = new allplayers.entity();
  allplayers.group.prototype.constructor = allplayers.group;

  /**
   * Get a group provided the UUID.
   */
  allplayers.group.prototype.get = function(callback) {

    allplayers.api.getGroup(this.uuid, {}, function(object) {
      this.update(object);
      callback(this);
    });
  };

  /**
   * Save a group to the database.
   */
  allplayers.group.prototype.save = function(callback) {

    // Call the api group save function.
    allplayers.api.saveGroup(this);
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

