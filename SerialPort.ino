String inputString = "";         // a String to hold incoming data
boolean stringComplete = false;  // whether the string is complete
int room[2] = {12, 13};
void setup() {
  // initialize serial:
  Serial.begin(9600);
  // reserve 200 bytes for the inputString:
  inputString.reserve(200);
  pinMode(room[0], OUTPUT);
  pinMode(room[1], OUTPUT);
}

void loop() {
  // print the string when a newline arrives:
  if (stringComplete) {
    if(inputString.startsWith("room")) {
      int target = inputString.substring(4, inputString.indexOf(" ")).toInt() - 1;
      String state = inputString.substring(inputString.indexOf(" ") + 1);
      digitalWrite(room[target], (state.indexOf("on") > -1)? HIGH : LOW);
    }
    inputString = "";
    stringComplete = false;
  }
}

/*
  SerialEvent occurs whenever a new data comes in the hardware serial RX. This
  routine is run between each time loop() runs, so using delay inside loop can
  delay response. Multiple bytes of data may be available.
*/
void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag so the main loop can
    // do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}