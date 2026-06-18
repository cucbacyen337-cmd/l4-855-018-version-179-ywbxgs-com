(function () {
  const data = window.MOVIE_SEARCH_DATA || [];
  const input = document.querySelector('[data-search-input]');
  const resultBox = document.querySelector('[data-search-results]');
  const params = new URLSearchParams(window.location.search);
  const current = params.get('q') || '';

  if (input) {
    input.value = current;
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function matches(item, keyword) {
    const haystack = [
      item.title,
      item.year,
      item.type,
      item.region,
      item.genre,
      item.description,
      (item.tags || []).join(' ')
    ].join(' ').toLowerCase();
    return haystack.indexOf(keyword) !== -1;
  }

  function card(item) {
    const tags = (item.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card">',
      '  <a class="poster-frame" href="' + item.path + '">',
      '    <img class="poster-img" src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      '    <span class="poster-badge">' + escapeHtml(item.type) + '</span>',
      '    <span class="poster-play">▶</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <a class="movie-title" href="' + item.path + '">' + escapeHtml(item.title) + '</a>',
      '    <p>' + escapeHtml(item.description) + '</p>',
      '    <div class="movie-tags">' + tags + '</div>',
      '    <div class="movie-meta">',
      '      <span>' + escapeHtml(item.year) + '</span>',
      '      <span>' + escapeHtml(item.region) + '</span>',
      '      <span>★ ' + escapeHtml(item.rating) + '</span>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function render(keyword) {
    if (!resultBox) {
      return;
    }

    const q = normalize(keyword);
    let items = data.slice(0, 24);

    if (q) {
      items = data.filter(function (item) {
        return matches(item, q);
      }).slice(0, 60);
    }

    if (!items.length) {
      resultBox.innerHTML = '<div class="empty-state">没有匹配结果，可以换一个关键词继续搜索。</div>';
      return;
    }

    resultBox.innerHTML = items.map(card).join('');

    resultBox.querySelectorAll('img').forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('is-missing');
      }, { once: true });
    });
  }

  const largeForm = document.querySelector('[data-search-large]');
  if (largeForm) {
    largeForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const keyword = input ? input.value.trim() : '';
      const target = keyword ? 'search.html?q=' + encodeURIComponent(keyword) : 'search.html';
      window.history.replaceState(null, '', target);
      render(keyword);
    });
  }

  render(current);
})();
