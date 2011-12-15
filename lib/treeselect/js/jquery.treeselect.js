(function($) {

  // The tree select control.
  $.fn.treeselect = function(params) {

    // Setup the default parameters.
    params = $.extend({
      margin: 18, /** The margin between levels. */
      space: 4, /** The space between elements. */
      basecolor: 238, /** The base color. 238 = #EE */
      gradient: 0, /** The change in color between levels. */
      colwidth: 13, /** The column width for the first two columsn. */
      tree: null, /** An array that defines the tree structure. */
      load: null, /** Callback function to load a new node */
      loaded: null, /** Callback function to get called when a tree loads. */
      level: 0, /** The level to start the tree at. */
      odd: false, /** Determines if the striping should start odd or even. */
      checked: false /** If all the inputs should be checked in this tree. */
    },params);

    // Expand/Contract all elements with a certain ID.
    function expandClick(target, id, level, collapsed) {

      // Only continue if we have a +/- symbol.
      var input = $('input[ref="' + id + '"]');
      var checked = input.is(':checked');
      if ($('span[ref="' + id + '"]').length > 0) {
        if (collapsed) {

          // Check to see if there are children...
          var list = $('ul[ref="' + id + '"]');
          if ((list.length == 0) && params.load) {

            // Need to load the new list...
            target = $(target);
            var left = input.css('left');
            var parent = target.parent('li');

            // See if this is odd or even.
            var odd = parent.hasClass('odd');

            // Get the child output.
            var childOut = $('<ul><li></li></ul>');
            childOut.find('li').addClass('treebusy').css('marginLeft', left);

            // Append the child to the parent and then show it.
            parent.append(childOut);
            parent.find('ul').attr('ref', id).addClass('expanded').show('fast');
            params.load(id, function(tree) {
              treeparams = $.extend(params, {
                tree: tree,
                level: (level + 1),
                odd: odd,
                checked: checked
              });
              parent.find('ul').empty().treeselect(treeparams);
            });
          }
          else {
            $('ul[ref="' + id + '"]').show('fast');
          }

          $('[ref="' + id + '"]').removeClass('collapsed').addClass('expanded');
        }
        else {
          $('ul[ref="' + id + '"]').hide('fast');
          $('[ref="' + id + '"]').removeClass('expanded').addClass('collapsed');
        }
      }
      else if (target.nodeName.toLowerCase() != 'input') {

        // If they click on the link, and there is no +/- symbol, then we
        // can assume they wish to toggle the checkbox.
        input.attr('checked', !checked);
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
          childOut += render((child.children ? child.children : []), child);
          childOut += '</li>';
        }
      }

      // Add the +/- symbol, input box, and the title.
      if (node) {
        if (childOut || node.has_children) {
          output += '<span class="collapsed"></span>';
        }
        output += '<input type="checkbox" name="treeselect-' + node.id + '" />';
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
    function makeTree(children, level, id, tree, odd, checked) {

      // Default the level to be 0.
      tree = tree || params.tree;
      level = level || 0;
      id = id || 0;
      checked = checked || false;

      // Define the margin between each level.
      var margin = (level * params.margin), i = 0, odd = odd || false;

      // Iterate through each child.
      children.each(function() {

        // Get the list item.
        var listItem = $(this);
        odd = !odd;
        var oddEven = odd ? 'odd' : 'even';
        var itemId = (tree && tree[i].id) ? tree[i].id : id + '-' + i;
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

        // Setup the input checkbox.
        var input = listItem.children('input:checkbox');
        input.attr({'ref': itemId, 'value': itemId, 'checked': checked});
        input.css('left', left + 'px');
        input.bind('click', {id: itemId, level: level}, function(event) {
          var checked = $(event.target).is(':checked');

          // If it is checked, make sure it expands to let them know it has
          // selected other items.
          if (checked) {
            expandClick(event.target, event.data.id, event.data.level, true);
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
        span.bind('click', {id: itemId, level: level}, function(event) {
          event.preventDefault();
          var collapsed = $(event.target).hasClass('collapsed');
          expandClick(event.target, event.data.id, event.data.level, collapsed);
        });

        // Setup the a "title" element.
        var link = listItem.children('a');
        left += (params.colwidth + params.space);
        link.attr('ref', itemId);
        link.css({'cursor': 'pointer', 'marginLeft': left + 'px'});
        link.bind('click', {id: itemId, level: level}, function(event) {
          event.preventDefault();
          var collapsed = $(event.target).hasClass('collapsed');
          expandClick(event.target, event.data.id, event.data.level, collapsed);
        });

        // Get the list item.
        var list = listItem.children('ul');
        list.attr('ref', itemId);

        // Get the children items.
        var childlist = list.children('li');
        if (childlist.length > 0) {

          // Make the tree for the children.
          var childTree = tree ? tree[i].children : null;
          makeTree(childlist, (level + 1), itemId, childTree, odd, checked);
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

      // Make the tree at a certain level.
      makeTree(children, params.level, null, null, params.odd, params.checked);

      // Call the loaded callback.
      if (params.loaded) {
        params.loaded(this);
      }
    });
  };
})(jQuery);
