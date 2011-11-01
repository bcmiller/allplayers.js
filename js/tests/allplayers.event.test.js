
// Returns a random date.
function getRandomDate() {
  var month = Math.floor(Math.random()*12);
  var day = Math.floor(Math.random()*28);
  return {
    month: month,
    day: day,
    date: new Date(2011, month, day)
  };
}

// Test api.getGroupEvents
asyncTest("api.getGroupEvents()", 2, function() {
  allplayers.api.searchGroups({search: 'Spring Soccer 2011'}, function(groups) {
    allplayers.api.getGroupEvents(groups[0].uuid, {
      start: '2011-1-1',
      end: '2011-12-30'
    }, function(events) {

      this.start();

      // Iterate through each event and verify that it is in the right
      // timeframe.
      var passed = true, uuids = true;
      var i = events.length, start = null, end = null;
      var testStart = new Date(2011, 0, 1).getTime();
      var testEnd = new Date(2011, 11, 30).getTime();
      while (i--) {
        start = new Date(events[i].start);
        end = new Date(events[i].end);
        if ((start.getTime() < testStart) && (end.getTime() > testEnd)) {
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
asyncTest("event.update()", 10, function() {
  allplayers.api.searchGroups({search: 'Spring Soccer 2011'}, function(groups) {
    allplayers.api.getGroupEvents(groups[0].uuid, {
      start: '2011-1-1',
      end: '2011-12-30'
    }, function(events) {

      // Create a new event.
      var event = new allplayers.event(events[0]);
      var randomTitle = "Title" + Math.floor(Math.random()*10000000000000);

      var randomStart = getRandomDate();
      var randomEnd = getRandomDate();

      event.title = randomTitle;
      event.start = randomStart.date;
      event.end = randomEnd.date;
      event.save(function(newEvent) {

        // Check the return title and event start and end times are updated.
        var titleChanged = (newEvent.title == randomTitle);
        var startMonthChanged = (newEvent.start.getMonth() == randomStart.month);
        var startDayChanged = (newEvent.start.getDate() == randomStart.day);
        var endMonthChanged = (newEvent.end.getMonth() == randomEnd.month);
        var endDayChanged = (newEvent.end.getDate() == randomEnd.day);

        // Load the event to just make sure it is updated...
        newEvent.get(function(updatedEvent) {

          this.start();

          // Verify that this event really is changed.
          ok(titleChanged, "Title was updated");
          ok(updatedEvent.title == randomTitle, "Title was verified as changed");
          ok(startMonthChanged, "Start month was changed");
          ok(updatedEvent.start.getMonth() == randomStart.month, "Start month was verified");
          ok(startDayChanged, "Start day was changed");
          ok(updatedEvent.start.getDate() == randomStart.day, "Start day was verified");
          ok(endMonthChanged, "End month was changed");
          ok(updatedEvent.end.getMonth() == randomEnd.month, "End month was verified");
          ok(endDayChanged, "End day was changed");
          ok(updatedEvent.end.getDate() == randomEnd.day, "End day was verified");
        });
      });
    });

  });
});

// Testing creating events.
asyncTest("event.create()", 9, function() {

  // Create a new event.
  var rand = Math.floor(Math.random()*10000000000000);
  var randomTitle = "Event " + rand;
  var randomDesc = "This is the " + rand + " event.";
  var randomStart = getRandomDate();
  var randomEnd = getRandomDate();

  // Create a new event.
  var event = new allplayers.event({
    title: randomTitle,
    description: randomDesc,
    start: randomStart.date,
    end: randomEnd.date
  });

  // Save the event.
  event.save(function(savedEvent) {

    var uuidFound = !!savedEvent.uuid;
    var titleValid = savedEvent.title == randomTitle;
    var descValid = savedEvent.description == randomDesc;
    var startValid = savedEvent.start.getTime() === randomStart.date.getTime();
    var endValid = savedEvent.end.getTime() == randomEnd.date.getTime();
    if (uuidFound) {
      event.get(function(loadedEvent) {

        start();
        ok(uuidFound, "UUID found");
        ok(titleValid, "Title was valid.");
        ok(loadedEvent.title == "Event " + rand, "Title was verified.");
        ok(descValid, "Description was valid");
        ok(loadedEvent.description == randomDesc, "Description was verified");
        ok(startValid, "Start date is valid");
        ok(loadedEvent.start.getTime() == randomStart.date.getTime(), "Start date was verified");
        ok(endValid, "End date is valid");
        ok(loadedEvent.end.getTime() == randomEnd.date.getTime(), "End date was verified");
      });
    }
    else {
      start();
      ok(false, "uuid not found!");
    }
  });
});