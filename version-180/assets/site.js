(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function pagePrefix() {
    var path = window.location.pathname;
    if (path.indexOf("/movies/") !== -1 || path.indexOf("/categories/") !== -1) {
      return "../";
    }
    return "./";
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var active = 0;
    var timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        start();
      });
    });

    show(0);
    start();
  }

  function initSearchPage() {
    var form = document.querySelector("[data-search-form]");
    var results = document.querySelector("[data-search-results]");
    var note = document.querySelector("[data-search-note]");
    if (!form || !results || !window.SITE_MOVIES) {
      return;
    }

    var keywordInput = form.querySelector("[name='q']");
    var typeSelect = form.querySelector("[name='type']");
    var yearSelect = form.querySelector("[name='year']");
    var params = new URLSearchParams(window.location.search);
    var initialKeyword = params.get("q") || "";
    if (keywordInput) {
      keywordInput.value = initialKeyword;
    }

    function card(movie) {
      var base = pagePrefix();
      var item = document.createElement("a");
      item.className = "movie-card";
      item.href = base + "movies/" + movie.file;
      item.innerHTML = [
        "<div class=\"poster\">",
        "<span class=\"card-badge\">" + movie.year + "</span>",
        "<img src=\"" + base + movie.cover + ".jpg\" alt=\"" + movie.title.replace(/\"/g, "&quot;") + "\" loading=\"lazy\">",
        "</div>",
        "<div class=\"card-body\">",
        "<h3 class=\"card-title\">" + movie.title + "</h3>",
        "<p class=\"card-desc\">" + movie.one_line + "</p>",
        "<div class=\"card-meta\"><span>" + movie.region + "</span><span>" + movie.type + "</span></div>",
        "</div>"
      ].join("");
      return item;
    }

    function applySearch() {
      var keyword = (keywordInput && keywordInput.value ? keywordInput.value : "").trim().toLowerCase();
      var type = typeSelect && typeSelect.value ? typeSelect.value : "";
      var year = yearSelect && yearSelect.value ? yearSelect.value : "";
      var matched = window.SITE_MOVIES.filter(function (movie) {
        var text = [movie.title, movie.region, movie.type, movie.genre, movie.tags, movie.one_line].join(" ").toLowerCase();
        return (!keyword || text.indexOf(keyword) !== -1) && (!type || movie.type === type) && (!year || movie.year === year);
      }).slice(0, 180);

      results.innerHTML = "";
      matched.forEach(function (movie) {
        results.appendChild(card(movie));
      });
      if (note) {
        note.textContent = matched.length ? "已为你筛选出相关片单" : "没有找到匹配内容，可更换关键词再试";
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      applySearch();
    });
    [keywordInput, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applySearch);
        control.addEventListener("change", applySearch);
      }
    });
    applySearch();
  }

  ready(function () {
    initMenu();
    initHero();
    initSearchPage();
  });
})();
