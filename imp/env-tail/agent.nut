// Agent Code
#require "Rocky.class.nut:1.0.0"

app <- Rocky();


local html = @"
<!DOCTYPE html>
<html>
  <head>
    <title>imp</title>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <style>
      h2 { font-family:Verdana;color:#3B6BB2; } 
      h3 { font-family:Verdana; } 
      p { font-family:Verdana;padding-bottom:10px; } 
      b { color:#3B6BB2; }
    </style>
    <script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'></script>
    <script>
        function ledToggle(){
            var state = $('span#led').text();
            var to_state = state == 0 ? 1 : 0;
            console.log('state %s -> %s', state, to_state );
            $.ajax({
                url: $(location).attr('pathname') + '/state',
                type: 'PUT',
                dataType: 'json',
                data: JSON.stringify({ 'led': to_state }),
                success: function(resp){
                    console.log('OK');
                },
                error: function(resp){
                    console.log('ERROR: %o',resp);
                }
                
            })
        }
        function update(){
            $.ajax({
                url: $(location).attr('pathname') + '/state',
                type: 'GET',
                success: function(resp){
                    // console.log('%o',resp);
                    var ts = new Date(0);
                    ts.setUTCSeconds(resp['ts']);
                    $('span#timestamp').text( ts );
                    $.each( resp, function(k,v){
                        $('span#'+k).text(v);    
                    });
                },
                error: function(resp){
                    console.log('ERROR: %o',resp);
                }
            });
        }
        $(document).ready( function(){
            update();
            setInterval( update, 2000 );
        });
    </script>
  </head>
  <body>
    <table style='width:100%;border:0px;' cellpadding='20'>
      <tr>
        <td align='center'>
          <h2 align='center'>id: <span id='id'></span> mac: <span id='mac'></span></span></h2>
          <h3><span id='timestamp'></span></h3>
          <table style='width:85%;border:1px solid #3B6BB2;border-collapse:collapse;' cellpadding='20'>
            <tr>
              <td valign='top'>
              <p><b>Temperature</b> <span id='temp'></span>&deg;C</p>
              <p><b>Humidity</b> <span id='humidity'></span>%</p>
              <p><b>Pressure</b> <span id='pressure'></span>hPa</p>
              <p><b>Lux</b> <span id='lux'></span>lux </p>
              <p><b>Wifi</b> <span id='bssid'></span> <span id='rssi'></span>dBm</p>
              <p><b>Voltage</b> <span id='voltage'></span> </p>
              <p><b>LED</b> <span id='led'></span> <button type='button' onclick='ledToggle()'>Toggle</button></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>";


local lastReading = {};
lastReading.id <- null;
lastReading.mac <- null;
lastReading.ts <- null;
// lastReading.light <- null;
lastReading.voltage <- null;
lastReading.bssid <- null;
lastReading.rssi <- null;
lastReading.led <- null;
lastReading.pressure <- null;
lastReading.temp <- null;
lastReading.lux <- null;
lastReading.humidity <- null;

// send stuff to influx
function sendToInflux(data) {
    local string = "sensor,id=" + data.id + ",mac_address=" + data.mac + " " + "bssid=\""+data.bssid+"\"" + ",humidity=" + data.humidity + ",led=" + data.led + ",lux=" + data.lux +",pressure=" + data.pressure + ",rssi=" + data.rssi + ",temp=" + data.temp + ",voltage=" + data.voltage + " " + data.ts;
    server.log( " influx: " + string );
    local request = http.post( "http://134.79.129.223:8086/write?db=dc&precision=s", {}, string );
    return request.sendasync( function(result){
        if( result.statuscode == 204 ) {
            // a-ok 
        } else {
            server.log("  influd'd: " + result.statuscode + ", message: " + result.body)
        }
    });
};

// send stuff to mongo
function sendToMongo(data) {
    // server.log("device " + data.id );
    local id = "00000000"+data.id;
    local d = {
        "ts": data.ts,
        "voltage": data.voltage,
        "led": data.led,
        // "light": data.light,
        "bssid": data.bssid,
        "rssi": data.rssi,
        "temp": data.temp,
        "humidity": data.humidity,
        "lux": data.lux,
        "pressure": data.pressure
    };
    
    // need an initial insert POST for the PUT to work
    // db.sensor.insert( { "_id": "00000000236668afaf952dee" } );
    
    // pad objectid for mongo
    local uri = "http://134.79.129.223:3000/api/sensors/";
    local request = http.put( uri + id, { "Content-Type": "application/json" }, http.jsonencode(d) );
    server.log( "  mongo: " + d );
    return request.sendasync( function(result){
        if ( result.statuscode == 404 ) {
            d._id <- id;
            request = http.post( uri, { "Content-Type": "application/json" }, http.jsonencode(d) );
            request.sendasync( function(result){
               if ( result.statuscode != 200 ) {
                   server.log("    mongo'd (in): " + result.statuscode + ", message: " + result.body);
               } 
            });
        } else if ( result.statuscode != 200 ) {
            server.log("    mongo'd (out): " + result.statuscode + ", message: " + result.body);
        }
    });
};


function manageReading(reading) {
    // Note: reading is the data passed from the device, ie.
    // a Squirrel table with the key 'temp'
    server.log("manageReading() called");
    
    // send data for storage
    if ( reading.ts ) {
        sendToInflux( reading );
        sendToMongo( reading );
    }

    // keep history
    lastReading = reading;
}


// display html page
app.get("/", function(context){
    context.send( 200, html );    
})

// all sensor data
app.get("/state", function(context){
    context.send( lastReading );
})

app.put("/state", function(context){
    server.log(context.req.body);
    try {
        local d = http.jsondecode(context.req.body);
        if ( "led" in d ) {
            local ledState = d.led.tointeger();
            local resp = {};
            device.send("set.led", ledState); 
            resp.led <- ledState;
            context.send( 200, resp );
        } else {
            throw "unknown params"
        }
    } catch(ex) {
        context.send(400, ex);
    }
})


// Register the function to handle data messages from the device
device.on("reading", manageReading);