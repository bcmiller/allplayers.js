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
