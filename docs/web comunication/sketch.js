// Variable to store serial connection
let port;
// Varriable to store data if it doesnt show up in one line of code
let incomingData = "";

// Variables to store joystick values
//storing x axis value
let joyX = 0;
//storing y axis value
let joyY = 0;
//storing button press value 
let button = 0;

// Variable for LED brightness
let ledBrightness = 0;

function setup() {

  // Create canvas
  createCanvas(600, 400);

  // Create serial connection
  port = createSerial();

  // Create connect button
  let connectButton = createButton("Connect to Arduino");

  // Open serial when clicked
  connectButton.mousePressed(() => port.open());
}

function draw() {

  // Clear background
  background(20);

  // CHECK FOR SERIAL DATA HERE
  if (port.available() > 0) {

  // Add incoming data to buffer
  incomingData += port.read();

  // If we received a full line
  if (incomingData.includes("\n")) {
//splitt buffer into lines whenever new line appears
    let lines = split(incomingData, "\n");

    // Take the first complete line
    let currentString = trim(lines[0]);

    // Remove processed line from buffer
    incomingData = lines.slice(1).join("\n");
//split the numerical data with commas to dirrerentiate x,y,button
    let values = split(currentString, ",");
//make sure we recive 3 values
    if (values.length == 3) {
//convert strings into numbers so it can be interperted for web use
// x value conversion
      let newX = Number(values[0]);
      // y value conversion
      let newY = Number(values[1]);
      // button conversion
      let newButton = Number(values[2]);

      // Only update if valid numbers
      if (!isNaN(newX) && !isNaN(newY)) {
        // x value numerical
        joyX = newX;
        // y value numerical
        joyY = newY;
        // button numerical value
        button = newButton;
      }
    }
  }
}

  // Map joystick values for x
  let mappedX = map(joyX, 0, 1023, 0, width);
  // Map joystick vlaue for y
  let mappedY = map(joyY, 0, 1023, 0, height);

  // Change color based on button
  if (button == 0) {
    //fills specified area with specified color
    fill(255, 0, 0);
    //or it does this
  } else {
    //fills specified area with other color
    fill(0, 255, 255);
  }

  // Draw circle
  ellipse(mappedX, mappedY, 50, 50);
}

function mousePressed() {
//only send data if port is open
  if (port && port.opened()) {
//adds led to whatever it currently is by 50
    ledBrightness += 50;
    //constrains the led brightness between 0 and 255 because thats all it can interpert 
    ledBrightness = constrain(ledBrightness, 0, 255);
//send led brightness to arduino 
    port.write(ledBrightness + "\n");
  }
}

function keyPressed() {
// if space bar is pressed and serial port is open
  if (key == " " && port && port.opened()) {
//if led is on turn or
    if (ledBrightness > 0) {
      //set brightness to 0
      ledBrightness = 0;
      //or
    } else {
      //set brightness to max
      ledBrightness = 255;
    }
//send info to aurduino 
    port.write(ledBrightness + "\n");
  }
}