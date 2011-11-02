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


