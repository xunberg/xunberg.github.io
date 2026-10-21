(function () {
  function slugify(text) {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'section';
  }

  function initTableOfContents() {
    const article = document.getElementById('post-article');
    const list = document.querySelector('.post-toc__list');
    const toc = document.getElementById('post-toc');
    if (!article || !list || !toc) return;

    const headings = article.querySelectorAll('h2, h3');
    if (headings.length < 2) {
      toc.closest('.post-toc-panel')?.classList.add('post-toc-panel--hidden');
      return;
    }

    const usedIds = new Set();
    headings.forEach((heading) => {
      if (!heading.id) {
        let base = slugify(heading.textContent);
        let id = base;
        let n = 2;
        while (usedIds.has(id)) {
          id = `${base}-${n++}`;
        }
        heading.id = id;
        usedIds.add(id);
      } else {
        usedIds.add(heading.id);
      }

      const li = document.createElement('li');
      li.className = heading.tagName === 'H3' ? 'post-toc__item post-toc__item--depth-3' : 'post-toc__item';
      const a = document.createElement('a');
      a.href = `#${heading.id}`;
      a.textContent = heading.textContent;
      a.dataset.target = heading.id;
      li.appendChild(a);
      list.appendChild(li);
    });

    const toggle = document.querySelector('.post-toc-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const open = toc.classList.toggle('post-toc--open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    const links = list.querySelectorAll('a');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((link) => {
              link.classList.toggle('is-active', link.dataset.target === entry.target.id);
            });
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
  }

  function initCodeCopy() {
    document.querySelectorAll('#post-article pre').forEach((pre) => {
      const code = pre.querySelector('code');
      if (!code || pre.querySelector('.copy-code-btn')) return;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-code-btn';
      button.setAttribute('aria-label', '复制代码');
      button.textContent = '复制';
      pre.classList.add('code-block-wrap');
      pre.appendChild(button);

      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.innerText);
          button.textContent = '已复制';
          button.classList.add('copy-code-btn--success');
          setTimeout(() => {
            button.textContent = '复制';
            button.classList.remove('copy-code-btn--success');
          }, 2000);
        } catch (err) {
          button.textContent = '失败';
          setTimeout(() => {
            button.textContent = '复制';
          }, 2000);
        }
      });
    });
  }

  function initReadingProgress() {
    const bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    window.addEventListener(
      'scroll',
      () => {
        const scrollTop = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const pct = height > 0 ? (scrollTop / height) * 100 : 0;
        bar.style.width = `${pct}%`;
      },
      { passive: true }
    );
  }

  function initAnchorScroll() {
    document.querySelector('#post-article')?.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${id}`);
      }
    });
  }

  function initQrLightbox() {
    const lightbox = document.getElementById('support-qr-lightbox');
    const img = document.getElementById('support-qr-lightbox-img');
    const caption = document.getElementById('qr-lightbox-caption');
    const closeBtn = document.getElementById('support-qr-lightbox-close');
    if (!lightbox || !img) return;

    const open = (src, label) => {
      img.src = src;
      img.alt = label;
      if (caption) caption.textContent = label;
      if (typeof lightbox.showModal === 'function') {
        lightbox.showModal();
      }
    };

    document.querySelectorAll('.js-qr-zoom').forEach((btn) => {
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-qr-src');
        const label = btn.getAttribute('data-qr-label') || '收款码';
        if (src) open(src, label);
      });
    });

    closeBtn?.addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.close();
    });
  }

  function initSupportDialog() {
    const fab = document.getElementById('support-fab');
    const dialog = document.getElementById('support-dialog');
    const closeBtn = document.getElementById('support-dialog-close');
    if (!fab || !dialog) return;

    fab.addEventListener('click', () => {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      }
    });

    closeBtn?.addEventListener('click', () => dialog.close());

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.close();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.post')) return;
    initTableOfContents();
    initCodeCopy();
    initReadingProgress();
    initAnchorScroll();
    initSupportDialog();
    initQrLightbox();
  });
})();
