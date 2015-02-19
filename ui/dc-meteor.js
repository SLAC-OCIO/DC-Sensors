if (Meteor.isClient) {

  Sensors = new Meteor.Collection('sensor');

  // counter starts at 0
  // Session.setDefault('counter', 0);

  // Template.hello.helpers({
  //   counter: function () {
  //     return Session.get('counter');
  //   }
  // });
  //
  // Template.hello.events({
  //   'click button': function () {
  //     // increment the counter when button is clicked
  //     Session.set('counter', Session.get('counter') + 1);
  //   }
  // });
  
  console.log('staring app...');
  
  Template.sensor_list.helpers({
    sensors: function() {
      return Sensors.find();
    }
  });
  
  Template.sensor_list.rendered = function(){
    console.log("updated!");
  };
  
}

if (Meteor.isServer) {
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
}
