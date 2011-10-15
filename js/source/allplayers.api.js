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
}(jQuery));


