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