// adapted from https://editor.p5js.org/jen_GSA/sketches/ge9BLvxh7

let handpose;
let video;
let hands = [];
let myOutput;

function preload() {
  // Load the handpose model.
  handpose = ml5.handpose();
}

function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  // start detecting hands from the webcam video
  handpose.detectStart(video, gotHands);
  // MIDI
  WebMidi.enable()
    .then(onEnabled)
    .catch(function (err) {
      alert(err);
    });
}

function onEnabled() {
  console.log('WebMIDI Enabled');

  WebMidi.inputs.forEach(function (input) {
    console.log('Input: ', input.manufacturer, input.name);
  });
  WebMidi.outputs.forEach(function (output) {
    console.log('Output: ', output.manufacturer, output.name);
  });

  myOutput = WebMidi.outputs[0];
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // Draw all the tracked hand points
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);

      if (j == 4) {
        sendMidiControlChange(1, (keypoint.x / width) * 127);
      }
    }
  }
}

// Callback function for when handpose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}

function sendMidiControlChange(ccNumber, ccValue) {
  if (myOutput) {
    myOutput.sendControlChange(ccNumber, ccValue); // Send CC number with value
    console.log(ccNumber, ccValue);
  }
}
