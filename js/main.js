const page = document.body.dataset.page || '';
let config = {};

function getNavItems() { return [
  ['Home', 'index.html', 'home'],
  ['About', 'about.html', 'about'],
  ['Impact', 'impact.html', 'impact'],
  ['Read Prophet Uebert Angel Books ↗', config.externalLinks?.prophecyBooks || 'https://uebertangel.org/books/', '', true],
  ['Prayer Request', 'prayer-request.html', 'prayer'],
  ['Give', 'give.html', 'give'],
  ['Socials', 'socials.html', 'socials'],
  ['Contact Us', 'index.html#contact', 'contact']
]; }

function getResourceItems() { return [
  ['GoodNews Resources ↗', config.externalLinks?.goodNewsResources || '[GOODNEWS_RESOURCES_URL]', '', true],
  ['GoodNews Daily Devotional ↗', config.externalLinks?.goodNewsDaily || 'https://goodnewsdailydevotional.com/', '', true],
  ['Healing Institute ↗', config.externalLinks?.healingInstitute || '[HEALING_INSTITUTE_URL]', '', true],
  ['Become A Partner ↗', config.externalLinks?.becomePartner || 'https://uebertangel.org/partner/', '', true],
  ['Merchandise ↗', config.externalLinks?.merchandise || '[MERCHANDISE_URL]', '', true]
]; }

function externalAttributes(isExternal) { return isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''; }

function renderHeader() {
  const items = getNavItems();
  const link = ([label, href, key, isExternal]) => `<a href="${href}"${externalAttributes(isExternal)}${key === page ? ' aria-current="page"' : ''}>${label}</a>`;
  const resources = getResourceItems();
  const resourceMenu = `<details class="nav-group"><summary>GoodNews Resources <span aria-hidden="true">⌄</span></summary><div class="nav-group-menu">${resources.map(link).join('')}</div></details>`;
  const nav = `${items.slice(0, 3).map(link).join('')}${link(items[3])}${resourceMenu}${items.slice(4).map(link).join('')}`;
  document.querySelector('[data-site-header]').innerHTML = `<header class="site-header"><div class="container nav-wrap"><a class="brand" href="index.html" aria-label="Spirit Embassy India, Good News Church Foundation home"><img class="brand-logo" src="assets/logo/church-logo.png" alt="Spirit Embassy India, Good News Church Foundation logo" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="brand-mark" hidden>GN</span><span class="brand-copy">SPIRIT EMBASSY INDIA<br>GOOD NEWS CHURCH FOUNDATION</span></a><button class="menu-toggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button><nav class="nav-links desktop-nav" aria-label="Primary navigation">${nav}</nav><nav class="nav-links mobile-nav" aria-label="Mobile navigation">${nav}</nav></div></header>`;
}

function renderFooter() {
  const footerLinks = getNavItems().map(([label, href, key, isExternal]) => `<a href="${href}"${externalAttributes(isExternal)}>${label}</a>`).join('');
  document.querySelector('[data-site-footer]').innerHTML = `<footer class="site-footer" id="contact"><div class="container"><div class="footer-top"><div class="footer-brand"><a class="brand" href="index.html"><img class="brand-logo" src="assets/logo/church-logo.png" alt="Spirit Embassy India, Good News Church Foundation logo" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="brand-mark" hidden>GN</span><span class="brand-copy">SPIRIT EMBASSY INDIA<br>GOOD NEWS CHURCH FOUNDATION</span></a><p>A place for faith, family and the good news in India. [MISSION_CONTENT]</p></div><div class="footer-col"><h3>Explore</h3><div class="footer-links">${footerLinks}</div></div><div class="footer-col"><h3>Contact Us</h3><div class="footer-links"><a href="socials.html">Instagram / YouTube</a><a href="socials.html">Explore All Socials →</a><span>${config.contact?.address || '[CHURCH ADDRESS]'}</span><span>${config.contact?.phone || '[PHONE NUMBER]'}</span><span>${config.contact?.email || '[EMAIL ADDRESS]'}</span></div></div></div><div class="footer-bottom"><span>© SPIRIT EMBASSY INDIA | GOOD NEWS CHURCH FOUNDATION. All Rights Reserved.</span><span>Built for the good news.</span></div></div></footer>`;
}

function renderWhatsAppButton() {
  if (document.querySelector('.whatsapp-float')) return;
  const href = config.externalLinks?.whatsapp || 'https://wa.link/qfb3vo';
  document.body.insertAdjacentHTML('beforeend', `<a class="whatsapp-float" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="Chat with Spirit Embassy India on WhatsApp" title="Chat with us on WhatsApp"><img class="whatsapp-icon" src="assets/images/WA-Icon.jpg" alt=""></a>`);
}

function initNavigation() {
  const header = document.querySelector('.site-header'); const toggle = document.querySelector('.menu-toggle');
  toggle?.addEventListener('click', () => { const open = header.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); });
  window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 30), { passive: true });
}

function initLoader() {
  const loader = document.querySelector('.loader');
  if (!loader) return;
  const mark = loader.querySelector('.loader-mark');
  const label = loader.querySelector('.loader p');
  const startedAt = performance.now();
  const minimumVisibleTime = 1200;
  let finished = false;

  if (mark) mark.innerHTML = '<img src="assets/logo/church-logo.png" alt="Spirit Embassy India, Good News Church Foundation logo" onerror="this.hidden=true">';
  if (label) label.innerHTML = 'SPIRIT EMBASSY INDIA<br><span>GOOD NEWS CHURCH FOUNDATION</span>';

  const finish = () => {
    if (finished) return;
    finished = true;
    const remaining = Math.max(0, minimumVisibleTime - (performance.now() - startedAt));
    window.setTimeout(() => loader.classList.add('is-done'), remaining);
  };

  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish, { once: true });
}

function initReveals() { const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .1 }); document.querySelectorAll('.reveal').forEach((el) => observer.observe(el)); }

async function loadConfig() { try { const response = await fetch('data/site-config.json'); config = await response.json(); } catch { config = {}; } }

async function boot() { await loadConfig(); if (document.querySelector('[data-site-header]')) renderHeader(); if (document.querySelector('[data-site-footer]')) renderFooter(); renderWhatsAppButton(); initNavigation(); initLoader(); initReveals(); }
boot();