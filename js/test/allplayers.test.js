/**
 * The AllPlayers API Unit Test Framework.
 *
 * This test framework uses QUnit to perform its unit tests.  However, there
 * is a wrapper around this unit test library to allow additional unit tests
 * to execute in an asynchronous way and to spread out the testing between
 * multiple files.
 *
 * To add a new unit test, you simply need to do the following.
 *
 * (function($) {
 *   $(function() {
 *
 *     allplayers.test(function() {
 *
 *        // Add your unit test here...
 *
 *     });
 *   });
 * }(jQuery));
 */
allplayers = allplayers || {};
allplayers.tests = [];
allplayers.testIndex = 0;

/**
 * Add a new unit test for the AllPlayers API.
 */
allplayers.test = function(callback) {
  allplayers.tests.push(callback);
};

/**
 * This needs to be called when the test has finished so it will move onto
 * the next test.
 */
allplayers.testDone = function() {
  var i = 0, length = allplayers.tests.length;
  for (i=0; i < length; i++) {
    if (i == allplayers.testIndex) {
      setTimeout(function() {
        allplayers.tests[allplayers.testIndex]();
        allplayers.testIndex++;
      }, 10);
      break;
    }
  }
};

/** Just make the start function call testDone */
allplayers.testStart = allplayers.testDone;
