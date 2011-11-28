// The allplayers namespace.
var allplayers = allplayers || {};

/** The allplayers.group namespace */
allplayers.group = allplayers.group || {};

/**
 * @constructor
 * @extends drupal.api
 * @class The AllPlayers group api class.
 */
allplayers.group.api = function() {

  // Set the resource
  this.resource = 'groups';

  // Call the drupal.api constructor.
  drupal.api.call(this);
};

/** Derive from drupal.api. */
allplayers.group.api.prototype = new drupal.api();

/** Reset the constructor. */
allplayers.group.api.prototype.constructor = allplayers.group.api;
