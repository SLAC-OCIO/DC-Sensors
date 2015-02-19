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

console.log('starting app...');

Template.sensor_list.helpers({
  sensors: function() {
    return Sensors.find();
    Meteor.call('findSensors', {}, function(e,r){
      console.log('findSensors e:', e);
    });
  }
});

// Template.sensor_list.rendered = function(){
//   console.log("updated!");
// };

// keep hash of data values by id
var data = {};
// hash of x,y based on id
var locations = {
  "00000000236668afaf952dee": [ 300, 300 ],
  "00000000232e65058fb7bdee": [ 400, 400 ], 
  "00000000230e80068fb7bdee": [ 500, 500 ], 
};

var heat;


// draw the heatmap
var drawHeatMap = function ( metric ) {
  var plan = new Image();
  plan.src = "images/floor2.svg";
  plan.onload = function(){
    var canvas = $('#heatmap');
    var ctx = canvas[0].getContext('2d');
    ctx.drawImage( plan,0,0, 1000, 1000 * plan.height / plan.width );
  };
  // remap data into an array of 3-tuples (x,y,v)
  var tuples = []
  for ( var id in locations ) {
    if ( id in data ) {
      var t = locations[id].slice();
      t.push( data[id][metric] )
      // console.log('%s %o', id, t);
      tuples.push( t );
    }
  }
  // console.log("data: %o", tuples);
  heat = simpleheat('heatmap').data(tuples).max(20).radius( 10,40 );
  heat.draw(0.5);
}

// TODO link to a drop down in ui
var metric = 'temp';

// attach observers for when data is added or changed
Sensors.find().observe({
  added: function(datum) {
    console.log('sensor %s added() %o', datum._id, datum);
    // lookup location if not exist; use Session?
    if( ! datum._id in locations ) {
      // TODO location[_id] = []
    }
    data[datum._id] = datum
    drawHeatMap( metric );
  },
  changed: function(datum) {
    console.log('sensor %s changed() %o', datum._id, datum);
    drawHeatMap( metric );
  }
});