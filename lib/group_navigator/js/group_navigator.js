(function($) {
  // Add the group navigator.
  $.fn.group_navigator = function(params) {

    // Make sure we have default params.
    params = jQuery.extend({
      id:0,
      loaded:null
    },params);

    return $(this).each(function() {

      // An object to hold all the treenodes.
      var treenodes = {};

      // Normalize the tree for the treeselect widget.
      function getTree(nodes) {
        var tree = [], treenode = {}, inclusive = false;
        for (var id in nodes) {
          if (nodes.hasOwnProperty(id)) {

            // See if this node has children.
            var has_children = parseInt(nodes[id].has_children);

            // Setup the treenode.
            treenode = {
              id:nodes[id].uuid,
              title:nodes[id].title,
              has_children:has_children,
              children:getTree(nodes[id].below)
            };

            // Add this treenode to the tree.
            tree.push(treenode);

            // We consider this node inclusive if it has children but they
            // have not been loaded...
            inclusive = has_children;
            inclusive &= (treenode.children.length == 0);

            // Adding this to the node names.
            treenodes['treeselect-' + nodes[id].uuid] = {
              title:nodes[id].title,
              nid:nodes[id].nid,
              inclusive:inclusive
            };
          }
        }
        return tree;
      }

      // Loads the provided node.
      function loadNode(id, callback) {
        var group = new allplayers.group({id:id});
        group.getGroupTree(3, function(tree) {
          callback(getTree(tree));
        });
      }

      var treeparams = {
        load:function(id, callback) {
          loadNode(id, callback);
        }
      };

      if (params.loaded) {
        treeparams.loaded = function(treeselect) {

          // Get the checkbox input names within this tree.
          var names = [];
          $('input:checkbox', treeselect).each(function() {
            names.push($(this).attr('name'));
          });

          // Call the loaded function with the form_id and the new input names.
          params.loaded({names:names, nodes:treenodes});
        };
      }

      // Create the treechosen item.
      $(this).treechosen(treeparams);
    });
  };
})(jQuery);

