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

//console.log('starting app...');

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
    // var hmap = new DrawMaps();
    // hmap.tuplesMerge(metric);
    // hmap.drawHeatMap();
    drawHeatMap();
    // hmap.drawFloorPlan();
    drawFloorPlan();
    // hmap.drawCircles();
    drawCircles();
    // combineCanvas();

};

// keep hash of data values by id
//static data
var data = {
    "00000000237547038fb7bdee": { temp: 100, desc: '2BF39R' },
    "00000000231263068fb7bdee": { temp: 100, desc: '2BF38R' },
    "00000000233010aeaf952dee": { temp: 100, desc: '2BF37R' },
    "00000000232e65058fb7bdee": { temp: 100, desc: '2BF38F' },
    "00000000236668afaf952dee": { temp: 100, desc: '2BF37F' }
};
// hash of x,y based on id
var locations = {
  "00000000237547038fb7bdee": [ 666, 425 ], // 2BF39 R
  "00000000231263068fb7bdee": [ 655, 425 ], // 2BF38 R
  "00000000233010aeaf952dee": [ 642, 425 ], // 2BF37 R 
  "00000000232e65058fb7bdee": [ 648, 443 ], // btwn 2BF37 2BF38 Front 
  "00000000236668afaf952dee": [ 638, 443 ],  // btwn 2BF37 2BF38 Front
};

//var heat; what's this for?

function regenData() {
  tuples = [];
  for (var id in locations) {
      if (id in data) {
          var t = locations[id].slice();
          t.push(data[id][metric])
          console.log('REGEN: %s %o', id, t);
          tuples.push(t);
      }
  }
}


// attach observers for when data is added or changed
Sensors.find().observe({
  added: function(datum) {
    console.log('sensor %s added() %o', datum._id, datum);
    // lookup location if not exist; use Session?
    if( ! datum._id in locations ) {
      // TODO location[_id] = []
    }
    data[datum._id] = datum
    // DrawMaps.drawHeatMap( metric );
    drawHeatMap();
    drawCircles();

  },
  changed: function(datum) {
    console.log('sensor %s changed() %o', datum._id, datum);
    regenData();
    // DrawMaps.drawHeatMap( metric );
    drawHeatMap();
    drawCircles();

  }
});

// function DrawMaps() {
//setup vars
    var tuples = [];
    var radius = 2;
//compose tuples
    // this.tuplesMerge = function (metric) {
    //
    //     for (var id in locations) {
    //         if (id in data) {
    //             var t = locations[id].slice();
    //             t.push(data[id][metric])
    //             console.log('%s %o', id, t);
    //             tuples.push(t);
    //         }
    //     }
    //     //console.log("data: %o", tuples);
    // }

// draw the floorplan
    function drawFloorPlan() {
        var plan = new Image();
        plan.src = "images/floorplan.svg";
        plan.onload = function () {
            var canvas = $('#floorplan');
            var ctx = canvas[0].getContext('2d');
            ctx.globalAlpha = 0.3;
            ctx.drawImage(plan, 50, 0, 1000, 1000 * plan.height / plan.width);
            ctx.globalAlpha = 1.0;
        };
    };

//draw the heatmap
    function drawHeatMap() {
        // remap data into an array of 3-tuples (x,y,v)
      
        var grad = {0.3: 'green', 0.6: 'orange', 1: 'red'}
        heat = simpleheat('heatmap').data(tuples).max(50).gradient(grad).radius(10, 40);
        heat.draw(1);
    };
//draw the contrasting circles
    function drawCircles(){
        var canvas = $('#contrast_circle');
        var ctx = canvas[0].getContext('2d');

        for (var id in tuples) {
            ctx.beginPath(); //open an svg path
            ctx.arc(tuples[id][0], tuples[id][1], radius, 0, 2 * Math.PI, false); //define arc
            ctx.closePath(); //close the path
            ctx.fillStyle = 'blue'; //define fill color
            ctx.fill(); //fill the path

            //console.log(ctx);

        }

    };

// }
//combine canvasi
function combineCanvas() {
    var floor = document.getElementsByName('#floorplan');
    // var ctFloor = floor.getContext('2d');
    var thisHeat = document.getElementsByName('#heatmap');
    // var ctHeat = thisHeat.getContext('2d');
    // circles = document.getElementsByName('#contrast_circle');
    // var ctCircles = circles.getContext('2d');
    var canvas = $('#contrast_circle');
    var ctx = canvas[0].getContext('2d');
    ctx.drawImage(floor, 0, 0);
    ctx.drawImage(thisHeat, 0, 0);

}