/* Monolith OS - site script */
(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------------- Year ---------------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Sticky nav state ---------------- */
  const nav = $('#nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 8);
    const top = $('#scrollTop');
    if (top) top.classList.toggle('visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile menu ---------------- */
  const menuBtn = $('#menuBtn');
  const mobile  = $('#mobile-menu');
  if (menuBtn && mobile) {
    const toggle = (force) => {
      const open = force !== undefined ? force : !mobile.classList.contains('open');
      mobile.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobile.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    menuBtn.addEventListener('click', () => toggle());
    $$('a', mobile).forEach(a => a.addEventListener('click', () => toggle(false)));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) toggle(false);
    });
  }

  /* ---------------- Reveal-on-scroll ---------------- */
  const revealEls = $$('.reveal');
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }) : null;
  if (io) revealEls.forEach(el => io.observe(el));
  else    revealEls.forEach(el => el.classList.add('in'));

  /* ---------------- Tabs ---------------- */
  $$('.tabs').forEach(tabsRoot => {
    const tabs   = $$('.tab', tabsRoot);
    const panels = $$('.tab-panel', tabsRoot);
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        panels.forEach(p => { p.classList.remove('active'); p.setAttribute('hidden', ''); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const panel = panels[i];
        if (panel) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');
        }
      });
    });
  });

  /* ---------------- Hero terminal typewriter ---------------- */
  const term = $('#termBody');
  if (term && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const lines = [
      { txt: '$ mnctl info system\n',      cls: 'cmd',     prefix: 'prompt' },
      { txt: '   Distro     Monolith OS 1.0.1 "Obsidian"\n' },
      { txt: '   Kernel     6.10.6-monolith (BORE + BBR3)\n' },
      { txt: '   Profile    full · 4 cores · 8 GB RAM\n' },
      { txt: '   Uptime     14d 3h 22m\n' },
      { txt: '   Load avg   0.42 / 0.58 / 0.61\n\n' },
      { txt: '$ mnctl monitor status\n', cls: 'cmd',     prefix: 'prompt' },
      { txt: '   ✓ ', cls: 'ok' },
      { txt: 'CPU      42%   ▁▂▃▅▆▇█▇▆▅▄▃▃▄▅▆▇█▇\n' },
      { txt: '   ✓ ', cls: 'ok' },
      { txt: 'RAM      4.7 / 8.0 GB    swap  120 MB / 4 GB\n' },
      { txt: '   ✓ ', cls: 'ok' },
      { txt: 'Disk     62 / 102 GB     i/o   45 MB/s read · 12 MB/s write\n' },
      { txt: '   ✓ ', cls: 'ok' },
      { txt: 'Net      eth0  ↑ 4.2 MB/s  ↓ 18.6 MB/s\n\n' },
      { txt: '$ mnctl template deploy minecraft --name pvp\n', cls: 'cmd', prefix: 'prompt' },
      { txt: '   ✓ ', cls: 'ok' },
      { txt: 'pulled image itzg/minecraft-server:java21\n' },
      { txt: '   ✓ ', cls: 'ok' },
      { txt: 'created volume monolith-app-pvp\n' },
      { txt: '   ✓ ', cls: 'ok' },
      { txt: 'started monolith-app-pvp.service\n' },
      { txt: '   ✓ ', cls: 'ok' },
      { txt: 'attached Prometheus target\n\n' },
      { txt: '$ ', cls: 'cmd', prefix: 'prompt' },
    ];

    let i = 0;
    let charIdx = 0;
    let buffer = '';
    const speed = 8; // ms/char

    const tick = () => {
      if (i >= lines.length) return;
      const line = lines[i];
      const txt  = line.txt;
      if (charIdx < txt.length) {
        buffer += txt[charIdx];
        charIdx++;
      }
      // Render with simple span markup.
      term.innerHTML = renderBuffer(lines, i, charIdx);
      if (charIdx >= txt.length) {
        i++;
        charIdx = 0;
      }
      if (i < lines.length) setTimeout(tick, speed);
    };

    function renderBuffer(arr, idx, partial) {
      let html = '';
      for (let k = 0; k < idx; k++) {
        html += wrap(arr[k], arr[k].txt);
      }
      // partial line
      if (idx < arr.length) {
        const part = arr[idx].txt.slice(0, partial);
        html += wrap(arr[idx], part);
      }
      return html;
    }
    function wrap(line, text) {
      const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      // If the line starts with a `$ ` prompt, color the `$` separately.
      if (line.prefix === 'prompt' && escaped.startsWith('$ ')) {
        return `<span class="prompt">$</span><span class="cmd"> ${escaped.slice(2)}</span>`;
      }
      if (line.cls) {
        return `<span class="${line.cls}">${escaped}</span>`;
      }
      return escaped;
    }

    // Kick off when hero is visible
    if (io) {
      const heroOnce = new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) {
          tick();
          obs.disconnect();
        }
      });
      heroOnce.observe(term);
    } else {
      tick();
    }
  }

  /* ---------------- Discord copy ---------------- */
  const copyBtn = $('#copyDiscord');
  const toast   = $('#toast');
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  };
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const handle = 'shiro_eh';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(handle);
        } else {
          const ta = document.createElement('textarea');
          ta.value = handle;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        showToast('Copied "shiro_eh" - DM me on Discord');
      } catch (err) {
        showToast('Could not copy - my Discord is shiro_eh');
      }
    });
  }

  /* ---------------- Smooth scroll for in-page links ---------------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navH = nav ? nav.getBoundingClientRect().height : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', '#' + id);
  });
})();
