document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Build spine nodes matching sections
  const sections = [
    { id: 'top', label: 'Home' },
    { id: 'profile', label: 'Profile' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' }
  ];

  const spine = document.getElementById('spine');
  const nodes = {};

  if (spine) {
    const fragment = document.createDocumentFragment();
    sections.forEach((s, i) => {
      const node = document.createElement('div');
      node.className = 'spine-node';
      node.style.top = (i / (sections.length - 1)) * 100 + '%';
      node.innerHTML = `<span class="lbl">${s.label}</span>`;
      fragment.appendChild(node);
      nodes[s.id] = node;
    });
    spine.appendChild(fragment);
  }

  // Animate the fill on scroll (throttled via rAF)
  const spineFill = document.getElementById('spineFill');
  let ticking = false;

  function updateFill() {
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - doc.clientHeight;
    const scrolled = maxScroll > 0 ? (doc.scrollTop / maxScroll) * 100 : 0;
    if (spineFill) spineFill.style.height = Math.min(Math.max(scrolled, 0), 100) + '%';
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateFill);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateFill();

  // Active section detection
  const sectionEls = document.querySelectorAll('[data-section]');
  if (sectionEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('data-section');
        if (entry.isIntersecting && nodes[id]) {
          Object.values(nodes).forEach((n) => n.classList.remove('active'));
          nodes[id].classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sectionEls.forEach((sec) => observer.observe(sec));
  }
});