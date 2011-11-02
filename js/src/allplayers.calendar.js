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

