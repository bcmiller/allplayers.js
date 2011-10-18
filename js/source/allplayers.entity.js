/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The base entity class to store the data that is common to all
   * allplayers entities whether it be groups, events, users, etc.
   *
   * @extends allplayers.base
   * @param {@link allplayers.api} api The API interface.
   * @param {object} options The options for this class.
   */
  allplayers.entity = function(api, options) {

    /** The universally unique identifier */
    this.uuid = '';

    /** The title of this entity */
    this.title = '';

    /** The description of this entity */
    this.description = '';

    // Derive from allplayers.base.
    allplayers.base.call(this, api, options);
  };

  // Create the proper derivation.
  allplayers.entity.prototype = new allplayers.base();
  allplayers.entity.prototype.constructor = allplayers.entity;

  /**
   * Update the entity data.
   *
   * @param {object} entity The entity information.
   */
  allplayers.entity.prototype.update = function(entity) {

    // Allow this to update all the parameters based on what was updated.
    $.extend(true, this, entity);
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
