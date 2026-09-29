/**
 * CİNNAH - CREATIVE DIRECTION FOR GROWTH
 * Master Application Script & Interactive Systems
 */

document.addEventListener('DOMContentLoaded', () => {
  initIntroPreloader();
  initAnkaraClock();
  initCustomCursor();
  initAmbientCanvas();
  initDynamicPortal();
  initHeaderScroll();
  initPortfolioSystem();
  initBriefBuilder();
  initContactForms();
  initSmoothScroll();
});

/* ==========================================================================
   00. SİNEMATİK AÇILIŞ İNTROSU (CİNNAH KARE PORTAL)
   ========================================================================== */
function initIntroPreloader() {
  const preloader = document.getElementById('cinnah-preloader');
  if (!preloader) return;

  // Prevent scrolling during intro
  document.body.style.overflow = 'hidden';

  // 1. Faz: Kare logonun merkezde belirmesi
  setTimeout(() => {
    preloader.classList.add('step-show-logo');
  }, 100);

  // 2. Faz: Karenin devasa büyümesi ve saydamlaşarak siteyi açması
  setTimeout(() => {
    preloader.classList.add('step-expand-portal');
    document.body.style.overflow = '';
  }, 1250);

  // 3. Faz: İntronun DOM'dan temizlenmesi
  setTimeout(() => {
    preloader.classList.add('step-done');
  }, 2350);
}

/* ==========================================================================
   01. ANKARA LIVE CLOCK & STATUS
   ========================================================================== */
function initAnkaraClock() {
  const clockElem = document.getElementById('live-ankara-time');
  if (!clockElem) return;

  function updateClock() {
    // Ankara is UTC+3 (TRT)
    const now = new Date();
    const trTime = new Intl.DateTimeFormat('tr-TR', {
      timeZone: 'Europe/Istanbul',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now);
    
    clockElem.textContent = trTime;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   02. CUSTOM BRUTALIST CURSOR & MAGNETIC INTERACTION
   ========================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const frame = document.querySelector('.custom-cursor-frame');
  if (!dot || !frame) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let frameX = mouseX;
  let frameY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Smooth frame follower with requestAnimationFrame
  function renderCursor() {
    frameX += (mouseX - frameX) * 0.18;
    frameY += (mouseY - frameY) * 0.18;
    frame.style.transform = `translate(${frameX}px, ${frameY}px)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover state detection
  const interactiveElements = document.querySelectorAll('a, button, .work-card, .selectable-chip, .service-row, .manifesto-card, input, textarea');
  
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      frame.classList.add('is-hovering');
    });
    el.addEventListener('mouseleave', () => {
      frame.classList.remove('is-hovering');
    });
  });

  window.addEventListener('mousedown', () => {
    frame.classList.add('is-clicking');
  });

  window.addEventListener('mouseup', () => {
    frame.classList.remove('is-clicking');
  });
}

/* ==========================================================================
   03. AMBIENT BACKGROUND CANVAS (SUBTLE GEOMETRIC BRUTALISM)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = 28;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 4 + 2;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.3 + 0.1;
      this.isRed = Math.random() > 0.7;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }
    draw() {
      ctx.fillStyle = this.isRed 
        ? `rgba(255, 26, 39, ${this.opacity})` 
        : `rgba(255, 255, 255, ${this.opacity * 0.5})`;
      
      // Draw square particle mirroring the brand identity
      ctx.fillRect(this.x, this.y, this.size, this.size);
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting laser lines for close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 26, 39, ${0.08 * (1 - dist / 140)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   04. DİNAMİK 3D CİNNAH KARE PORTALI (MOUSE PARALLAX & JİROSKOP)
   ========================================================================== */
function initDynamicPortal() {
  const heroSection = document.getElementById('hero');
  const gyro = document.getElementById('portal-gyroscope');
  if (!heroSection || !gyro) return;

  let currentRotateX = 0;
  let currentRotateY = 0;
  let targetRotateX = 0;
  let targetRotateY = 0;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    // Max 18 degrees rotation on X and Y
    targetRotateY = deltaX * 16;
    targetRotateX = -deltaY * 16;
  });

  heroSection.addEventListener('mouseleave', () => {
    targetRotateX = 0;
    targetRotateY = 0;
  });

  function renderGyroscope() {
    currentRotateX += (targetRotateX - currentRotateX) * 0.08;
    currentRotateY += (targetRotateY - currentRotateY) * 0.08;

    gyro.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
    requestAnimationFrame(renderGyroscope);
  }
  requestAnimationFrame(renderGyroscope);
}

/* ==========================================================================
   05. BAŞLIK KAYDIRMA DURUMU & MOBİL MENÜ
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.querySelector('.nav-structured-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    // Close mobile menu on clicking any sublink
    navMenu.querySelectorAll('.nav-sublink').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }
}

/* ==========================================================================
   06. PORTFÖY SİSTEMİ & PROJE DETAY MODALI
   ========================================================================== */
const projectData = {
  'brand-his': {
    title: '02 / HİS: ÖNCE HİSSEDİLİR.',
    client: 'Cinnah Marka Mimarisi',
    year: '2026',
    category: 'Mekansal Mimari & Duyusal Marka Deneyimi',
    image: 'assets/images/brand_02_his.png',
    lead: 'Stratejiden Deneyime: Markanızın zihinlerde ve kalplerde bıraktığı o eşsiz ve silinmez hissi tasarlarız.',
    overview: 'İnsanlar rasyonel gerekçelerle onaylar ama duygusal rezonansla karar verir. Cinnah kırmızı monolitik portal formunu fiziksel ve dijital mimariye entegre ederek, markanızın ilk temas anında sarsıcı bir etki yaratmasını sağlıyoruz.',
    deliverables: ['Kreatif Direktörlük', 'Marka Mimarisi', 'Mekansal Kimlik', 'Duyusal Deneyim', 'Kurumsal Kimlik Sistemleri'],
    metrics: '+420% Marka Hatırlanırlığı · Uluslararası Tasarım Ödülü · Global Rezonans'
  },
  'brand-yon': {
    title: '03 / YÖN: BÜYÜMEYE YÖN VER.',
    client: 'Cinnah Stratejik Büyüme Yönetimi',
    year: '2026',
    category: '360° Stratejik Büyüme & Kreatif Yönetim',
    image: 'assets/images/brand_03_yon.png',
    lead: 'Strateji. Yaratıcılık. Büyüme: Yaratıcılık süsleme değil, en keskin büyüme kaldıracıdır.',
    overview: 'Doğru kreatif direksiyon, bir markanın sadece görünür olmasını değil, kategorisini domine etmesini sağlar. Perspektife uzanan kırmızı geçitler gibi, markaları aşama aşama pazar liderliğine taşıyan stratejik bir yol haritası kuruyoruz.',
    deliverables: ['Büyüme Stratejisi', 'Kreatif Yönetim', 'Kampanya Mimarisi', 'Pazar Liderliği Stratejisi'],
    metrics: '8.4x Ortalama Pazar Büyümesi · %96 Kategori Dominasyonu'
  },
  'brand-kok': {
    title: '01 / KÖK: ANKARA\'DAN. DÜNYAYA.',
    client: 'Cinnah Kültürel Vakıf & Stüdyo',
    year: '2025 - 2026',
    category: 'Şehir Kültürü, Brütalist Miras & Küresel Vizyon',
    image: 'assets/images/brand_01_kok.png',
    lead: 'Bir şehirden doğan, sınırları aşan bakış: Köklerimiz sağlam, vizyonumuz küresel.',
    overview: 'Ankara’nın brütalist mimari mirasından, yağmurlu asfaltından ve entelektüel ağırlığından ilham alıyoruz. Kökü olmayan fikirler savrulur; temeli sağlam yapılar çağları aşar felsefesiyle dünya standartlarında üretim yapıyoruz.',
    deliverables: ['Küratöryel Direktörlük', 'Kültürel Miras Monografisi', 'Global Kampanya', 'Marka Filmi'],
    metrics: 'Altın Pusula Kültür Ödülü · 12+ Ülkede Sergi ve Pazar Etkisi'
  },
  'noir-atelier': {
    title: '04 / NOIR EDITIONS ATELIER',
    client: 'Maison Noir Paris / Milano',
    year: '2025',
    category: 'Yüksek Moda & Tipografik Kimlik',
    image: 'assets/images/case_editorial.jpg',
    lead: 'Modern Silüet ve Tipografi: Yüksek moda dünyasında heykelsi ve keskin bir kimlik.',
    overview: 'Paris ve Milano moda haftalarında sergilenen Noir Editions için tipografiyi ve monokrom kontrastları heykelimsi bir disiplinle harmanladık. Yüksek kontrastlı scarlet red zeminler ile markaya zamansız bir duruş kazandırdık.',
    deliverables: ['Marka Kimliği & Tipografi', 'Editoryal Direktörlük', 'Defile Görselleri', 'Ambalaj ve Monografi Tasarımı'],
    metrics: 'Paris Moda Haftası Öne Çıkanlar · Red Dot Tipografi Adaylığı'
  }
};

function initPortfolioSystem() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');
  const modalBackdrop = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');

  // Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 20);
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // Modal Open
  workCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project');
      const data = projectData[projectId];
      if (!data || !modalBackdrop) return;

      document.getElementById('modal-img').src = data.image;
      document.getElementById('modal-category').textContent = `${data.year} · ${data.category}`;
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-lead').textContent = data.lead;
      document.getElementById('modal-overview').textContent = data.overview;
      document.getElementById('modal-client').textContent = data.client;
      document.getElementById('modal-year').textContent = data.year;
      document.getElementById('modal-metrics').textContent = data.metrics;

      const deliverablesList = document.getElementById('modal-deliverables');
      deliverablesList.innerHTML = '';
      data.deliverables.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        deliverablesList.appendChild(li);
      });

      modalBackdrop.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Modal Close
  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   07. INTERACTIVE BRIEF BUILDER ("HAREKETE GEÇ")
   ========================================================================== */
function initBriefBuilder() {
  const briefForm = document.getElementById('brief-form');
  if (!briefForm) return;

  briefForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('brief-name')?.value.trim();
    const email = document.getElementById('brief-email')?.value.trim();
    const subject = document.getElementById('brief-subject')?.value.trim();
    const message = document.getElementById('brief-message')?.value.trim();

    if (!name || !email || !message) {
      showToast('Lütfen gerekli alanları doldurunuz.');
      return;
    }

    showToast(`Teşekkürler Sayın ${name}. İletiniz başarıyla alındı, en kısa sürede dönüş yapacağız.`);
    briefForm.reset();
  });
}

/* ==========================================================================
   08. CONTACT FORMS & NEWSLETTER
   ========================================================================== */
function initContactForms() {
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;
      if (email) {
        showToast('Cinnah Journal bültenine başarıyla kaydoldunuz.');
        newsletterForm.reset();
      }
    });
  }
}

/* ==========================================================================
   09. SMOOTH SCROLL & TOAST SYSTEM
   ========================================================================== */
function initSmoothScroll() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function showToast(msg) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    toast.innerHTML = `<span style="color: var(--c-red)">■</span> <span class="toast-text"></span>`;
    document.body.appendChild(toast);
  }

  toast.querySelector('.toast-text').textContent = msg;
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
