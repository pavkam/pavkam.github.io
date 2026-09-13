// Thought Dumpster — console shell behaviour.
// No jQuery / Bootstrap: the HUD, menu, search overlay and key bindings are
// all handled here.

(function () {
  'use strict';

  var CRT = {

    init: function () {
      CRT.powerOn();
      CRT.clock();
      CRT.menu();
      CRT.hudScroll();
      CRT.cover();
      CRT.search();
      CRT.keys();
      CRT.amber();
    },

    // Drop the power-on overlay once it has played so it can never trap input.
    powerOn: function () {
      var el = document.querySelector('.crt-power');
      if (!el) { return; }
      window.setTimeout(function () {
        if (el.parentNode) { el.parentNode.removeChild(el); }
      }, 900);
    },

    // Live clock in the top HUD.
    clock: function () {
      var el = document.getElementById('hud-clock');
      if (!el) { return; }
      var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
      var tick = function () {
        var d = new Date();
        el.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
      };
      tick();
      window.setInterval(tick, 1000);
    },

    // Mobile menu toggle (replaces Bootstrap collapse).
    menu: function () {
      var btn = document.getElementById('menu-toggle');
      var menu = document.getElementById('hud-menu');
      if (!btn || !menu) { return; }

      btn.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    },

    // Compact the top HUD once the screen has scrolled.
    hudScroll: function () {
      var hud = document.querySelector('.hud--top');
      if (!hud) { return; }
      var onScroll = function () {
        hud.classList.toggle('is-compact', window.pageYOffset > 40);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    },

    // --- Cover image rotation ------------------------------------------------

    cover: function () {
      var data = document.getElementById('header-big-imgs');
      var frame = document.querySelector('.cover__img');
      if (!data || !frame) { return; }

      var count = parseInt(data.getAttribute('data-num-img'), 10) || 1;
      var descEl = document.querySelector('.cover__desc');

      var pick = function () {
        var n = Math.floor(Math.random() * count) + 1;
        return {
          src: data.getAttribute('data-img-src-' + n),
          desc: data.getAttribute('data-img-desc-' + n)
        };
      };

      var show = function (info) {
        if (!info.src) { return; }
        frame.style.backgroundImage = 'url(' + info.src + ')';
        if (!descEl) { return; }
        if (info.desc) {
          descEl.textContent = info.desc;
          descEl.hidden = false;
        } else {
          descEl.hidden = true;
        }
      };

      show(pick());

      if (count > 1) {
        window.setInterval(function () { show(pick()); }, 7000);
      }
    },

    // --- Search overlay ------------------------------------------------------

    search: function () {
      var overlay = document.getElementById('search-overlay');
      if (!overlay) { return; }

      var input = document.getElementById('nav-search-input');
      var open = document.getElementById('nav-search-link');
      var exit = document.getElementById('nav-search-exit');

      CRT.openSearch = function (e) {
        if (e) { e.preventDefault(); }
        overlay.hidden = false;
        document.body.classList.add('is-locked');
        if (input) { input.focus(); input.select(); }
      };

      CRT.closeSearch = function () {
        overlay.hidden = true;
        document.body.classList.remove('is-locked');
      };

      if (open) { open.addEventListener('click', CRT.openSearch); }
      if (exit) { exit.addEventListener('click', CRT.closeSearch); }

      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) { CRT.closeSearch(); }
      });
    },

    // --- Keyboard: number keys jump, "/" searches, ESC closes ----------------

    keys: function () {
      var typing = function (el) {
        var tag = (el.tagName || '').toLowerCase();
        return tag === 'input' || tag === 'textarea' || el.isContentEditable;
      };

      document.addEventListener('keydown', function (e) {
        if (e.metaKey || e.ctrlKey || e.altKey) { return; }

        if (e.key === 'Escape') {
          if (CRT.closeSearch) { CRT.closeSearch(); }
          return;
        }

        if (typing(e.target)) { return; }

        if (e.key === '/') {
          if (CRT.openSearch) { CRT.openSearch(e); }
          return;
        }

        if (/^[1-9]$/.test(e.key)) {
          var target = document.querySelector('.hud--top .mi[data-key="' + e.key + '"]');
          if (target && target.href) {
            e.preventDefault();
            window.location.href = target.href;
          }
        }
      });
    },

    // --- Konami code: swap the tube to amber phosphor ------------------------

    amber: function () {
      var seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
                 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
      var pos = 0;

      var store = function (on) {
        try {
          if (window.localStorage) { localStorage.setItem('crt-amber', on ? '1' : '0'); }
        } catch (err) { /* storage unavailable */ }
      };

      try {
        if (window.localStorage && localStorage.getItem('crt-amber') === '1') {
          document.body.classList.add('amber-mode');
        }
      } catch (err) { /* storage unavailable */ }

      document.addEventListener('keydown', function (e) {
        var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        pos = (key === seq[pos]) ? pos + 1 : (key === seq[0] ? 1 : 0);
        if (pos !== seq.length) { return; }
        pos = 0;
        store(document.body.classList.toggle('amber-mode'));
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', CRT.init);
  } else {
    CRT.init();
  }
})();
