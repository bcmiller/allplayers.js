// The allplayers namespace.
var allplayers = allplayers || {};

/** The allplayers.event namespace */
allplayers.event = allplayers.event || {};

/**
 * @constructor
 * @extends drupal.api
 * @class The AllPlayers event api class.
 */
allplayers.event.api = function() {

  // Set the resource
  this.resource = 'events';

  // Call the drupal.api constructor.
  drupal.api.call(this);
};

/** Derive from drupal.api. */
allplayers.event.api.prototype = new drupal.api();

/** Reset the constructor. */
allplayers.event.api.prototype.constructor = allplayers.event.api;
