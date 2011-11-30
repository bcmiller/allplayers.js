(function($) {
  $.fn.group_navigator = function(params) {
    return $(this).each(function() {

      function render(nodes, id) {
        var hasNodes = false;
        var hasChildren = false;
        var childOut = '';
        var output = '<ul id="node_' + id + '">';
        for (var i in nodes) {
          if (nodes.hasOwnProperty(i)) {
            hasNodes = true;
            output += '<li>';
            if (nodes[i].title) {
              output += '<a href="#">' + nodes[i].title + '</a>';
            }
            if (nodes[i].below) {
              childOut = render(nodes[i].below, nodes[i].nid);
              hasChildren = !!childOut;
              output += childOut;
            }
            output += '</li>';
          }
        }
        output += '</ul>';
        if (hasChildren) {
          var span = document.createElement('span');
          span.setAttribute('class', 'collapsed');
        }
        output += hasChildren ? '<span id="expand_' + id + '" class="collapsed"></span>' : '';
        return hasNodes ? output : '';
      }

      var instance = $(this);
      if (params) {

        // Create a new group.
        new allplayers.group(params, function(group) {
          group.getGroupTree(function(tree) {
            instance.append(render(tree, 0));
          });
        });
      }
    });
  };
})(jQuery);

