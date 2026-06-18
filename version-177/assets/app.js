
(function () {
  var ready = function (callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }

    document.addEventListener("DOMContentLoaded", callback);
  };

  var normalize = function (value) {
    return String(value || "").trim().toLowerCase();
  };

  ready(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dots button"));
      var current = 0;
      var setSlide = function (index) {
        current = index;
        slides.forEach(function (slide, idx) {
          slide.classList.toggle("is-active", idx === index);
        });
        dots.forEach(function (dot, idx) {
          dot.classList.toggle("is-active", idx === index);
        });
      };

      dots.forEach(function (dot, idx) {
        dot.addEventListener("click", function () {
          setSlide(idx);
        });
      });

      if (slides.length > 1) {
        window.setInterval(function () {
          setSlide((current + 1) % slides.length);
        }, 5200);
      }
    }

    var localFilter = document.querySelector("[data-filter-input]");

    if (localFilter) {
      var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search]"));
      var empty = document.querySelector("[data-empty-state]");
      var applyFilter = function () {
        var keyword = normalize(localFilter.value);
        var shown = 0;
        cards.forEach(function (card) {
          var matched = normalize(card.getAttribute("data-search")).indexOf(keyword) !== -1;
          card.classList.toggle("hidden-card", !matched);
          if (matched) {
            shown += 1;
          }
        });
        if (empty) {
          empty.hidden = shown !== 0;
        }
      };

      localFilter.addEventListener("input", applyFilter);
      applyFilter();
    }

    var searchResults = document.querySelector("[data-search-results]");

    if (searchResults && window.MOVIE_SEARCH_DATA) {
      var params = new URLSearchParams(window.location.search);
      var query = normalize(params.get("q"));
      var searchInput = document.querySelector("[data-search-page-input]");

      if (searchInput && query) {
        searchInput.value = params.get("q");
      }

      var renderResults = function (keyword) {
        var results = window.MOVIE_SEARCH_DATA.filter(function (movie) {
          return normalize(movie.title + " " + movie.region + " " + movie.genre + " " + movie.tags).indexOf(keyword) !== -1;
        }).slice(0, 120);

        if (!keyword) {
          results = window.MOVIE_SEARCH_DATA.slice(0, 48);
        }

        if (!results.length) {
          searchResults.innerHTML = '<div class="empty-state">没有找到匹配影片</div>';
          return;
        }

        searchResults.innerHTML = results.map(function (movie) {
          return [
            '<article class="movie-card">',
            '  <a class="poster-link" href="' + movie.href + '">',
            '    <img src="' + movie.cover + '" alt="' + movie.title.replace(/"/g, "&quot;") + '" loading="lazy">',
            '    <span class="poster-shade"></span>',
            '    <span class="play-circle">▶</span>',
            '  </a>',
            '  <div class="card-body">',
            '    <div class="card-meta"><span>' + movie.region + '</span><span>' + movie.year + '</span><span>' + movie.score + '</span></div>',
            '    <h3><a href="' + movie.href + '">' + movie.title + '</a></h3>',
            '    <p>' + movie.oneLine + '</p>',
            '    <div class="tag-row"><span>' + movie.category + '</span><span>' + movie.genre + '</span></div>',
            '  </div>',
            '</article>'
          ].join('');
        }).join('');
      };

      renderResults(query);

      if (searchInput) {
        searchInput.addEventListener("input", function () {
          renderResults(normalize(searchInput.value));
        });
      }
    }
  });
})();
