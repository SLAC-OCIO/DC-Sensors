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
  
  Meteor.methods({
    findSensors: function(arg){
      // check(arg,String)
      console.log('findSensors( ' + arg + ')');

      // if ( true ) {
      //   throw new Meteor.Error("some error here!");
      // }
      return 'findSensors()';
    }
  });
  
  
  
});