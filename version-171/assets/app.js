(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function bindMobileNav() {
        var toggle = document.querySelector(".menu-toggle");
        var panel = document.getElementById("mobileNav");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            var isOpen = panel.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    function bindHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle("is-active", itemIndex === index);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle("is-active", itemIndex === index);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }
        dots.forEach(function (dot, itemIndex) {
            dot.addEventListener("click", function () {
                show(itemIndex);
                start();
            });
        });
        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                stop();
            } else {
                start();
            }
        });
        start();
    }

    function readQuery() {
        var params = new URLSearchParams(window.location.search);
        return params.get("q") || "";
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function bindFilters() {
        var container = document.querySelector("[data-filterable]");
        var search = document.querySelector("[data-filter-search]");
        var region = document.querySelector("[data-filter-region]");
        var year = document.querySelector("[data-filter-year]");
        var count = document.querySelector("[data-filter-count]");
        if (!container) {
            return;
        }
        var cards = Array.prototype.slice.call(container.querySelectorAll("[data-card]"));
        if (search && !search.value) {
            search.value = readQuery();
        }
        function apply() {
            var queryValue = normalize(search ? search.value : "");
            var regionValue = normalize(region ? region.value : "");
            var yearValue = normalize(year ? year.value : "");
            var visible = 0;
            cards.forEach(function (card) {
                var fields = normalize(card.getAttribute("data-fields"));
                var cardRegion = normalize(card.getAttribute("data-region"));
                var cardYear = normalize(card.getAttribute("data-year"));
                var matched = true;
                if (queryValue && fields.indexOf(queryValue) === -1) {
                    matched = false;
                }
                if (regionValue && cardRegion !== regionValue) {
                    matched = false;
                }
                if (yearValue && cardYear !== yearValue) {
                    matched = false;
                }
                card.classList.toggle("is-hidden", !matched);
                if (matched) {
                    visible += 1;
                }
            });
            if (count) {
                count.textContent = visible ? "已筛出 " + visible + " 部" : "暂无匹配";
            }
        }
        [search, region, year].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });
        apply();
    }

    window.setupMoviePlayer = function (video, control, source) {
        if (!video || !source) {
            return;
        }
        var hls = null;
        function attach() {
            if (video.dataset.ready === "1") {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
            video.dataset.ready = "1";
        }
        function play() {
            attach();
            if (control) {
                control.classList.add("is-hidden");
            }
            var action = video.play();
            if (action && typeof action.catch === "function") {
                action.catch(function () {});
            }
        }
        if (control) {
            control.addEventListener("click", play);
        }
        video.addEventListener("click", function () {
            if (video.dataset.ready !== "1") {
                play();
            }
        });
        video.addEventListener("play", function () {
            if (control) {
                control.classList.add("is-hidden");
            }
        });
        window.addEventListener("pagehide", function () {
            if (hls && typeof hls.destroy === "function") {
                hls.destroy();
            }
        });
    };

    ready(function () {
        bindMobileNav();
        bindHero();
        bindFilters();
    });
})();
