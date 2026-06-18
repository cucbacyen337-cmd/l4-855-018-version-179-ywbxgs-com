(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        var isOpen = mobileNav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    var hero = document.querySelector('[data-hero-slider]');

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var current = 0;
      var timer = null;

      function showSlide(index) {
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

      function start() {
        timer = window.setInterval(function () {
          showSlide(current + 1);
        }, 4800);
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
          window.clearInterval(timer);
          showSlide(index);
          start();
        });
      });

      showSlide(0);
      start();
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-search-panel]'));

    panels.forEach(function (panel) {
      var input = panel.querySelector('[data-search-input]');
      var select = panel.querySelector('[data-filter-select]');
      var scopeSelector = panel.getAttribute('data-search-panel');
      var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
      var empty = document.querySelector(panel.getAttribute('data-empty-target') || '');

      if (!scope || (!input && !select)) {
        return;
      }

      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

      function applyFilter() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var typeValue = select ? select.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute('data-title'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-tags'),
            card.getAttribute('data-year'),
            card.getAttribute('data-region')
          ].join(' ').toLowerCase();

          var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchedType = !typeValue || haystack.indexOf(typeValue.toLowerCase()) !== -1;
          var matched = matchedKeyword && matchedType;

          card.style.display = matched ? '' : 'none';

          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      if (input) {
        input.addEventListener('input', applyFilter);
      }

      if (select) {
        select.addEventListener('change', applyFilter);
      }
    });
  });
})();
