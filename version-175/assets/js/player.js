(function () {
  function canUseNativeHls(video) {
    return video.canPlayType('application/vnd.apple.mpegurl') || video.canPlayType('application/x-mpegURL');
  }

  function attachSource(video, source, message) {
    if (!source) {
      if (message) {
        message.textContent = '播放源暂不可用';
      }
      return Promise.resolve(false);
    }

    if (video.dataset.ready === 'true') {
      return Promise.resolve(true);
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      video.dataset.ready = 'true';
      video._hlsInstance = hls;

      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }

        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          if (message) {
            message.textContent = '网络波动，正在重新加载';
          }
          return;
        }

        if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          if (message) {
            message.textContent = '媒体加载恢复中';
          }
          return;
        }

        if (message) {
          message.textContent = '视频加载失败';
        }
      });

      return Promise.resolve(true);
    }

    if (canUseNativeHls(video)) {
      video.src = source;
      video.dataset.ready = 'true';
      return Promise.resolve(true);
    }

    if (message) {
      message.textContent = '当前浏览器不支持 HLS 播放';
    }
    return Promise.resolve(false);
  }

  document.querySelectorAll('[data-hls-player]').forEach(function (box) {
    const video = box.querySelector('video');
    const button = box.querySelector('[data-player-button]');
    const cover = box.querySelector('[data-player-cover]');
    const message = box.querySelector('[data-player-message]');

    if (!video) {
      return;
    }

    const source = video.dataset.src || '';

    function play() {
      attachSource(video, source, message).then(function (ready) {
        if (!ready) {
          return;
        }

        if (cover) {
          cover.classList.add('is-hidden');
        }

        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            if (message) {
              message.textContent = '点击视频控件即可继续播放';
            }
          });
        }
      });
    }

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    });
  });
})();
