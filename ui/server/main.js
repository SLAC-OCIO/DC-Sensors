Meteor.startup(function () {

  // config rest endpoints
  Restivus.configure({
    useAuth: false,
    prettyJson: false
  });
  Restivus.addCollection("sensor", {
    excludedEndpoints: ['getAll','deleteAll','delete','post'],
    defaultOptions: {},
  });
  
  
});