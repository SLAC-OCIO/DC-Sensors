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


// TODO link to a drop down in ui
var metric = 'temp';


Template.sensor_list.rendered = function(){
    var hmap = new DrawMaps();
    hmap.drawHeatMap( metric );
    hmap.drawFloorPlan();

};

// keep hash of data values by id
//var data = {};

//static data
var data = {
    "00000000236668afaf952dee": { temp: 23 },
    "00000000232e65058fb7bdee": { temp: 32 },
    "00000000230e80068fb7bdee": { temp: 36 },
    "00000000230e80068fb7bdef": { temp: 33 },
    "00000000230e80068fb7bdeb": { temp: 65 }
};
// hash of x,y based on id
var locations = {
    "00000000236668afaf952dee": [ 250, 200 ],
    "00000000232e65058fb7bdee": [ 400, 400 ],
    "00000000230e80068fb7bdee": [ 500, 500 ],
    "00000000230e80068fb7bdef": [ 500, 550 ],
    "00000000230e80068fb7bdeb": [ 500, 575 ]
};

var heat;

// attach observers for when data is added or changed
Sensors.find().observe({
  added: function(datum) {
    console.log('sensor %s added() %o', datum._id, datum);
    // lookup location if not exist; use Session?
    if( ! datum._id in locations ) {
      // TODO location[_id] = []
    }
    data[datum._id] = datum
    DrawMaps.drawHeatMap(metric );
  },
  changed: function(datum) {
    console.log('sensor %s changed() %o', datum._id, datum);
    DrawMaps.drawHeatMap( metric );
  }
});
function DrawMaps() {
//setup vars
    var tuples = [];
    var radius = 10;
    var contrast = [];


// draw the floorplan
    this.drawFloorPlan = function () {
        var plan = new Image();
        plan.src = "images/floorplan.svg";
        plan.onload = function () {
            var canvas = $('#floorplan');
            var ctx = canvas[0].getContext('2d');
            ctx.globalAlpha = 0.3;
            ctx.drawImage(plan, 50, 0, 1000, 1000 * plan.height / plan.width);
            ctx.globalAlpha = 1.0;
        };


    }
//draw the heatmap
    this.drawHeatMap = function (metric) {
        // remap data into an array of 3-tuples (x,y,v)

        for (var id in locations) {
            if (id in data) {
                var t = locations[id].slice();
                t.push(data[id][metric])
                console.log('%s %o', id, t);
                tuples.push(t);
            }
        }

        for (var id in locations) {
            if (id in data) {
                var t = locations[id].slice();
                t.push(data[id], radius)
                console.log('%s %o', id, t);
                contrast.push(t);
            }
        }
        // console.log("data: %o", tuples);
        heat = simpleheat('heatmap').data(tuples).max(20).radius(5, 20);
        heat.draw(0.5);
    }
//draw the contrasting circles
    this.contrastingCircles = function () {
        var canvas = $('#contrast_circle');
        var ctx = canvas[0].getContext('2d');
        //wrap this in a for loop
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.draw(1,1);
        //end loop
        //var contrastCircle = d3.selectAll("circle");
    }
};