// v2
(function () {
  // Theme toggle — persisted across pages via a `?theme=` URL parameter rather than
  // browser storage APIs (unavailable in sandboxed preview iframes).
  // The blocking inline script in <head> already reads that parameter (falling back
  // to system preference) and sets data-theme before first paint, avoiding a flash.
  // Here we keep every same-site link on the page carrying the current theme forward,
  // so the choice sticks as the visitor clicks from page to page.
  var toggle = document.querySelector('[data-theme-toggle]');
  var root = document.documentElement;
  var theme = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function withTheme(href, value) {
    var hash = '';
    var base = href;
    var hashIdx = href.indexOf('#');
    if (hashIdx !== -1) {
      hash = href.slice(hashIdx);
      base = href.slice(0, hashIdx);
    }
    var path = base.split('?')[0];
    return path + '?theme=' + value + hash;
  }

  function propagateTheme(value) {
    var links = document.querySelectorAll('a[href]');
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.indexOf('.html') === -1) return; // only internal site pages
      a.setAttribute('href', withTheme(href, value));
    });
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('theme', value);
      history.replaceState(null, '', url.toString());
    } catch (e) {
      /* history API unavailable — theme still applies for this page */
    }
  }

  propagateTheme(theme);

  function renderIcon() {
    if (!toggle) return;
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    toggle.innerHTML =
      theme === 'dark'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2 12h2.4M19.6 12H22M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 13.2A9 9 0 1 1 10.8 3a7.2 7.2 0 0 0 10.2 10.2z"/></svg>';
  }
  renderIcon();

  if (toggle) {
    toggle.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      propagateTheme(theme);
      renderIcon();
    });
  }

  // Mobile nav toggle
  var navToggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-main-nav]');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      navToggle.setAttribute('aria-expanded', String(!open));
    });
  }

  // Scroll-triggered fade-in reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Category filter tabs — multi-select (writing index)
  // activeFilters is a Set of category strings; empty Set = show all (ALL mode).
  // Scales automatically as new categories are added — no JS changes required.
  var filterBtns = document.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('[data-category]');
  if (filterBtns.length && cards.length) {
    var activeFilters = new Set();

    function applyFilters() {
      var allBtn = document.querySelector('[data-filter="all"]');
      var isAll = activeFilters.size === 0;
      if (allBtn) allBtn.classList.toggle('is-active', isAll);
      cards.forEach(function (card) {
        var cats = card.getAttribute('data-category') || '';
        var show = isAll || Array.from(activeFilters).some(function (f) {
          return cats.indexOf(f) !== -1;
        });
        card.style.display = show ? '' : 'none';
        if (show) card.classList.add('is-visible');
      });
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-filter');
        var allBtn = document.querySelector('[data-filter="all"]');
        if (val === 'all') {
          activeFilters.clear();
          filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        } else {
          if (activeFilters.has(val)) {
            activeFilters.delete(val);
            btn.classList.remove('is-active');
          } else {
            activeFilters.add(val);
            btn.classList.add('is-active');
          }
          if (allBtn) allBtn.classList.remove('is-active');
          if (activeFilters.size === 0 && allBtn) allBtn.classList.add('is-active');
        }
        applyFilters();
      });
    });
  }

  // Wrap article-body tables in overflow-scroll container for mobile
  var articleTables = document.querySelectorAll('.article-body table');
  articleTables.forEach(function (tbl) {
    var wrap = document.createElement('div');
    wrap.style.overflowX = 'auto';
    wrap.style.webkitOverflowScrolling = 'touch';
    wrap.style.marginTop = 'var(--space-8)';
    tbl.style.marginTop = '0';
    tbl.parentNode.insertBefore(wrap, tbl);
    wrap.appendChild(tbl);
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', function (e) {
    if (!nav) return;
    if (nav.getAttribute('data-open') !== 'true') return;
    if (!nav.contains(e.target)) {
      nav.setAttribute('data-open', 'false');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
