

function handleResponse(table) 
{
    server.log("Code: " + table.statuscode + ". Message: " + table.body)
}

function send( url, data, put ) {
    local headers = { "Content-Type": "application/json" };
    local request = null;
    if( put ) {
        request = http.put(url, headers, http.jsonencode(data) );
    } else {
        request = http.post(url, headers, http.jsonencode(data) );
    }
    return request.sendasync(handleResponse);
}



function asyncsend( url, data, put ) {
    local headers = { "Content-Type": "application/json" };
    local request = null;
    if( put ) {
        request = http.put(url, headers, http.jsonencode(data) );
    } else {
        request = http.post(url, headers, http.jsonencode(data) );
    }
    return request.sendasync(handleResponse);
}



// send stuff to influx
device.on( "influx", function(data){
    local string = [
      {
        "name" : "imp."+data.id,
        "columns" : ["temp","humidity"],
        "points" : [
            [data.temp,data.rh]
        ]
      }
    ];
    return send( "http://134.79.124.70:8086/db/imp/series?u=electric_imp&p=electric_imp", string, false );
});


// send stuff to kule
device.on( "mongohist", function(data){
    local string =  {
        "ts": time(),
        "name": "imp.yee",
        "temp": data.temp,
        "humidity": data.rh
    };
    return send( "http://134.79.124.71:8000/history", string, false );
});


// current values to kule
device.on( "mongo", function(data){
    server.log("device " + data.id );
    local string =  {
        "ts": time(),
        "temp": data.temp,
        "humidity": data.rh
    };
    
    // need an initial insert POST for the PUT to work
    // db.sensor.insert( { "_id": "00000000236668afaf952dee" } );
    
    // pad objectid for mongo
    return asyncsend( "http://134.79.124.71:3000/api/sensor/00000000"+data.id, string,  true );
    
});
