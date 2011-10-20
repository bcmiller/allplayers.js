(function($) {
  $(function() {

    // Create a new api object.
    var api = new allplayers.api({
      api_path: 'https://www.pdup.allplayers.com/api/v1/rest'
    });

    // Test api.getGroupEvents
    asyncTest("api.getGroupEvents()", 2, function() {
      api.searchGroups({search: 'Spring Soccer 2011'}, function(groups) {
        api.getGroupEvents(groups[0].uuid, {
          start: '2011-10-1',
          end: '2011-10-30'
        }, function(events) {

          this.start();

          // Iterate through each event and verify that it is in the right
          // timeframe.
          var passed = true, uuids = true;
          var i = events.length, start = null, end = null;
          while (i--) {
            start = new Date(events[i].start).getMonth() + 1;
            end = new Date(events[i].end).getMonth() + 1;
            if (start != 10 && end != 10) {
              passed = false;
            }
            if (!events[i].uuid) {
              uuids = false;
            }
          }

          ok(passed, "Events in correct timeframe");
          ok(uuids, "All events have UUIDS");
        });

      });
    });

    // Testing updating events.
    asyncTest("Updating Events", 2, function() {
      api.searchGroups({search: 'Spring Soccer 2011'}, function(groups) {
        api.getGroupEvents(groups[0].uuid, {
          start: '2011-10-1',
          end: '2011-10-30'
        }, function(events) {

          // Create a new event.
          var event = allplayers.event(api, {}, events[0]);

          // Check to make sure all the params match...
          equal(event)
        });

      });


    });
  });
}(jQuery));