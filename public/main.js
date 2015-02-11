var renderVideo = function(context, frame, w, h) {
  context.putImageData(frame, 0, 0, 0, 0, w, h);
}

var normalizeDimensions = function(w, h, canvases) {
  canvases.forEach(function(canvas) {
    canvas.width = w;
    canvas.height = h;
  });
}

var startVideoCapture = function(video, delay) {
  var earthCanvas = document.querySelector('#earth-canvas'),
      earthContext = earthCanvas.getContext('2d'),

      spaceCanvas = document.querySelector('#space-canvas'),
      spaceContext = spaceCanvas.getContext('2d');

  var currentStream = 0;
  var scale = 1;
  var imageData = [];
  var w = 640, h = 480;
  var fps = Math.floor(1000 / 30);
  var delayInSeconds = delay / 1000;

  normalizeDimensions(w, h, [earthCanvas, spaceCanvas]);

  setInterval(function() {
    earthContext.drawImage(video, 0, 0, w, h);
    imageData.unshift(earthContext.getImageData(0, 0, w, h));

    if ((imageData.length - 1) < Math.floor(fps * delayInSeconds)) return;
    renderVideo(spaceContext, imageData[Math.floor(fps * delayInSeconds)], w, h);

    imageData = imageData.slice(0, fps * 15);

  }, Math.floor(fps));
}

document.addEventListener('DOMContentLoaded', function() {
  var delay = 2000;

  location.search.slice(1).split('&').forEach(function (param) {
    var pair = param.split('=');

    if (pair[0] != 'delay') {
      return;
    }

    delay = +pair[1];
  });

  var hide = function(e) {
    this.style.display = 'none';
  }

  var videoReceived = function(videoEl) {
    document.querySelector('.start-button').addEventListener('click', function(e) {
      goEl = document.querySelector('.go');
      goEl.addEventListener('transitionend', hide, true);
      goEl.classList.add('fade-out');
      videoEl.play();

      startVideoCapture(videoEl, delay);
    });
  }

  var video = document.querySelector('video');
  var errBack = function (error) {
    if (console) {
      console.log("Video capture error: ", error);   
    }
  };

  var videoObj = {
    video: true
  };

  if(navigator.getUserMedia) {
    navigator.getUserMedia(videoObj, function (stream) {
      video.src = stream;
      videoReceived(video);
    }, errBack);
  } else if(navigator.webkitGetUserMedia) {
    navigator.webkitGetUserMedia(videoObj, function (stream) {
      video.src = window.webkitURL.createObjectURL(stream);
      videoReceived(video);
    }, errBack);
  } else if(navigator.mozGetUserMedia) {
    navigator.mozGetUserMedia(videoObj, function (stream) {
      video.src = window.URL.createObjectURL(stream);
      videoReceived(video);
    }, errBack);
  }
});
