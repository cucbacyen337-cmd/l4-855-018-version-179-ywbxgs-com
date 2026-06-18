(function () {
  function startPlayer(player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    var source = player.getAttribute('data-video');

    if (!video || !source) {
      return;
    }

    if (!video.dataset.ready) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        player.hlsInstance = hls;
      } else {
        video.src = source;
      }

      video.dataset.ready = 'true';
    }

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    video.controls = true;
    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  function setupPlayer(player) {
    var overlay = player.querySelector('.player-overlay');
    var video = player.querySelector('video');

    if (overlay) {
      overlay.addEventListener('click', function () {
        startPlayer(player);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!video.dataset.ready) {
          startPlayer(player);
        }
      });
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
})();
