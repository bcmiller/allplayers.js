(function($) {
  // Add the group navigator.
  $.fn.group_navigator = function(params) {
    return $(this).each(function() {

      // Normalize the tree for the treeselect widget.
      function getTree(nodes, pid) {
        var ids = [];
        for (var id in nodes) {
          if (nodes.hasOwnProperty(id)) {
            ids.push({
              id:id,
              title:nodes[id].title,
              children:getTree(nodes[id].below, nodes[id].nid)
            });
          }
        }
        return ids;
      }

      var instance = $(this);
      if (params) {

        // Create a new group.
        new allplayers.group(params, function(group) {

          // Get the group tree 3 levels deep.
          group.getGroupTree(3, function(tree) {

            // Turn this into a tree select widget.
            instance.treeselect({tree:getTree(tree)});

          });
        });
      }
    });
  };
})(jQuery);

