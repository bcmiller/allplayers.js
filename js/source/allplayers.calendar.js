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
    allplayers.calendars[options.id] = this;

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
    var api = new allplayers.api();
    api.getGroups("towncenter", function(groups) {
      api.getGroupEvents(groups[0].uuid, {
        month:'2011-10',
        fields:'*',
        limit:10,
        offset:0
      }, function(events) {
        callback(events);
      });
    });
/*

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
*/
  };

}(jQuery));

