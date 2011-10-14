/** The allplayers namespace. */
var allplayers = allplayers || {};

(function($) {

  /**
   * @class The group class to govern all functionality that groups have.
   *
   * @extends allplayers.entity
   * @param {@link allplayers.api} api The API interface.
   * @param {object} options The options for this class.
   * @param {object} groupInfo The group information.
   */
  allplayers.group = function(api, options, groupInfo) {

    /**
     * A {@link allplayers.location} object.
     */
    this.location = new allplayers.location(api, options);

    /** The group activity level */
    this.activity_level = 0;

    /** List in directory. */
    this.list_in_directory = 0;

    /** If the group is active. */
    this.active = false;

    /** Registration fee's enabled */
    this.registration_fees_enabled = '';

    /** Approved for payment */
    this.approved_for_payment = '';

    /** Accept AMEX credit cards */
    this.accept_amex = '';

    /** Primary Color */
    this.primary_color = '';

    /** Secondary Color */
    this.secondary_color = '';

    /** The node status */
    this.node_status = 0;

    /** The group logo URL */
    this.logo = '';

    /** The Group URI */
    this.uri = '';

    /** The Group URL */
    this.url = '';

    /** Array of groups above */
    this.groups_above_uuid = [];

    // Derive from allplayers.entity.
    allplayers.entity.call(this, api, options);

    // Update all the group information.
    this.update(groupInfo);
  };

  // Create the proper derivation.
  allplayers.group.prototype = new allplayers.entity();
  allplayers.group.prototype.constructor = allplayers.group;

  /**
   * Save a group to the database.
   */
  allplayers.group.prototype.save = function() {

    // Call the api group save function.
    this.api.saveGroup(this);
  };

}(jQuery));


