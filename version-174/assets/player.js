export function setupVideo(videoUrl) {
  var video = document.querySelector("[data-video]");
  var frame = document.querySelector("[data-player-frame]");
  var panel = document.querySelector("[data-play-panel]");
  var button = document.querySelector("[data-play-button]");
  var started = false;
  var hls = null;

  if (!video || !videoUrl) {
    return;
  }

  function bindVideo() {
    if (started) {
      return;
    }

    started = true;

    if (video.canPlayType("application/vnd.apple.mpegurl") || video.canPlayType("application/x-mpegURL")) {
      video.src = videoUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
    } else {
      video.src = videoUrl;
    }
  }

  function start() {
    bindVideo();

    if (frame) {
      frame.classList.add("is-playing");
    }

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  if (panel) {
    panel.addEventListener("click", start);
  }

  if (button) {
    button.addEventListener("click", start);
  }

  video.addEventListener("click", function () {
    if (!started || video.paused) {
      start();
    }
  });

  window.addEventListener("pagehide", function () {
    if (hls && typeof hls.destroy === "function") {
      hls.destroy();
    }
  });
}
