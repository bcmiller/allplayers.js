(function($) {
  // Add the group navigator.
  $.fn.group_navigator = function(params) {

    // Make sure we have default params.
    params = jQuery.extend({
      id:0,
      loaded:null
    },params);

    return $(this).each(function() {

      // An object to translate uuid names, to nodes.
      var node_names = {};

      // Normalize the tree for the treeselect widget.
      function getTree(nodes) {
        var ids = [];
        for (var id in nodes) {
          if (nodes.hasOwnProperty(id)) {
            node_names['treeselect-' + nodes[id].uuid] = nodes[id].nid;
            ids.push({
              id:nodes[id].uuid,
              title:nodes[id].title,
              has_children:nodes[id].has_children,
              children:getTree(nodes[id].below)
            });
          }
        }
        return ids;
      }

      // Loads the provided node.
      function loadNode(id, callback) {
        var group = new allplayers.group({id:id});
        group.getGroupTree(3, function(tree) {
          callback(getTree(tree));
        });
      }

      var instance = $(this);
      instance.append('<li class="treebusy"></li>');
      if (params.id) {

        // Load the current node.
        loadNode(params.id, function(tree) {
          var treeparams = {
            tree:tree,
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
              params.loaded({names:names, nodes:node_names});
            };
          }

          // Create the tree.
          instance.empty().treeselect(treeparams);
        });
      }
    });
  };
})(jQuery);

