(function($) {
  $.fn.group_navigator = function(params) {
    return $(this).each(function() {

      function render(nodes, parent, level) {
        parent = parent || null;
        level = level || 0;
        var output = '', space = level*18;

        if (parent) {
          output += '<a href="#" style="padding-left:' + (space+18) + 'px;" ref="' + parent.nid + '" class="collapse_handle collapsed">' + parent.title + '</a>';
        }

        var childOut = '';
        var i = 0;
        for (var id in nodes) {
          if (nodes.hasOwnProperty(id)) {
            // Give it odd and even and
            var oddEven = (i++%2) ? 'even' : 'odd';
            var background = (238 - level*8).toString(16);
            var style = (oddEven == 'odd') ? 'style="background-color:#' + background + background + background + ';" ' : '';
            childOut += '<li ' + style + 'class="' + oddEven + '">';
            childOut += '<input style="left:' + space + 'px;" type="checkbox" class="group_navigator_select" ref="' + nodes[id].nid + '" />';
            childOut += render(nodes[id].below, nodes[id], (level+1));
            childOut += '</li>';
          }
        }

        if (childOut) {
          output += parent ? '<ul id="list_' + parent.nid + '">' : '';
          output += childOut;
          output += parent ? '</ul>' : '';
          output += parent ? '<span style="left:' + space + 'px;" ref="' + parent.nid + '" class="collapse_handle collapsed"></span>' : '';
        }

        return output;
      }

      var instance = $(this);
      if (params) {

        // Create a new group.
        new allplayers.group(params, function(group) {

          // Get the group tree.
          group.getGroupTree(function(tree) {

            // Add the tree to the markup.
            instance.append(render(tree));

            // Create a click handler for all the expand/contract links.
            $(".collapse_handle", instance).css('cursor', 'pointer').click(function(event) {
              event.preventDefault();
              var id = $(event.target).attr('ref');
              var collapsed = $(event.target).hasClass('collapsed');
              if (collapsed) {
                $('ul#list_' + id).show("fast");
                $('[ref="' + id + '"]').removeClass('collapsed');
                $('[ref="' + id + '"]').addClass('expanded');
              }
              else {
                $('ul#list_' + id).hide("fast");
                $('[ref="' + id + '"]').removeClass('expanded');
                $('[ref="' + id + '"]').addClass('collapsed');
              }
            });

            // Create a checkbox handler that will select the inputs.
            $("input.group_navigator_select").click(function(event) {

              // Check to make sure this is an input.
              if ($(event.target).is('input:checkbox')) {

                // Get the checked state of this input.
                var checked = $(event.target).is(":checked");
                var id = $(event.target).attr('ref');

                // Iterate through all the intputs under this one and set the
                // state accordingly.
                $("ul#list_" + id + " input").each(function() {
                  $(this).attr('checked', checked);
                });
              }
            });
          });
        });
      }
    });
  };
})(jQuery);

