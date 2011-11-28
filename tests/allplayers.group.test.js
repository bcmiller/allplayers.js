
asyncTest("Group Search", function() {

  // Find some groups based on a search.
  new allplayers.group({search:"Spring Soccer"}, function(groups) {

    expect(1 + 2*groups.length);
    start();
    ok(!!groups.length, "Groups were found.");
    for (var i in groups) {
      ok(!!groups[i].id, "Group ID was found");
      ok(!!groups[i].title, "Group Title was found");
    }
  });

});

