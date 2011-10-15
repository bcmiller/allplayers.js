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
      dayClick: this.onDayClick,
      eventClick: this.onEventClick,
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
      this.api.getGroups("towncenter", function(groups) {
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
        month:year + '-' + month,
        fields:'*',
        limit:0,
        offset:0
      }, function(events) {
        callback(events);
      });
    });
  };

}(jQuery));

