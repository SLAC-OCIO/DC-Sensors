// Device Code
#require "Si702x.class.nut:1.0.0"
#require "APDS9007.class.nut:1.0.0"
#require "LPS25H.class.nut:1.0.0"

// Establish a global variables
data <- {};
data.id <- hardware.getdeviceid();
data.mac <- imp.getmacaddress();

// built in sensors
data.ts <- 0;
data.voltage <- hardware.voltage();
data.light <- hardware.lightlevel();

// wireless data
data.bssid <- imp.getbssid();
data.rssi <- imp.rssi();

// envtail sensors
data.temp <- 0;
data.humidity <- 0;
data.pressure <- 0;
data.lux <- 0;
data.led <- 0;

// data.sensor_temp <- "Si702x";
// data.sensor_pressure <- "LPS25H";
// data.sensor_lux <- "APDS9007";

// frequency to take results
frequency <- 5;

// Instance the Si702x and save a reference in tempHumidSensor
hardware.i2c89.configure(CLOCK_SPEED_400_KHZ);
local tempHumidSensor = Si702x(hardware.i2c89);

// Instance the LPS25H and save a reference in pressureSensor
local pressureSensor = LPS25H(hardware.i2c89);
pressureSensor.enable(true);

// Instance the APDS9007 and save a reference in lightSensor
local lightOutputPin = hardware.pin5;
lightOutputPin.configure(ANALOG_IN);

local lightEnablePin = hardware.pin7;
lightEnablePin.configure(DIGITAL_OUT, 1);

local lightSensor = APDS9007(lightOutputPin, 47000, lightEnablePin);

// Configure the LED (on pin 2) as digital out with 0 start state
local led = hardware.pin2;
led.configure(DIGITAL_OUT, 0);

// This function will be called regularly to take the temperature
// send data to agent
function getReadings() {

    // loop continuously
    imp.wakeup( frequency, getReadings );

    // flash the LED (invert if necessary)
    data.led = flashLed( 0.1 );
            
    // timestamp
    data.ts = time();
    
    // Get the light level
    data.lux = lightSensor.read();
    
    // Get the pressure. This is an asynchronous call, so we need to 
    // pass a function that will be called only when the sensor 
    // has a value for us.
    pressureSensor.read(function(pressure) {
        data.pressure = pressure;
        
        // Now get the temperature and humidity. Again, this is an
        // asynchronous call: we need to a pass a function to be
        // called when the data has been returned. This time
        // the callback function also has to bundle the data
        // and send it to the agent. Then it puts the device into
        // deep sleep until it's next time for a reading.
        tempHumidSensor.read(function(reading) {
            data.temp = reading.temperature;
            data.humidity = reading.humidity;
            
            // Send the data to the agent
            agent.send("reading", data);
            
            // Put the imp to sleep for five minutes BUT
            // only do so when impOS has done all it needs to
            // do and has gone into an idle state
            // imp.onidle(function() { server.sleepfor(frequency); } );
        });
    });
}

function flashLed(duration) {
    // Turn the LED on (write a HIGH value)
    local current_state = led.read();
    local other_state = ! current_state;
    other_state = other_state.tointeger()
    setLedState(other_state);
    imp.sleep(duration);
    setLedState(current_state);
    return current_state;
}

function setLedState(state) {
    led.write(state)
}

agent.on("set.led",setLedState);

// Take a temperature reading as soon as the device starts up
// Note: when the device wakes from sleep (caused by line 86)
// it runs its device code afresh - ie. it does a warm boot
// take every two seconds
getReadings();
imp.wakeup( frequency, getReadings );
