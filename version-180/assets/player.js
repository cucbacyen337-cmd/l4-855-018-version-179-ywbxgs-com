(function () {
  window.setupMoviePlayer = function (src) {
    var video = document.querySelector("[data-player-video]");
    var cover = document.querySelector("[data-player-cover]");
    var errorBox = document.querySelector("[data-player-error]");
    var loaded = false;
    var hls = null;

    if (!video || !src) {
      return;
    }

    function showError() {
      if (errorBox) {
        errorBox.textContent = "播放暂时不可用，请稍后再试";
        errorBox.classList.add("is-visible");
      }
    }

    function loadVideo() {
      if (loaded) {
        return;
      }
      loaded = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (data && data.fatal) {
            showError();
          }
        });
      } else {
        video.src = src;
      }
      video.addEventListener("error", showError, { once: true });
    }

    function start() {
      loadVideo();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", start);
    }
    video.addEventListener("click", function () {
      if (!loaded || video.paused) {
        start();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
