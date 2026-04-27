/**
 * مقرأة غِنديات – main.js
 * التنقل، شريط الإعلانات، عدادات، مزامنة API
 */

// ══════════════════════════════════════════
// 1. شريط التنقل
// ══════════════════════════════════════════
(function initNav() {
  const nav    = document.getElementById('mainNav');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!nav) return;

  // تمييز الرابط الحالي
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current) a.classList.add('active');
  });

  // تغيّر الخلفية عند التمرير
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // قائمة الجوال
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    // إغلاق عند النقر على رابط
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  // إغلاق عند النقر خارج القائمة
  document.addEventListener('click', e => {
    if (links && links.classList.contains('open') &&
        !nav.contains(e.target)) {
      toggle?.classList.remove('open');
      links.classList.remove('open');
    }
  });
})();

// ══════════════════════════════════════════
// 2. التمرير السلس للروابط الداخلية
// ══════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ══════════════════════════════════════════
// 3. عدادات الهيرو (تأثير الارتفاع)
// ══════════════════════════════════════════
function animateCounter(el) {
  const target = parseInt(el.dataset.target) || 0;
  const duration = 1200;
  const step = Math.ceil(target / (duration / 30));
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString('ar');
    if (current >= target) clearInterval(timer);
  }, 30);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.hero-stats, .stats-grid').forEach(el => {
  counterObserver.observe(el);
});

// ══════════════════════════════════════════
// 4. تأثير الظهور عند التمرير
// ══════════════════════════════════════════
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .program-card, .sheikh-card, .certificate-card, .feature-item, .reader-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  fadeObserver.observe(el);
});

// ══════════════════════════════════════════
// 5. مزامنة الإعلانات من API
// ══════════════════════════════════════════
async function syncAnnouncements() {
  const bar = document.getElementById('announcementsBar');
  const ticker = document.getElementById('announcementsTicker');
  if (!bar || !ticker) return;

  try {
    const res = await fetch('tables/announcements?limit=10&sort=created_at');
    const data = await res.json();
    const active = (data.data || []).filter(a => a.is_active === true || a.is_active === 'true');

    if (active.length > 0) {
      const items = active.map(a =>
        `<span class="ticker-item"><i class="fas fa-star"></i> ${a.title}</span>`
      ).join('');
      ticker.innerHTML = items + items; // مضاعفة لتأثير اللف
    }
  } catch (e) { /* الاحتفاظ بالمحتوى الافتراضي */ }
}
syncAnnouncements();

// ══════════════════════════════════════════
// 6. رابط الشعار – معالجة الخطأ
// ══════════════════════════════════════════
document.querySelectorAll('img[src="images/logo.png"]').forEach(img => {
  img.addEventListener('error', function() {
    this.style.display = 'none';
  });
});

// ══════════════════════════════════════════
// 7. إخفاء شريط الإعلانات عند التمرير
// ══════════════════════════════════════════
let lastScroll = 0;
const annBar = document.querySelector('.announcements-bar');
if (annBar) {
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 100 && current > lastScroll) {
      annBar.style.transform = 'translateY(-100%)';
    } else {
      annBar.style.transform = 'translateY(0)';
    }
    lastScroll = current;
  }, { passive: true });
}

// ══════════════════════════════════════════
// 8. مزامنة إعدادات الموقع
// ══════════════════════════════════════════
async function syncSiteSettings() {
  try {
    const res  = await fetch('tables/settings?limit=1');
    const data = await res.json();
    const s    = (data.data || [])[0];
    if (!s) return;

    // تحديث العبارة الرئيسية
    const tagEl = document.getElementById('heroTagline');
    if (tagEl && s.tagline) tagEl.textContent = s.tagline;

    // تحديث الوصف
    const descEl = document.getElementById('heroDesc');
    if (descEl && s.description) descEl.textContent = s.description;

    // تحديث روابط واتساب
    if (s.whatsapp) {
      const phone = s.whatsapp.replace(/\D/g, '');
      document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
        a.href = `https://wa.me/${phone}`;
      });
    }

    // تحديث روابط تيليجرام
    if (s.telegram) {
      const tg = s.telegram.replace('@', '');
      document.querySelectorAll('a[href*="t.me"]').forEach(a => {
        a.href = `https://t.me/${tg}`;
      });
    }
  } catch (e) { /* تجاهل */ }
}
if (!window.location.pathname.includes('admin') && !window.location.pathname.includes('login')) {
  syncSiteSettings();
}

// ══════════════════════════════════════════
// 9. نموذج التواصل – إرسال
// ══════════════════════════════════════════
async function submitContact(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('[type=submit]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="loader"></span> جاري الإرسال...';
  btn.disabled = true;

  const name    = form.querySelector('[name=name]')?.value || '';
  const phone   = form.querySelector('[name=phone]')?.value || '';
  const subject = form.querySelector('[name=subject]')?.value || '';
  const message = form.querySelector('[name=message]')?.value || '';

  try {
    await fetch('tables/contact_messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, subject, message })
    });
    showSuccessMsg(form);
  } catch (err) {
    alert('حدث خطأ، حاولي مرة أخرى');
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

function showSuccessMsg(form) {
  form.innerHTML = `
    <div style="text-align:center;padding:40px">
      <div style="font-size:3rem;color:var(--gold-primary);margin-bottom:16px">✓</div>
      <h3 style="color:var(--brown-dark)">تم إرسال رسالتكِ بنجاح</h3>
      <p style="margin-top:8px">سيتم التواصل معكِ قريبًا، شكرًا لتواصلكِ مع مقرأة غِنديات</p>
    </div>`;
}

document.querySelectorAll('.contact-form').forEach(f => {
  f.addEventListener('submit', submitContact);
});

// ══════════════════════════════════════════
// 10. دالة toggleFaq العامة
// ══════════════════════════════════════════
function toggleFaq(btn) {
  const item   = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  // إغلاق كل الأسئلة أولاً
  document.querySelectorAll('.faq-item.open').forEach(f => {
    f.classList.remove('open');
    const q = f.querySelector('.faq-q');
    if (q) q.setAttribute('aria-expanded','false');
  });
  // فتح المطلوب إن لم يكن مفتوحاً
  if (!isOpen) {
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

// ══════════════════════════════════════════
// 11. منع النقر على الصور بالزر الأيمن
// ══════════════════════════════════════════
document.querySelectorAll('.certificate-card img, .sheikh-card img').forEach(img => {
  img.addEventListener('contextmenu', e => e.preventDefault());
});

// ══════════════════════════════════════════
// 12. الكاروسيل التلقائي للبانرات
// ══════════════════════════════════════════
(function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots   = document.querySelectorAll('.carousel-dot');
  if (!slides.length) return;

  let cur = 0;
  let timer;

  function goTo(idx) {
    slides[cur]?.classList.remove('active');
    dots[cur]?.classList.remove('active');
    cur = (idx + slides.length) % slides.length;
    slides[cur]?.classList.add('active');
    dots[cur]?.classList.add('active');
  }

  function next() { goTo(cur + 1); }

  function start() { timer = setInterval(next, 5000); }
  function stop()  { clearInterval(timer); }

  // أزرار التنقل
  document.querySelectorAll('[data-carousel-prev]').forEach(b =>
    b.addEventListener('click', () => { stop(); goTo(cur - 1); start(); })
  );
  document.querySelectorAll('[data-carousel-next]').forEach(b =>
    b.addEventListener('click', () => { stop(); goTo(cur + 1); start(); })
  );
  dots.forEach((d, i) => d.addEventListener('click', () => { stop(); goTo(i); start(); }));

  // بدء
  if (slides.length > 1) { slides[0].classList.add('active'); dots[0]?.classList.add('active'); start(); }

  // إيقاف عند التمرير فوقه
  const hero = document.querySelector('.hero-carousel');
  if (hero) {
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
  }
})();

// ══════════════════════════════════════════
// 13. مزامنة البانرات من API (للصفحة الرئيسية)
// ══════════════════════════════════════════
async function syncBanners() {
  const carousel = document.getElementById('heroCarousel');
  if (!carousel) return;
  try {
    const res  = await fetch('tables/banners?limit=10&sort=order');
    const data = await res.json();
    const active = (data.data || []).filter(b => b.status !== 'inactive');
    if (!active.length) return;

    carousel.innerHTML = active.map((b, i) => `
      <div class="carousel-slide ${i === 0 ? 'active' : ''}">
        ${b.image_url
          ? `<img src="${b.image_url}" alt="${b.title || ''}" loading="${i ? 'lazy' : 'eager'}">`
          : '<div class="hero-carousel-placeholder"></div>'}
        <div class="overlay"></div>
        ${b.subtitle ? `<div style="position:absolute;bottom:80px;left:50%;transform:translateX(-50%);z-index:5;text-align:center;color:var(--gold-lighter);font-family:'Scheherazade New',serif;font-size:clamp(1.2rem,3vw,1.8rem);padding:0 24px">${b.subtitle}</div>` : ''}
      </div>`).join('');

    // تحديث نقاط التنقل
    const dotsWrap = document.getElementById('carouselDots');
    if (dotsWrap) {
      dotsWrap.innerHTML = active.map((_, i) =>
        `<div class="carousel-dot ${i===0?'active':''}" data-idx="${i}"></div>`
      ).join('');
      dotsWrap.querySelectorAll('.carousel-dot').forEach((d,i) =>
        d.addEventListener('click', () => goTo(i))
      );
    }
  } catch (e) {}
}

// ══════════════════════════════════════════
// 14. تأثير ظهور العناصر عند التمرير (fade-in)
// ══════════════════════════════════════════
const scrollReveal = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      scrollReveal.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.program-card, .sheikh-card, .certificate-card, .reader-card, .channel-card, .c-stat, .resp-item, .info-card'
).forEach(el => {
  if (!el.style.opacity) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    scrollReveal.observe(el);
  }
});
document.querySelectorAll('.revealed').forEach(el => {
  el.style.opacity = '1';
  el.style.transform = 'none';
});

// ── أضف القاعدة في CSS ديناميكياً ──
const revealStyle = document.createElement('style');
revealStyle.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(revealStyle);

// ══════════════════════════════════════════
// 15. مزامنة المعلمات في الصفحة الرئيسية
// ══════════════════════════════════════════
async function syncHomeSheikhs() {
  const grid = document.getElementById('homeSheikhs');
  if (!grid) return;
  try {
    const res  = await fetch('tables/sheikhs?limit=6&sort=order');
    const data = await res.json();
    const list = (data.data || []).filter(s => s.status !== 'inactive');
    if (!list.length) return;

    grid.innerHTML = list.map(s => `
      <div class="sheikh-card">
        <div class="sheikh-card-image">
          ${s.photo_url
            ? `<img src="${s.photo_url}" alt="${s.name}" loading="lazy">`
            : '<div class="sheikh-avatar-placeholder"><i class="fas fa-user-graduate"></i></div>'}
        </div>
        <div class="sheikh-card-body">
          <div class="sheikh-name">${s.name}</div>
          ${s.speciality ? `<div class="sheikh-speciality">${s.speciality}</div>` : ''}
          ${s.bio ? `<p class="sheikh-bio">${s.bio.substring(0, 120)}${s.bio.length > 120 ? '...' : ''}</p>` : ''}
        </div>
      </div>`).join('');
  } catch (e) {}
}

// ══════════════════════════════════════════
// 16. مزامنة التلاوات في الصفحة الرئيسية
// ══════════════════════════════════════════
async function syncHomeRecitations() {
  const grid = document.getElementById('homeRecitations');
  if (!grid) return;
  try {
    const res  = await fetch('tables/recitations?limit=4&sort=order');
    const data = await res.json();
    const list = (data.data || []).filter(r => r.status !== 'inactive');
    if (!list.length) return;

    grid.innerHTML = list.map(r => `
      <div class="recitation-player" onclick="playHomeRec('${r.audio_url || ''}','${r.surah_name || ''}','${r.sheikh_name || ''}')">
        <div class="player-btn"><i class="fas ${r.audio_url ? 'fa-play' : 'fa-volume-mute'}"></i></div>
        <div class="player-info">
          <div class="player-title">${r.surah_name || '—'}</div>
          <div class="player-sub">${[r.sheikh_name, r.riwaya].filter(Boolean).join(' · ')}</div>
        </div>
        <span style="font-size:.8rem;color:rgba(255,255,255,.4)">${r.duration || ''}</span>
      </div>`).join('');
  } catch (e) {}
}

let _homeAudio = null;
function playHomeRec(url, title, sheikh) {
  if (!url) { showToast('لا يوجد ملف صوتي', 'warning'); return; }
  if (!_homeAudio) _homeAudio = new Audio();
  _homeAudio.src = url;
  _homeAudio.play().catch(() => showToast('تعذّر تشغيل الصوت', 'error'));
  showToast(`▶ ${title} – ${sheikh}`, 'success');
}

// ══════════════════════════════════════════
// 17. دالة toast الإشعارات
// ══════════════════════════════════════════
function showToast(msg, type = 'success', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(-20px)'; setTimeout(() => toast.remove(), 300); }, duration);
}

// ══════════════════════════════════════════
// 18. تشغيل مزامنات الصفحة الرئيسية
// ══════════════════════════════════════════
if (!window.location.pathname.includes('admin') && !window.location.pathname.includes('login')) {
  syncBanners();
  syncHomeSheikhs();
  syncHomeRecitations();
}

console.log('✦ مقرأة غِنديات – تم تحميل main.js ✓');
