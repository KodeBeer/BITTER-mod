const failEffect = [{"type":"noteOn","midiNote":69,"time":0.2,"velocity":1},{"type":"noteOn","midiNote":65,"time":0.44,"velocity":1},{"type":"noteOff","midiNote":69,"time":0.4613333333333333},{"type":"noteOn","midiNote":69,"time":0.6906666666666667,"velocity":1},{"type":"noteOff","midiNote":65,"time":0.7413333333333333},{"type":"noteOff","midiNote":69,"time":0.9493333333333334},{"type":"noteOn","midiNote":65,"time":0.96,"velocity":1},{"type":"noteOff","midiNote":65,"time":1.2106666666666666},{"type":"noteOn","midiNote":67,"time":1.2213333333333334,"velocity":1},{"type":"noteOn","midiNote":62,"time":1.2293333333333334,"velocity":1},{"type":"noteOn","midiNote":56,"time":1.2293333333333334,"velocity":1},{"type":"noteOff","midiNote":67,"time":2.1413333333333333},{"type":"noteOff","midiNote":62,"time":2.1413333333333333},{"type":"noteOff","midiNote":56,"time":2.1413333333333333}]
const succEffect = [{"type":"noteOn","midiNote":71,"time":0.4079999999999999,"velocity":1},{"type":"noteOn","midiNote":72,"time":0.52,"velocity":1},{"type":"noteOff","midiNote":71,"time":0.5386666666666668},{"type":"noteOff","midiNote":72,"time":0.6400000000000001},{"type":"noteOn","midiNote":71,"time":0.658666666666667,"velocity":1},{"type":"noteOff","midiNote":71,"time":0.7893333333333334},{"type":"noteOn","midiNote":72,"time":0.7893333333333334,"velocity":1},{"type":"noteOff","midiNote":72,"time":0.8986666666666667},{"type":"noteOn","midiNote":71,"time":0.9199999999999999,"velocity":1},{"type":"noteOff","midiNote":71,"time":1.0186666666666668},{"type":"noteOn","midiNote":65,"time":1.048,"velocity":1},{"type":"noteOn","midiNote":72,"time":1.0586666666666669,"velocity":1},{"type":"noteOff","midiNote":65,"time":2.0186666666666664},{"type":"noteOff","midiNote":72,"time":2.04}]
const signEffect = [{"type":"noteOn","midiNote":64,"time":0.18133333333333335,"velocity":1},{"type":"noteOn","midiNote":71,"time":0.18933333333333333,"velocity":1},{"type":"noteOn","midiNote":67,"time":0.2,"velocity":1},{"type":"noteOff","midiNote":67,"time":0.25066666666666665},{"type":"noteOff","midiNote":64,"time":0.2693333333333333},{"type":"noteOff","midiNote":71,"time":0.28},{"type":"noteOn","midiNote":65,"time":0.44,"velocity":1},{"type":"noteOn","midiNote":60,"time":0.44,"velocity":1},{"type":"noteOff","midiNote":65,"time":0.5706666666666667},{"type":"noteOff","midiNote":60,"time":0.5893333333333334}];
const talkEffect = [{"type":"noteOn","midiNote":69,"time":0.22933333333333294,"velocity":1},{"type":"noteOff","midiNote":69,"time":0.34933333333333305},{"type":"noteOn","midiNote":71,"time":0.5493333333333332,"velocity":1},{"type":"noteOff","midiNote":71,"time":0.658666666666667},{"type":"noteOn","midiNote":71,"time":0.8799999999999999,"velocity":1},{"type":"noteOn","midiNote":64,"time":0.8986666666666663,"velocity":1},{"type":"noteOff","midiNote":71,"time":1},{"type":"noteOff","midiNote":64,"time":1.0506666666666664},{"type":"noteOn","midiNote":72,"time":1.229333333333333,"velocity":1},{"type":"noteOff","midiNote":72,"time":1.2986666666666666},{"type":"noteOn","midiNote":62,"time":1.5706666666666669,"velocity":1},{"type":"noteOn","midiNote":56,"time":1.5706666666666669,"velocity":1},{"type":"noteOn","midiNote":71,"time":1.5786666666666669,"velocity":1},{"type":"noteOff","midiNote":62,"time":2.458666666666666},{"type":"noteOff","midiNote":56,"time":2.458666666666666},{"type":"noteOff","midiNote":71,"time":2.498666666666667}]
const thinkEffect = [{"type":"noteOn","midiNote":69,"time":0.6693333333333333,"velocity":1},{"type":"noteOn","midiNote":67,"time":0.7679999999999998,"velocity":1},{"type":"noteOff","midiNote":69,"time":0.7786666666666662},{"type":"noteOn","midiNote":69,"time":0.8693333333333335,"velocity":1},{"type":"noteOff","midiNote":67,"time":0.9093333333333335},{"type":"noteOff","midiNote":69,"time":1.0293333333333337},{"type":"noteOn","midiNote":67,"time":1.1680000000000001,"velocity":1},{"type":"noteOff","midiNote":67,"time":1.7093333333333334}];
const loseEffect = [{"type":"noteOn","midiNote":71,"time":0.7919999999999998,"velocity":1},{"type":"noteOn","midiNote":67,"time":0.8319999999999999,"velocity":1},{"type":"noteOn","midiNote":64,"time":1.5599999999999996,"velocity":1},{"type":"noteOn","midiNote":72,"time":1.8906666666666663,"velocity":1},{"type":"noteOff","midiNote":71,"time":1.9013333333333335},{"type":"noteOff","midiNote":67,"time":1.912},{"type":"noteOn","midiNote":71,"time":2.461333333333333,"velocity":1},{"type":"noteOff","midiNote":72,"time":2.541333333333333},{"type":"noteOn","midiNote":67,"time":3.032,"velocity":1},{"type":"noteOff","midiNote":71,"time":3.0506666666666664},{"type":"noteOff","midiNote":64,"time":3.072},{"type":"noteOn","midiNote":62,"time":3.0906666666666665,"velocity":1},{"type":"noteOn","midiNote":50,"time":3.0906666666666665,"velocity":1},{"type":"noteOff","midiNote":50,"time":3.9013333333333327},{"type":"noteOn","midiNote":69,"time":3.920000000000001,"velocity":1},{"type":"noteOff","midiNote":67,"time":3.96},{"type":"noteOff","midiNote":62,"time":4.191999999999999},{"type":"noteOff","midiNote":69,"time":4.239999999999999},{"type":"noteOn","midiNote":67,"time":4.250666666666667,"velocity":1},{"type":"noteOn","midiNote":60,"time":4.261333333333334,"velocity":1},{"type":"noteOff","midiNote":60,"time":5.581333333333334},{"type":"noteOff","midiNote":67,"time":5.7413333333333325}]

let context;
let activeOscillators = {};
let isRecording = false;
let recordedNotes = [];
let recordStartTime;
let masterGainNode;

function getOrCreateContext() {
  if (!context) {
    context = new (window.AudioContext || window.webkitAudioContext)();
    masterGainNode = context.createGain();
    masterGainNode.connect(context.destination);
    masterGainNode.gain.setValueAtTime(0.1, context.currentTime);
  }
}

function noteOn(midiNote, time = context.currentTime, velocity = 1) {
  if (activeOscillators[midiNote]) {
    return;
  }
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const freq = Math.pow(2, (midiNote-69)/12)*440;
  oscillator.frequency.setValueAtTime(freq, time);
  oscillator.connect(gainNode);
  gainNode.connect(masterGainNode);
  oscillator.start(time);
  gainNode.gain.setTargetAtTime(velocity, time, 0.01);
  activeOscillators[midiNote] = { oscillator, gainNode };
  if (isRecording) {
    recordedNotes.push({ type: 'noteOn', midiNote, time: time - recordStartTime, velocity });
  }
}

function noteOff(midiNote, time = context.currentTime) {
  if (activeOscillators[midiNote]) {
    const { oscillator, gainNode } = activeOscillators[midiNote];
    gainNode.gain.setTargetAtTime(0, time, 0.1);
    oscillator.stop(time + 0.5); // Stop after fade out
    delete activeOscillators[midiNote];
    if (isRecording) {
      recordedNotes.push({ type: 'noteOff', midiNote, time: time - recordStartTime });
    }
  }
}

const emulatedKeys = {
  q: 60, // C4
  w: 62, // D4
  e: 64, // E4
  r: 65, // F4
  t: 67, // G4
  y: 69, // A4
  u: 71, // B4
  i: 72, // C5
};

document.addEventListener('keydown', function(e) {
  getOrCreateContext();
  if (emulatedKeys.hasOwnProperty(e.key) && isRecording) {
    noteOn(emulatedKeys[e.key]);
  } else if (e.key === 'z') {
    startRecording();
  } else if (e.key === 'x') {
    stopRecording();
  } else if (e.key === 'c') {
    playRecording(recordedNotes);
  }
});

document.addEventListener('keyup', function(e) {
  if (emulatedKeys.hasOwnProperty(e.key)) {
    noteOff(emulatedKeys[e.key]);
  }
});

function startRecording() {
  isRecording = true;
  recordedNotes = [];
  recordStartTime = context.currentTime;
  console.log("Recording started");
}

function stopRecording() {
  isRecording = false;
  console.log("Recording stopped");
  console.log(JSON.stringify(recordedNotes));
}

function playRecording(rec) {
  getOrCreateContext();
  const startTime = context.currentTime;
  rec.forEach(note => {
    if (note.type === 'noteOn') {
      noteOn(note.midiNote, startTime + note.time, note.velocity);
    } else if (note.type === 'noteOff') {
      noteOff(note.midiNote, startTime + note.time);
    }
  });
}

function loadRecording(recordingData) {
  recordedNotes = JSON.parse(recordingData);
  console.log("Recording loaded");
}