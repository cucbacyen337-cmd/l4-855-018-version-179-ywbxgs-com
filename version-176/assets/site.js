(function () {
  var header = document.querySelector('[data-header]');
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  function onScroll() {
    if (!header) {
      return;
    }
    if (window.scrollY > 24) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  if (toggle && mobileNav && header) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
      header.classList.toggle('menu-open');
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  var grid = document.querySelector('[data-card-grid]');
  var search = document.querySelector('[data-filter-search]');
  var typeFilter = document.querySelector('[data-type-filter]');
  var sortFilter = document.querySelector('[data-sort-filter]');
  var empty = document.querySelector('[data-empty-state]');

  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]'));
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');

    if (q && search) {
      search.value = q;
    }

    function applyFilters() {
      var term = search ? search.value.trim().toLowerCase() : '';
      var typeValue = typeFilter ? typeFilter.value : '';
      var visibleCount = 0;

      cards.forEach(function (card) {
        var text = card.getAttribute('data-card-text') || '';
        var type = card.getAttribute('data-type') || '';
        var matchTerm = !term || text.indexOf(term) !== -1;
        var matchType = !typeValue || type.indexOf(typeValue) !== -1;
        var visible = matchTerm && matchType;
        card.classList.toggle('is-hidden', !visible);
        if (visible) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visibleCount === 0);
      }
    }

    function applySort() {
      var value = sortFilter ? sortFilter.value : 'default';
      var sorted = cards.slice();

      if (value === 'year-desc') {
        sorted.sort(function (a, b) {
          return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
        });
      }

      if (value === 'year-asc') {
        sorted.sort(function (a, b) {
          return Number(a.getAttribute('data-year')) - Number(b.getAttribute('data-year'));
        });
      }

      if (value === 'title-asc') {
        sorted.sort(function (a, b) {
          return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-CN');
        });
      }

      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    if (search) {
      search.addEventListener('input', applyFilters);
    }

    if (typeFilter) {
      typeFilter.addEventListener('change', applyFilters);
    }

    if (sortFilter) {
      sortFilter.addEventListener('change', function () {
        applySort();
        applyFilters();
      });
    }

    applySort();
    applyFilters();
  }
})();
