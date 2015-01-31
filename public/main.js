var renderVideo = function(context, frame, w, h) {
  context.putImageData(frame, 0, 0, 0, 0, w, h);
}

var normalizeDimensions = function(w, h, canvases) {
  canvases.forEach(function(canvas) {
    canvas.width = w;
    canvas.height = h;
  });
}

var startVideoCapture = function(video) {
  var earthCanvas = document.querySelector('#earth-canvas'),
      earthContext = earthCanvas.getContext('2d'),

      moonCanvas = document.querySelector('#moon-canvas'),
      moonContext = moonCanvas.getContext('2d'),

      neoOneCanvas = document.querySelector('#neo-one-canvas'),
      neoOneContext = neoOneCanvas.getContext('2d'),

      neoTwoCanvas = document.querySelector('#neo-two-canvas'),
      neoTwoContext = neoTwoCanvas.getContext('2d');

  var currentStream = 0;

  var scale = 1;
  var imageData = [];
  var w = 640, h = 480;
  var fps = Math.floor(1000 / 30);

  normalizeDimensions(w, h, [earthCanvas, moonCanvas, neoOneCanvas, neoTwoCanvas]);

  setInterval(function() {
    earthContext.drawImage(video, 0, 0, w, h);
    imageData.unshift(earthContext.getImageData(0, 0, w, h));

    if ((imageData.length - 1) < fps * 2) return;
    renderVideo(moonContext, imageData[(fps * 2)], w, h);

    imageData = imageData.slice(0, fps * 15);

  }, Math.floor(fps));
}

var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || false;

window.onload = function() {
  var hide = function(e) {
    this.style.display = 'none';
  }

  var videoReceived = function(videoEl) {
    document.querySelector('.start-button').addEventListener('click', function(e) {
      goEl = document.querySelector('.go');
      goEl.addEventListener('transitionend', hide, true);
      goEl.classList.add('fade-out');
      videoEl.play();

      startVideoCapture(videoEl);
    });
  }

  var video = document.querySelector('video'),
      errBack = function(error) {
        if (console) {
          console.log("Video capture error: ", error.code);   
        }
      };
  var videoObj = {video: true};
  if(navigator.getUserMedia) {
    navigator.getUserMedia(videoObj, function(stream) {
      video.src = stream;
      videoReceived(video);
    }, errBack);
  } else if(navigator.webkitGetUserMedia) {
    navigator.webkitGetUserMedia(videoObj, function(stream) {
      video.src = window.webkitURL.createObjectURL(stream);
      videoReceived(video);
    }, errBack);
  }
  else if(navigator.mozGetUserMedia) {
    navigator.mozGetUserMedia(videoObj, function(stream) {
      video.src = window.URL.createObjectURL(stream);
      videoReceived(video);
    }, errBack);
  }
}
