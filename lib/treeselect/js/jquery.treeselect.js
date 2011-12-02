(function($) {

  // The tree select control.
  $.fn.treeselect = function(params) {

    // Setup the default parameters.
    params = $.extend({
      margin: 18, /** The margin between levels. */
      space: 4, /** The space between elements. */
      basecolor: 238, /** The base color. 238 = #EE */
      gradient: 8, /** The change in color between levels. */
      colwidth: 13, /** The column width for the first two columsn. */
      tree: null /** An array that defines the tree structure. */
    },params);

    // Expand/Contract all elements with a certain ID.
    function expandClick(id, collapsed) {
      if (collapsed) {
        $('ul[ref="' + id + '"]').show('fast');
        $('[ref="' + id + '"]').removeClass('collapsed').addClass('expanded');
      }
      else {
        $('ul[ref="' + id + '"]').hide('fast');
        $('[ref="' + id + '"]').removeClass('expanded').addClass('collapsed');
      }
    }

    // Renders the tree structure as HTML.
    function render(tree, node) {
      tree = tree || params.tree;
      node = node || null;
      var output = '', childOut = '';

      for (var i in tree) {
        if (tree.hasOwnProperty(i)) {
          var child = tree[i];
          childOut += '<li>';
          childOut += '<input type="checkbox" />';
          childOut += render((child.children ? child.children : []), child);
          childOut += '</li>';
        }
      }

      // Add the +/- symbol and the title.
      if (node) {
        output += childOut ? '<span class="collapsed"></span>' : '';
        output += '<a href="#" class="collapsed">' + node.title + '</a>';
      }

      // Add the child output.
      if (childOut) {
        output += node ? '<ul>' : '';
        output += childOut;
        output += node ? '</ul>' : '';
      }

      return output;
    }

    // Recursive function to make the tree.
    function makeTree(children, level, id, tree) {

      // Default the level to be 0.
      tree = tree || params.tree;
      level = level || 0;
      id = id || 0;

      // Define the margin between each level.
      var margin = (level * params.margin), i = 0;

      // Iterate through each child.
      children.each(function() {

        // Get the list item.
        var listItem = $(this);
        var oddEven = (i % 2) ? 'even' : 'odd';
        var itemId = id + '-' + i;
        var left = 0;

        // For odd items, add the background color...
        if (oddEven == 'odd') {
          var background = params.basecolor - (level * params.gradient);
          background = (background).toString(16);
          background = (background + background + background);
          listItem.css('backgroundColor', '#' + background);
        }

        // Now add the correct spacing for elements in this list.
        listItem.addClass(oddEven);

        // Setup the input checkboxes.
        left = margin;

        // Get the input value based on the tree passed into this widget.
        var inputValue = tree ? tree[i].id : itemId;

        // Setup the input checkbox.
        var input = listItem.children('input:checkbox');
        input.attr({'ref': itemId, 'value': inputValue});
        input.css('left', left + 'px');
        input.bind('click', {id: itemId}, function(event) {
          var checked = $(event.target).is(':checked');

          // If it is checked, make sure it expands to let them know it has
          // selected other items.
          if (checked) {
            expandClick(event.data.id, true);
          }

          // Iterate through all the intputs within the list and check/uncheck
          // them as well.
          $('ul[ref="' + event.data.id + '"] input').each(function() {
            $(this).attr('checked', checked);
          });
        });

        // Setup the span "+/-" element.
        var span = listItem.children('span');
        left += (params.colwidth + params.space);
        span.attr('ref', itemId);
        span.css({'cursor': 'pointer', 'left': left + 'px'});
        span.bind('click', {id: itemId}, function(event) {
          event.preventDefault();
          expandClick(event.data.id, $(event.target).hasClass('collapsed'));
        });

        // Setup the a "title" element.
        var link = listItem.children('a');
        left += (params.colwidth + params.space);
        link.attr('ref', itemId);
        link.css({'cursor': 'pointer', 'marginLeft': left + 'px'});
        link.bind('click', {id: itemId}, function(event) {
          event.preventDefault();
          expandClick(event.data.id, $(event.target).hasClass('collapsed'));
        });

        // Get the list item.
        var list = listItem.children('ul');
        list.attr('ref', itemId);

        // Get the children items.
        var childlist = list.children('li');
        if (childlist.length > 0) {

          // Make the tree for the children.
          var childTree = tree ? tree[i].children : null;
          makeTree(childlist, (level + 1), itemId, childTree);
        }

        // Iterate the index.
        i++;
      });
    };

    // Iterate through each instance.
    return $(this).each(function() {

      var children = $(this).children('li');

      // If no children are found, then render the tree.
      if (children.length == 0) {

        // Render the tree.
        $(this).append(render());
        children = $(this).children('li');
      }

      // Make the tree.
      makeTree(children);
    });
  };
})(jQuery);
