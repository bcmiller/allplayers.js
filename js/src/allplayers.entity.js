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

    if (object) {
      this.uuid = object.uuid;
      this.title = object.title;
      this.description = object.description;
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
