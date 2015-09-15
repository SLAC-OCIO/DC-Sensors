// Agent Code


function renderBaseTop(data) {
    return "<!DOCTYPE html>"
        + "<html>"
        + "<head>"
        + "<title>" + data.id + " " + data.mac + "</title>"
        + "<meta http-equiv='refresh' content='2'>"
        + "<style>h2 { font-family:Verdana;color:#3B6BB2; } p { font-family:Verdana;padding-bottom:10px; } b { color:#3B6BB2; }</style>"
        + "</head>"
        + "<body>"
        + "<table style='width:100%;border:0px;' cellpadding='20'><tr><td align='center'>"
        + "<h2 align='center'>" + data.id + " " + data.mac + "</h2>"
        + "<h3>" + data.ts + "</h3>"
        + "<table style='width:80%;border:1px solid #3B6BB2;border-collapse:collapse;' cellpadding='20'>"
        + "<tr><td valign='top'>";
}

local baseBottom = @"</td></tr></table></td></tr></table></body></html>";

local html = null;

local lastReading = {};
lastReading.id <- null;
lastReading.mac <- null;
lastReading.ts <- null;
lastReading.pressure <- 0;
lastReading.temp <- 0;
lastReading.lux <- 0;
lastReading.humidity <- 0;

// send stuff to influx
function sendToInflux(data) {
    local string = "sensor,id=" + data.id + ",mac_address=" + data.mac + " " + "bssid=\""+data.bssid+"\"" + ",humidity=" + data.humidity + ",led=" + data.led + ",light=" + data.light + ",lux=" + data.lux +",pressure=" + data.pressure + ",rssi=" + data.rssi + ",temp=" + data.temp + ",voltage=" + data.voltage + " " + data.ts;
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
        "light": data.light,
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
    
    // Create HTML strings
    local tempString = "<p><b>Temperature</b> " + format("%.2f", reading.temp) + "&deg;C</p>";

    local humidString = "<p><b>Humidity</b> " + format("%.2f", reading.humidity) + "%</p>";

    local pressString = "<p><b>Pressure</b> " + format("%.2f", reading.pressure) + "hPa &ndash; ";
    local diff = reading.pressure - lastReading.pressure;
    if (diff > 0) {
        pressString = pressString + "rising</p>"
    } else {
        pressString = pressString + "falling</p>";
    }
    
    local luxString = "<p><b>Lux</b> " + format("%.2f", reading.lux) + "lux </p>";
    
    local otherLed = ! reading.led;
    local ledString = "<p><b>LED</b><a href='?led=" + otherLed + "'><input type='button' value='Activate'/></a></p>";
    
    
    // set html
    html = renderBaseTop(reading) + tempString + humidString + pressString + luxString + ledString + baseBottom;

    // send data for storage
    if ( reading.ts ) {
        sendToInflux( reading );
        sendToMongo( reading );
    }

    // keep history
    lastReading = reading;
}


// html request handler
function requestHandler(request, response) {
    try {
        // Check if the user sent led as a query parameter
        if ("led" in request.query) {
            // If they did, and led=1.. set our variable to 1
            if (request.query.led == "1" || request.query.led == "0") {
                // Convert the led query parameter to an integer
                local ledState = request.query.led.tointeger();

                // Send "set.led" message to device, and send ledState as the data
                device.send("set.led", ledState); 
                server.log("setting led to " + format("%i",ledState) );
            }
            // Send a response back to the browser saying everything was OK.
            response.send(200, "OK");
        
        // web page
        } else {
            if (html == null) manageReading(lastReading);
            response.send(200, html);
        }

    
    } catch (ex) {
        response.send(500, "Internal Server Error: " + ex);
    }
}   


// Register the function to handle requests from a web browser
http.onrequest(requestHandler);


// Register the function to handle data messages from the device
device.on("reading", manageReading);