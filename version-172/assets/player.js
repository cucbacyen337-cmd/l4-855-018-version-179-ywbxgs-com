(function () {
    function initPlayer(videoId, buttonId, streamUrl, title) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var prepared = false;
        var hls = null;

        if (!video || !streamUrl) {
            return;
        }

        function prepare() {
            if (prepared) {
                return;
            }

            prepared = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }

        function hideButton() {
            if (button) {
                button.classList.add('is-hidden');
            }
        }

        function start() {
            prepare();
            hideButton();
            var playback = video.play();

            if (playback && typeof playback.catch === 'function') {
                playback.catch(function () {
                    if (button) {
                        button.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (title) {
            video.setAttribute('aria-label', title);
        }

        if (button) {
            button.addEventListener('click', start);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });

        video.addEventListener('play', hideButton);

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    window.initPlayer = initPlayer;
})();
