Sensors = new Meteor.Collection('sensor');

// session not working...
var isShowAllSensors = true;

Template.upper_chrome.events({
  "click [data-role='button']": function (e) {
    var opposite = isShowAllSensors == true ? false : true;
    isShowAllSensors = opposite;
  }
});

//console.log('starting app...');

Template.sensor_list.helpers({
  sensors: function() {
    return Sensors.find();
    Meteor.call('findSensors', {}, function(e,r){
      console.log('findSensors e:', e);
    });
  }
});


var metric = 'temp';

Template.sensor_list.rendered = function(){
    drawFloorPlan( $('#floorplan'), "images/floorplan.svg" );
    redraw( metric );
};

// keep hash of data values by id
//static data
var data = {
  "00000000237547038fb7bdee": { temp: 35 },
  "00000000231263068fb7bdee": { temp: 28 },
  "00000000233010aeaf952dee": { temp: 24 },
  "00000000232e65058fb7bdee": { temp: 16 },
  "00000000236668afaf952dee": { temp: 14 }
};
// hash of x,y based on id
var locations = {
  "00000000237547038fb7bdee": [ 666, 425, '2BF39R' ], // 2BF39 R
  "00000000231263068fb7bdee": [ 655, 425, '2BF38R' ], // 2BF38 R
  "00000000233010aeaf952dee": [ 642, 425, '2BF37R' ], // 2BF37 R 
  "00000000232e65058fb7bdee": [ 648, 443, '2BF38F' ], // btwn 2BF37 2BF38 Front 
  "00000000236668afaf952dee": [ 638, 443, '2BF37F' ],  // btwn 2BF37 2BF38 Front
  "00000000233b6c068fb7bdee": [ 666, 443, '2BF39F' ],



  "000bf40": [ 678, 425 ],
  "000bf41": [ 689, 425 ],

  "000bg40": [ 678, 443 ],
  "000bg41": [ 689, 443 ],

  "000bi37": [ 644, 465 ],
  "000bi38": [ 655, 465 ],
  "000bi39": [ 666, 465 ],
  "000bi40": [ 678, 465 ],
  "000bi41": [ 689, 465 ],

  "000bj37": [ 644, 477 ],
  "000bj38": [ 655, 477 ],
  "000bj39": [ 666, 477 ],
  "000bj40": [ 678, 477 ],
  "000bj41": [ 689, 477 ],

  "000ac03": [ 265, 150 ],
  // "000ac04": [ 277, 150 ],
  // "000ac05": [ 288, 150 ],
  // "000ac06": [ 299, 150 ],
  "000ac07": [ 310, 150 ],
  // "000ac08": [ 321, 150 ],
  // "000ac11": [ 332, 150 ],
  // "000ac12": [ 343, 150 ],
  // "000ac13": [ 354, 150 ],
  "000ac14": [ 365, 150 ],
  "000ac13": [ 376, 150 ],
  "000ac14": [ 387, 150 ],
  "000ac15": [ 398, 150 ],

  "000ae03": [ 265, 168 ],
  // "000ae02": [ 277, 168 ],
  // "000ae03": [ 288, 168 ],
  // "000ae04": [ 299, 168 ],
  "000ae07": [ 310, 168 ],
  // "000ae06": [ 321, 168 ],
  // "000ae07": [ 332, 168 ],
  // "000ae08": [ 343, 168 ],
  // "000ae09": [ 354, 168 ],
  // "000ae10": [ 365, 168 ],
  "000ae13": [ 376, 168 ],
  "000ae14": [ 387, 168 ],
  "000ae15": [ 398, 168 ],


  "000ag04": [ 277, 183 ],
  "000ag05": [ 288, 183 ],
  "000ag06": [ 299, 183 ],
  "000ag07": [ 310, 183 ],
  "000ag08": [ 321, 183 ],
  "000ag09": [ 332, 183 ],
  "000ag10": [ 343, 183 ],
  "000ag11": [ 354, 183 ],
  "000ag12": [ 365, 183 ],
  "000ag13": [ 380, 183 ],
  "000ag14": [ 391, 183 ],
  "000ag15": [ 402, 183 ],

  "000ai04": [ 277, 203 ],
  "000ai05": [ 288, 203 ],
  "000ai06": [ 299, 203 ],
  "000ai07": [ 310, 203 ],
  "000ai08": [ 321, 203 ],
  "000ai09": [ 332, 203 ],
  "000ai10": [ 343, 203 ],
  "000ai11": [ 354, 203 ],
  "000ai12": [ 365, 203 ],
  "000ai13": [ 380, 203 ],
  "000ai14": [ 391, 203 ],
  "000ai15": [ 402, 203 ],

  "000ad17": [ 425, 152 ],
  "000ae17": [ 425, 163 ],
  "000af17": [ 425, 174 ],
  "000ag17": [ 425, 185 ],
  "000ah17": [ 425, 196 ],
  "000ai17": [ 425, 207 ],

  "000ad19": [ 438, 152 ],
  "000ae19": [ 438, 163 ],
  "000af19": [ 438, 174 ],
  "000ag19": [ 438, 185 ],
  "000ah19": [ 438, 196 ],
  "000ai19": [ 438, 207 ],


  "000al04": [ 281, 237 ],
  "000al05": [ 292, 237 ],
  "000al06": [ 303, 237 ],
  "000al07": [ 313, 237 ],
  "000al08": [ 323, 237 ],
  "000al09": [ 334, 237 ],
  "000al10": [ 344, 237 ],
  "000al11": [ 355, 237 ],
  "000al12": [ 370, 237 ],

  "000an04": [ 281, 256 ],
  "000an05": [ 292, 256 ],
  "000an06": [ 303, 256 ],
  "000an07": [ 313, 256 ],
  "000an08": [ 323, 256 ],
  "000an09": [ 334, 256 ],
  "000an10": [ 344, 256 ],
  "000an11": [ 355, 256 ],
  "000an12": [ 370, 256 ],

  "000ap06": [ 299, 276 ],
  "000ap07": [ 310, 276 ],
  "000ap08": [ 322, 276 ],
  "000ap09": [ 332, 276 ],
  "000ap10": [ 344, 276 ],
  "000ap11": [ 355, 276 ],
  "000ap12": [ 366, 276 ],
  "000ap13": [ 378, 276 ],
  "000ap14": [ 390, 276 ],

  "000ar06": [ 299, 291 ],
  "000ar07": [ 310, 291 ],
  "000ar08": [ 322, 291 ],
  "000ar09": [ 332, 291 ],
  "000ar10": [ 344, 291 ],
  "000ar11": [ 355, 291 ],
  "000ar12": [ 366, 291 ],
  "000ar13": [ 378, 291 ],
  "000ar14": [ 390, 291 ],

  "000as06": [ 297, 309 ],
  "000as07": [ 309, 309 ],
  "000as08": [ 322, 309 ],
  "000as09": [ 332, 309 ],
  "000as10": [ 344, 309 ],
  "000as11": [ 355, 309 ],
  "000as12": [ 366, 309 ],
  "000as13": [ 378, 309 ],
  "000as14": [ 390, 309 ],

  "000au06": [ 297, 322 ],
  "000au07": [ 309, 322 ],
  "000au08": [ 322, 322 ],
  "000au09": [ 332, 322 ],
  "000au10": [ 344, 322 ],
  "000au11": [ 355, 322 ],
  "000au12": [ 366, 322 ],
  "000au13": [ 378, 322 ],
  "000au14": [ 390, 322 ],

  "000av05": [ 287, 341 ],
  "000av06": [ 298, 341 ],
  "000av07": [ 310, 341 ],
  "000av08": [ 322, 341 ],
  "000av09": [ 332, 341 ],
  "000av10": [ 344, 341 ],
  "000av11": [ 355, 341 ],
  "000av12": [ 366, 341 ],
  "000av13": [ 378, 341 ],

  "000ax05": [ 287, 355 ],
  "000ax06": [ 298, 355 ],
  "000ax07": [ 310, 355 ],
  "000ax08": [ 322, 355 ],
  "000ax09": [ 332, 355 ],
  "000ax10": [ 344, 355 ],
  "000ax11": [ 355, 355 ],
  "000ax12": [ 366, 355 ],
  "000ax13": [ 378, 355 ],

  "000ay05": [ 285, 371 ],
  "000ay06": [ 300, 371 ],
  "000ay07": [ 315, 371 ],
  "000ay08": [ 325, 371 ],
  "000ay10": [ 341, 371 ],
  "000ay11": [ 353, 371 ],
  "000ay12": [ 366, 371 ],
  "000ay13": [ 378, 371 ],

  "000ba05": [ 285, 385 ],
  "000ba06": [ 300, 385 ],
  "000ba07": [ 315, 385 ],
  "000ba08": [ 325, 385 ],
  "000ba10": [ 341, 385 ],
  "000ba11": [ 353, 385 ],
  "000ba12": [ 366, 385 ],
  "000ba13": [ 378, 385 ],

  "000bc02": [ 257, 406 ],
  "000bc03": [ 268, 406 ],
  "000bc04": [ 279, 406 ],
  "000bc05": [ 290, 406 ],
  "000bc06": [ 300, 406 ],
  "000bc07": [ 311, 406 ],
  "000bc08": [ 322, 406 ],
  "000bc10": [ 343, 406 ],
  "000bc11": [ 355, 406 ],
  "000bc12": [ 366, 406 ],
  "000bc13": [ 378, 406 ],
  "000bc14": [ 389, 406 ],

  "000be02": [ 257, 422 ],
  "000be03": [ 268, 422 ],
  "000be04": [ 279, 422 ],
  "000be05": [ 290, 422 ],
  "000be06": [ 300, 422 ],
  "000be07": [ 311, 422 ],
  "000be08": [ 322, 422 ],
  "000be10": [ 343, 422 ],
  "000be11": [ 355, 422 ],
  "000be12": [ 366, 422 ],
  "000be13": [ 378, 422 ],
  "000be14": [ 389, 422 ],

  "000ad26": [ 520, 150 ],
  "000ad27": [ 532, 150 ],
  "000ad28": [ 544, 150 ],
  "000ad29": [ 556, 150 ],
  "000ad30": [ 568, 150 ],
  "000ad31": [ 580, 150 ],
  "000ad32": [ 592, 150 ],
  "000ad33": [ 604, 150 ],

  "000af26": [ 520, 166 ],
  "000af27": [ 532, 166 ],
  "000af28": [ 544, 166 ],
  "000af29": [ 556, 166 ],
  "000af30": [ 568, 166 ],
  "000af31": [ 580, 166 ],
  "000af32": [ 592, 166 ],
  "000af33": [ 604, 166 ],

  "000ah24": [ 499, 192 ],
  "000ah25": [ 511, 192 ],
  "000ah26": [ 523, 192 ],
  "000ah27": [ 535, 192 ],
  "000ah28": [ 548, 192 ],
  "000ah29": [ 561, 192 ],
  "000ah30": [ 573, 192 ],
  "000ah31": [ 586, 192 ],

  "000aj24": [ 499, 209 ],
  "000aj25": [ 511, 209 ],
  "000aj26": [ 523, 209 ],
  "000aj27": [ 535, 209 ],
  "000aj28": [ 548, 209 ],
  "000aj29": [ 561, 209 ],
  "000aj30": [ 573, 209 ],
  "000aj31": [ 586, 209 ],

  "000ak24": [ 499, 226 ],
  "000ak25": [ 510, 226 ],
  "000ak26": [ 521, 226 ],
  "000ak27": [ 533, 226 ],
  "000ak28": [ 546, 226 ],
  "000ak29": [ 559, 226 ],
  "000ak30": [ 570, 226 ],
  "000ak31": [ 581, 226 ],

  "000am24": [ 499, 242 ],
  "000am25": [ 510, 242 ],
  "000am26": [ 521, 242 ],
  "000am27": [ 533, 242 ],
  "000am28": [ 546, 242 ],
  "000am29": [ 559, 242 ],
  "000am30": [ 570, 242 ],
  "000am31": [ 581, 242 ],

  "000ao24": [ 502, 262 ],
  "000ao25": [ 513, 262 ],
  "000ao26": [ 524, 262 ],
  "000ao27": [ 534, 262 ],
  "000ao28": [ 544, 262 ],
  "000ao29": [ 555, 262 ],
  "000ao30": [ 566, 262 ],
  "000ao31": [ 577, 262 ],

  "000aq24": [ 502, 280 ],
  "000aq25": [ 513, 280 ],
  "000aq26": [ 524, 280 ],
  "000aq27": [ 534, 280 ],
  "000aq28": [ 544, 280 ],
  "000aq29": [ 555, 280 ],
  "000aq30": [ 566, 280 ],
  "000aq31": [ 577, 280 ],

  "000as26": [ 521, 309 ],
  "000as27": [ 535, 309 ],
  "000as30": [ 572, 309 ],
  "000as32": [ 587, 309 ],
  "000au26": [ 521, 325 ],
  "000au27": [ 535, 325 ],
  "000au30": [ 572, 325 ],
  "000au32": [ 587, 325 ],
  "000av26": [ 521, 340 ],
  "000av27": [ 535, 340 ],
  "000av30": [ 572, 340 ],
  "000av32": [ 587, 340 ],
  "000ax26": [ 521, 355 ],
  "000ax27": [ 535, 355 ],
  "000ax30": [ 572, 355 ],
  "000ax32": [ 587, 355 ],
  "000ay30": [ 572, 370 ],
  "000ay32": [ 587, 370 ],
  "000ba30": [ 572, 387 ],
  "000ba32": [ 587, 387 ],

  "000bc24": [ 498, 412 ],
  "000bc25": [ 510, 412 ],
  "000bc26": [ 521, 412 ],
  "000bc27": [ 532, 412 ],
  "000bc28": [ 544, 412 ],

  "000bf24": [ 498, 433 ],
  "000bf25": [ 510, 433 ],
  "000bf26": [ 521, 433 ],
  "000bf27": [ 532, 433 ],
  "000bf28": [ 544, 433 ],

  "000bh24": [ 497, 453 ],
  "000bh25": [ 509, 453 ],
  "000bh26": [ 521, 453 ],
  "000bh27": [ 532, 453 ],
  "000bh28": [ 544, 453 ],

  "000bj24": [ 497, 472 ],
  "000bj25": [ 509, 472 ],
  "000bj26": [ 521, 472 ],
  "000bj27": [ 532, 472 ],
  "000bj28": [ 544, 472 ],

  "000bl25": [ 504, 495 ],
  "000bl26": [ 516, 495 ],
  "000bl27": [ 527, 495 ],
  "000bl28": [ 540, 495 ],

  "000bm25": [ 504, 510 ],
  "000bm26": [ 516, 510 ],
  "000bm27": [ 527, 510 ],
  "000bm28": [ 540, 510 ],


  "000br26": [ 517, 561 ],
  "000br27": [ 528, 561 ],
  "000br28": [ 539, 561 ],
  "000br29": [ 550, 561 ],
  "000br30": [ 562, 561 ],
  "000br31": [ 577, 561 ],
  "000br32": [ 588, 561 ],
  "000br33": [ 599, 561 ],
  "000br34": [ 610, 561 ],
  "000br35": [ 621, 561 ],

  "000bt26": [ 517, 578 ],
  "000bt27": [ 528, 578 ],
  "000bt28": [ 539, 578 ],
  "000bt29": [ 550, 578 ],
  "000bt30": [ 562, 578 ],
  "000bt31": [ 577, 578 ],
  "000bt32": [ 588, 578 ],
  "000bt33": [ 599, 578 ],
  "000bt34": [ 610, 578 ],
  "000bt35": [ 621, 578 ],

  "000bv28": [ 537, 603 ],
  "000bv29": [ 550, 603 ],
  "000bv30": [ 562, 603 ],
  "000bv31": [ 573, 603 ],
  "000bv32": [ 584, 603 ],
  "000bv33": [ 595, 603 ],
  "000bv34": [ 607, 603 ],

  "000bx28": [ 537, 618 ],
  "000bx29": [ 550, 618 ],
  "000bx30": [ 562, 618 ],
  "000bx31": [ 573, 618 ],
  "000bx32": [ 584, 618 ],
  "000bx33": [ 595, 618 ],
  "000bx34": [ 607, 618 ],

  "000bz28": [ 537, 643 ],
  "000bz29": [ 549, 643 ],
  "000bz30": [ 559, 643 ],
  "000bz31": [ 571, 643 ],
  "000bz32": [ 587, 643 ],
  "000bz33": [ 598, 643 ],
  "000bz34": [ 609, 643 ],

  "000cb28": [ 537, 660 ],
  "000cb29": [ 549, 660 ],
  "000cb30": [ 559, 660 ],
  "000cb31": [ 571, 660 ],
  "000cb32": [ 587, 660 ],
  "000cb33": [ 598, 660 ],
  "000cb34": [ 609, 660 ],

  "000bx19": [ 442, 620 ],
  "000bx20": [ 455, 620 ],
  "000by19": [ 442, 631 ],
  "000by20": [ 455, 631 ],
  "000bz19": [ 442, 642 ],
  "000bz20": [ 455, 642 ],
  "000ca19": [ 442, 653 ],
  "000ca20": [ 455, 653 ],

  "000bx39": [ 667, 620 ],
  "000bx41": [ 683, 620 ],
  "000by39": [ 667, 633 ],
  "000by41": [ 683, 633 ],
  "000bz39": [ 667, 644 ],
  "000bz41": [ 683, 644 ],
  "000ca39": [ 667, 656 ],
  "000ca41": [ 683, 656 ]

};

var metric = 'temp';

// attach observers for when data is added or changed
Sensors.find().observe({
  added: function(datum) {
    // console.log('sensor %s added() %o', datum._id, datum);
    // lookup location if not exist; use Session?
    if( ! datum._id in locations ) {
      // TODO location[_id] = []
    }
    data[datum._id] = datum
    redraw( metric );
  },
  changed: function(datum) {
    // console.log('sensor %s changed() %o', datum._id, datum);
    redraw( metric );
  }
});

// helper functions
Template.sensor_item.helpers({
  // return description of sensor
  description: function(id){
    return ( id in locations ) ? locations[id][2] : '-';
  }
});


// redraw everything
function redraw( metric ) {
  drawHeatMap( '.heatmap', metric );
  drawCircles( $('#contrast_circle') );
  //combineCanvas();
}

var max = 45;


// remap data into an array of 3-tuples (x,y,v)
function regenData( metric ) {
  var tuples = [];
  for (var id in locations) {
    
    if ( (id.length > 8 || isShowAllSensors) ) {
      var v = (id in data) ? parseFloat( data[id][metric] ) : Math.random() * max;
      var t = {
        x: locations[id][0],
        y: locations[id][1],
        value: v
      };
      // console.log('REGEN: id=%s, metric=%s, tuple=%o', id, metric, t);
      tuples.push(t);
    }
  }
  return tuples;
}

// draw the floorplan
function drawFloorPlan( layer, src ) {
  var plan = new Image();
  plan.src = src;
  plan.onload = function () {
    var canvas = layer;
    var ctx = canvas[0].getContext('2d');
    ctx.globalAlpha = 0.3;
    ctx.drawImage(plan, 50, 0, 1000, 1000 * plan.height / plan.width);
    ctx.globalAlpha = 1.0;
  };
};

var heatmap = undefined;

//draw the heatmap
function drawHeatMap( layer_name, metric ) {
  if( heatmap === undefined ) {
    console.log("creating heatmap...");
    heatmap = h337.create({
      container: document.querySelector(layer_name),
      gradient: {0.2: 'cyan', 0.4: 'yellow', 0.6: 'orange', 1: 'red'},
      radius: 11,
      maxOpacity: 1.0,
      minOpacity: 0.6,
      blur: 0.5
      // onExtremaChange: function(data) {
      //   updateLegend(data);
      // }
    });
  }
  var heat_data = { max: max, min: 10, data: regenData( metric ) };
  // console.log("DATA: %o", heat_data );
  heatmap.setData( heat_data );
  heatmap.repaint();
};

//draw the contrasting circles
function drawCircles( layer ){
  var canvas = layer;
  var ctx = canvas[0].getContext('2d');
  var radius = 2;
  
  for (var id in locations) {

    if(id.length > 8 || isShowAllSensors) {
      ctx.beginPath(); //open an svg path
      ctx.arc(locations[id][0], locations[id][1], radius, 0, 2 * Math.PI, false); //define arc
      ctx.closePath(); //close the path
      // TODO: colour by sensor state
      ctx.fillStyle = 'blue'; //define fill color
      ctx.fill(); //fill the path
      //console.log(ctx);
    }
  }

};


//combine canvi
/*
function combineCanvas() {
    var floor = document.getElementsByName('#floorplan');
    var thisHeat = document.getElementsByName('#heatmap');
    var circles = document.getElementsByName('#contrast_circle');
    var ctFloor = floor.getContext('2d');
    var ctHeat = thisHeat.getContext('2d');
    var ctCircles = circles.getContext('2d');
    ctCircles.drawImage(ctFloor, 0, 0);
    ctCircles.drawImage(ctHeat, 0, 0);
};*/
/*
var lastX = heatmap.width / 2, lastY = heatmap.height / 2;
var dragStart, dragged;
heatmap.addEventListener('mousedown', function (evt) {
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    lastX = evt.offsetX || (evt.pageX - heatmap.offsetLeft);
    lastY = evt.offsetY || (evt.pageY - heatmap.offsetTop);
    dragStart = ctx.transformedPoint(lastX, lastY);
    dragged = false;
}, false);
heatmap.addEventListener('mousemove', function (evt) {
    lastX = evt.offsetX || (evt.pageX - heatmap.offsetLeft);
    lastY = evt.offsetY || (evt.pageY - heatmap.offsetTop);
    dragged = true;
    if (dragStart) {
        var pt = ctx.transformedPoint(lastX, lastY);
        ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
        redraw();
    }
}, false);
heatmap.addEventListener('mouseup', function (evt) {
    dragStart = null;
    if (!dragged) zoom(evt.shiftKey ? -1 : 1);
}, false);

var scaleFactor = 1.1;
var zoom = function (clicks) {
    var pt = ctx.transformedPoint(lastX, lastY);
    ctx.translate(pt.x, pt.y);
    var factor = Math.pow(scaleFactor, clicks);
    ctx.scale(factor, factor);
    ctx.translate(-pt.x, -pt.y);
    redraw();
}

var handleScroll = function (evt) {
    var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
    if (delta) zoom(delta);
    return evt.preventDefault() && false;
};
heatmap.addEventListener('DOMMouseScroll', handleScroll, false);
heatmaps.addEventListener('mousewheel', handleScroll, false);*/
