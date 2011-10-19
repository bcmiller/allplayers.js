(function($) {
  $(function() {

    test('allplayers_entity', 9, function() {

      // Create a new API.
      var api = new allplayers.api({
        api_path: 'http://testing'
      });

      // Create a new entity.
      var entity = new allplayers.entity(api, {
        optionA: 'testing',
        optionB: 'testing2'
      });

      equal(entity.options.optionA, 'testing', 'Option A saved');
      equal(entity.options.optionB, 'testing2', 'Option B saved');
      equal(entity.api.options.api_path, 'http://testing', 'API Path saved');

      entity.update({
        title:'Test Title',
        description:'Test Description',
        uuid:'12345'
      });

      equal(entity.title, 'Test Title', 'Title update passed');
      equal(entity.description, 'Test Description', 'Description update passed');
      equal(entity.uuid, '12345', 'UUID update passed');

      var object = entity.getObject();
      equal(object.title, 'Test Title', 'getObject title passed');
      equal(object.description, 'Test Description', 'getObject description passed');
      equal(object.uuid, '12345', 'getObject uuid passed');
    });
  });
}(jQuery));