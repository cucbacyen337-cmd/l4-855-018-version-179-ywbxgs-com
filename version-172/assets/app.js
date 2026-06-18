(function () {
    var panel = document.querySelector('[data-mobile-panel]');
    var toggle = document.querySelector('[data-menu-toggle]');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function setupHero(hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }

            timer = window.setInterval(function () {
                show(current + 1);
            }, 5600);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                restart();
            });
        }

        show(0);
        restart();
    }

    document.querySelectorAll('[data-hero]').forEach(setupHero);

    function setupFilter(input) {
        var area = document.querySelector('[data-filter-area]');
        var empty = document.querySelector('[data-empty-state]');

        if (!area) {
            return;
        }

        var cards = Array.prototype.slice.call(area.querySelectorAll('[data-keywords]'));

        input.addEventListener('input', function () {
            var query = input.value.trim().toLowerCase();
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = (card.getAttribute('data-keywords') || '').toLowerCase();
                var matched = !query || haystack.indexOf(query) !== -1;
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        });
    }

    document.querySelectorAll('[data-filter-input]').forEach(setupFilter);
})();
