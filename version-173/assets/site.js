(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var thumbs = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-thumb]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle('is-active', thumbIndex === current);
      });
    }

    function startHero() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener('click', function () {
        showSlide(index);
        startHero();
      });
    });

    if (slides.length > 1) {
      startHero();
    }
  }

  var lists = Array.prototype.slice.call(document.querySelectorAll('[data-movie-list]'));

  if (lists.length) {
    var searchInput = document.querySelector('[data-filter-search]');
    var regionSelect = document.querySelector('[data-filter-region]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var countNode = document.querySelector('[data-filter-count]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (searchInput && initialQuery) {
      searchInput.value = initialQuery;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().replace(/\s+/g, '');
    }

    function applyFilter() {
      var query = normalize(searchInput ? searchInput.value : '');
      var region = normalize(regionSelect ? regionSelect.value : '');
      var year = normalize(yearSelect ? yearSelect.value : '');
      var visible = 0;

      lists.forEach(function (list) {
        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

        cards.forEach(function (card) {
          var text = normalize([
            card.dataset.title,
            card.dataset.tags,
            card.dataset.region,
            card.dataset.category,
            card.dataset.genre,
            card.dataset.year
          ].join(' '));
          var matchesQuery = !query || text.indexOf(query) !== -1;
          var matchesRegion = !region || normalize(card.dataset.region).indexOf(region) !== -1;
          var matchesYear = !year || normalize(card.dataset.year) === year;
          var isVisible = matchesQuery && matchesRegion && matchesYear;

          card.classList.toggle('is-filtered-out', !isVisible);

          if (isVisible) {
            visible += 1;
          }
        });
      });

      if (countNode) {
        countNode.textContent = '显示 ' + visible + ' 部';
      }
    }

    [searchInput, regionSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }
})();
