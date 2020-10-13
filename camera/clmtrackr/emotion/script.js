// Adapted from https://github.com/auduno/clmtrackr/blob/dev/examples/clm_emotiondetection.html
const cameraEl = document.getElementById('camera');
const canvasEl = document.getElementById('canvas');
const resultsEl = document.getElementById('results');
const tracker = new clm.tracker();
const classifier = new emotionClassifier();
let strokeColour= 'rgb(0,0,0)';


//start camera
//test again
//liam testing 11
startCamera();

cameraEl.addEventListener('play', () => {
  // Resize everything to match to video frame size
  canvasEl.width = cameraEl.videoWidth;
  canvasEl.height = cameraEl.videoHeight;
  cameraEl.width = cameraEl.videoWidth;
  cameraEl.height = cameraEl.videoHeight;

  // Set up classifier & model
  pModel.shapeModel.nonRegularizedVectors.push(9);
  pModel.shapeModel.nonRegularizedVectors.push(11);
  classifier.init(emotionModel);

  // Set up tracker
  tracker.init(pModel);
  tracker.start(cameraEl);

  // Start monitoring frames
  window.requestAnimationFrame(renderFrame);
});

function renderFrame() {
  function draw() {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
  
      ctx.fillRect(0, 0, cameraEl.videoWidth, cameraEl.videoHeight);
      ctx.clearRect(0, 0, cameraEl.videoWidth, cameraEl.videoHeight);
      //ctx.strokeRect(0, 0, cameraEl.videoWidth, cameraEl.videoHeight);
    }
  }
  draw();
  

  var c = canvasEl.getContext('2d');
  var p = tracker.getCurrentPosition();
  if (!p) {
    window.requestAnimationFrame(renderFrame);
   
    
    return; // Tracker not tracking yet
  }

  // Optional visual feedback of tracker
  //c.drawImage(cameraEl, 0, 0);
  
  function trackerDraw() {
    
    tracker.draw(canvasEl);

  }
trackerDraw();
  var cp = tracker.getCurrentParameters();
  var er = classifier.meanPredict(cp);
  if (er) {
    updateData(er);
  }

  // Repeat!
  window.requestAnimationFrame(renderFrame);
}



function updateData(er) {

  var r = '';
  for (var i = 0; i < er.length; i++) {
    // Simplify to an integer
    er[i].value = parseInt(er[i].value * 100);

    // Construct some HTML to show results
    r += '<span class="result"><span class="label';
    if (er[i].value > 50) r += ' highlight';
    r += '">' + er[i].emotion + '</span> <span class="value">' + er[i].value + '</span></span>';
  }
  //resultsEl.innerHTML = r;
  if (er[0].value > 70){



    // document.getElementById("canvas").style.backgroundColor = "red";
    strokeColour = 'rgb(255,0,0)';
    //document.getElementById('anger').play();
    
  }
  else if (er[5].value > 70){
    // document.getElementById("canvas").style.backgroundColor = "rgb(60,200,20)";
    strokeColour = 'rgb(60,200,20)';

    //document.getElementById('yeah').play();
    }
  else {
    // document.getElementById("canvas").style.backgroundColor = "white";
    strokeColour = 'rgb(0,0,0)';


  }
  
}


// ------------------------
// Reports outcome of trying to get the camera ready
function cameraReady(err) {
  if (err) {
    console.log('Camera not ready: ' + err);
    return;
  }
}

// Tries to get the camera ready, and begins streaming video to the cameraEl element.
function startCamera() {
  const constraints = {
    audio: false,
    video: { width: 640, height: 480 }
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      cameraEl.srcObject = stream;
      cameraReady();
    })
    .catch(function (err) {
      cameraReady(err); // Report error
    });
}
