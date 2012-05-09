(function($) {
  // Add the group select widget.
  $.fn.groupselect = function(params) {

    // Make sure we have default params.
    params = jQuery.extend({
      uuid:0,
      depth: 8
    },params);

    // Setup the drupal endpoint.
    drupal.endpoint = '/api/v1/rest';

    return $(this).each(function() {

      /**
       * Converts the drupal return of tree structure to the common
       * treeselect control pattern.
       */
      var getTree = function(node, nodes) {
        var treenode = {};
        if (nodes) {
          for (var id in nodes) {
            if (nodes.hasOwnProperty(id)) {
              var has_children = parseInt(nodes[id].has_children);
              if (nodes[id].title || has_children) {
                treenode = {
                  id: nodes[id].uuid || params.uuid,
                  value: nodes[id].nid,
                  title: nodes[id].title,
                  has_children: has_children,
                  children: []
                };
                treenode = getTree(treenode, nodes[id].below);
                node.children.push(treenode);
              }
            }
          }
        }
        return node;
      };

      /**
       * Called to load a new node.
       */
      params.load = function(node, callback) {
        var group = new allplayers.group({id:node.id || params.uuid});
        group.getGroupTree(params.depth, function(nodes) {
          callback(getTree(node, nodes));
        });
      };

      // Setup the input ID.
      params.inputId = 'chosentree-select-' + params.uuid;

      // Create the chosentree item.
      $(this).chosentree(params);
    });
  };
})(jQuery);

