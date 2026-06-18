(function () {
  var hlsLoading = false;
  var hlsCallbacks = [];

  function loadHls(callback) {
    if (window.Hls) {
      callback();
      return;
    }

    hlsCallbacks.push(callback);

    if (hlsLoading) {
      return;
    }

    hlsLoading = true;
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js';
    script.onload = function () {
      hlsLoading = false;
      var queue = hlsCallbacks.slice();
      hlsCallbacks.length = 0;
      queue.forEach(function (fn) {
        fn();
      });
    };
    script.onerror = function () {
      hlsLoading = false;
      var queue = hlsCallbacks.slice();
      hlsCallbacks.length = 0;
      queue.forEach(function (fn) {
        fn();
      });
    };
    document.head.appendChild(script);
  }

  function attachPlayer(container) {
    var video = container.querySelector('video');
    var cover = container.querySelector('.player-cover');
    var streamUrl = container.getAttribute('data-stream');
    var initialized = false;

    if (!video || !streamUrl) {
      return;
    }

    function initialize(done) {
      if (initialized) {
        done();
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        initialized = true;
        done();
        return;
      }

      loadHls(function () {
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          video._hls = hls;
          initialized = true;
          done();
          return;
        }

        video.src = streamUrl;
        initialized = true;
        done();
      });
    }

    function play() {
      initialize(function () {
        if (cover) {
          cover.classList.add('is-hidden');
        }
        video.controls = true;
        var result = video.play();
        if (result && typeof result.catch === 'function') {
          result.catch(function () {});
        }
      });
    }

    if (cover) {
      cover.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
  }

  function init() {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(attachPlayer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
