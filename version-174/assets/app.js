(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var menu = document.querySelector("[data-menu]");

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(target) {
      if (!slides.length) {
        return;
      }

      index = (target + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
        slide.setAttribute("aria-hidden", i === index ? "false" : "true");
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]")).forEach(function (form) {
    var target = document.querySelector(form.getAttribute("data-target"));

    if (!target) {
      return;
    }

    var cards = Array.prototype.slice.call(target.querySelectorAll("[data-card]"));
    var empty = target.querySelector("[data-empty]");
    var searchInput = form.querySelector("[data-search-input]");
    var regionFilter = form.querySelector("[data-region-filter]");
    var yearFilter = form.querySelector("[data-year-filter]");
    var typeFilter = form.querySelector("[data-type-filter]");
    var categoryFilter = form.querySelector("[data-category-filter]");

    function valueOf(element) {
      return element ? element.value.trim().toLowerCase() : "";
    }

    function apply() {
      var keyword = valueOf(searchInput);
      var region = valueOf(regionFilter);
      var year = valueOf(yearFilter);
      var type = valueOf(typeFilter);
      var category = valueOf(categoryFilter);
      var visible = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
        var cardRegion = (card.getAttribute("data-region") || "").toLowerCase();
        var cardYear = (card.getAttribute("data-year") || "").toLowerCase();
        var cardType = (card.getAttribute("data-type") || "").toLowerCase();
        var cardGenre = (card.getAttribute("data-genre") || "").toLowerCase();
        var cardCategory = (card.querySelector(".category-badge") ? card.querySelector(".category-badge").textContent : "").toLowerCase();
        var matched = true;

        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }

        if (region && cardRegion !== region) {
          matched = false;
        }

        if (year && cardYear !== year) {
          matched = false;
        }

        if (type && cardType !== type) {
          matched = false;
        }

        if (category && cardCategory !== category && cardGenre.indexOf(category) === -1) {
          matched = false;
        }

        card.style.display = matched ? "" : "none";

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? "none" : "block";
      }
    }

    form.addEventListener("input", apply);
    form.addEventListener("change", apply);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      apply();
    });
  });
})();
