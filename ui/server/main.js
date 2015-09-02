Meteor.startup(function () {

  console.log("starting server...");

  Sensors = new Meteor.Collection('sensors');

  var Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true,
    defaultHeaders: {
      'Content-Type': 'application/json'
    }
  });
  
  Api.addCollection( Sensors );
  
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