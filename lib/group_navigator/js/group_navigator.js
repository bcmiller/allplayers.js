(function($) {
  // Add the group navigator.
  $.fn.group_navigator = function(id) {
    return $(this).each(function() {

      // Normalize the tree for the treeselect widget.
      function getTree(nodes) {
        var ids = [];
        for (var id in nodes) {
          if (nodes.hasOwnProperty(id)) {
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

      var instance = $(this);
      instance.append('<li class="treebusy"></li>');
      if (id) {

        // Loads the provided node.
        function loadNode(id, callback) {
          new allplayers.group({id:id}, function(group) {
            group.getGroupTree(3, function(tree) {
              callback(getTree(tree));
            });
          });
        }

        // Load the current node.
        loadNode(id, function(tree) {
          instance.empty().treeselect({
            tree:tree,
            load:function(id, callback) {
              loadNode(id, callback);
            }
          });
        });
      }
    });
  };
})(jQuery);

