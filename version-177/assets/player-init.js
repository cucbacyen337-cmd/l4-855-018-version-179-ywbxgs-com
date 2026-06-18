
(function () {
  var startPlayer = function (player) {
    var video = player.querySelector("video");
    var poster = player.querySelector(".player-poster");
    var stream = player.getAttribute("data-stream");
    var started = false;
    var hls = null;

    var play = function () {
      if (!video || !stream) {
        return;
      }

      if (!started) {
        started = true;
        video.controls = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls();
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      }

      if (poster) {
        poster.hidden = true;
      }

      var pending = video.play();
      if (pending && typeof pending.catch === "function") {
        pending.catch(function () {});
      }
    };

    if (poster) {
      poster.addEventListener("click", play);
    }

    player.addEventListener("click", function (event) {
      if (event.target === video && !started) {
        play();
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  var init = function () {
    Array.prototype.slice.call(document.querySelectorAll(".video-player")).forEach(startPlayer);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
