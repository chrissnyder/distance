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
  var w, h;

  var fps = Math.floor(1000 / 30);

  w = video.videoWidth * scale;
  h = video.videoHeight * scale;

  normalizeDimensions(w, h, [earthCanvas, moonCanvas, neoOneCanvas, neoTwoCanvas]);

  setInterval(function() {
    earthContext.drawImage(video, 0, 0, w, h);
    imageData.unshift(earthContext.getImageData(0, 0, w, h));

    if (currentStream == 0) {
      if ((imageData.length - 1) < fps * 2) return;
      renderVideo(moonContext, imageData[(fps * 2)], w, h);  
    } else if (currentStream == 1) {
      if ((imageData.length - 1) < fps * 5) return;
      renderVideo(neoOneCanvas, imageData[(fps * 5)], w, h);
    } else if (currentStream == 2) {
      if ((imageData.length - 1) < fps * 10) return;
      renderVideo(neoTwoCanvas, imageData[(fps * 10)], w, h);
    }

    imageData = imageData.slice(0, fps * 15);

  }, Math.floor(fps));
}

var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || false;

window.addEventListener('DOMContentLoaded', function() {
  var videoReceived = function(videoEl) {
    document.querySelector('.start-button').addEventListener('click', function(e) {
      $('.go').fadeOut();
      videoEl.play();

      startVideoCapture(videoEl);
    });
  }

  var video = document.querySelector('video'),
      errBack = function(error) {
        console.log("Video capture error: ", error.code); 
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
});