/* ===== dGold.ai — Main JavaScript ===== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initPersonaTabs();
  initModuleTabs();
  initTestimonialCarousel();
  initPricingCalculator();
  initResourceFilters();
  initLeadForm();
  initNewsletterForm();
  initScrollAnimations();
  initCounterAnimations();
});

/* ── Navbar ── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

/* ── Persona Tabs ── */
function initPersonaTabs() {
  const tabs = document.querySelectorAll('.personas__tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.personas__panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-' + tab.dataset.panel).classList.add('active');
    });
  });
}

/* ── Module Tabs ── */
function initModuleTabs() {
  const tabs = document.querySelectorAll('.modules__tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.modules__panel').forEach(p => p.classList.remove('active'));
      document.getElementById('module-' + tab.dataset.module).classList.add('active');
    });
  });
}

/* ── Testimonial Carousel ── */
function initTestimonialCarousel() {
  const carousel = document.getElementById('testimonialCarousel');
  const cards = carousel.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  let currentIndex = 0;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.addEventListener('click', () => scrollToCard(i));
    dotsContainer.appendChild(dot);
  });

  function scrollToCard(index) {
    currentIndex = index;
    const card = cards[index];
    carousel.scrollTo({ left: card.offsetLeft - carousel.offsetLeft - 16, behavior: 'smooth' });
    updateDots();
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.testimonials__dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = Math.max(0, currentIndex - 1);
    scrollToCard(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = Math.min(cards.length - 1, currentIndex + 1);
    scrollToCard(currentIndex);
  });

  // Update dots on scroll
  let scrollTimeout;
  carousel.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollLeft = carousel.scrollLeft;
      let closestIndex = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - carousel.offsetLeft - scrollLeft);
        if (dist < closestDist) { closestDist = dist; closestIndex = i; }
      });
      currentIndex = closestIndex;
      updateDots();
    }, 100);
  });
}

/* ── Pricing Calculator ── */
function initPricingCalculator() {
  const slider = document.getElementById('userSlider');
  const userDisplay = document.getElementById('userCountDisplay');
  const toggles = document.querySelectorAll('#moduleToggles .calc-toggle');
  const deployRadios = document.querySelectorAll('#deploymentRadios .calc-radio');
  const llmRadios = document.querySelectorAll('#llmRadios .calc-radio');

  function calculate() {
    const users = parseInt(slider.value);
    userDisplay.textContent = users;

    // Sum selected module prices
    let basePerUser = 0;
    toggles.forEach(t => {
      if (t.classList.contains('active')) basePerUser += parseInt(t.dataset.price);
    });

    // Deployment multiplier
    const deployment = document.querySelector('input[name="deployment"]:checked').value;
    const depMultiplier = deployment === 'saas' ? 1.15 : deployment === 'hybrid' ? 1.08 : 1;

    // LLM option
    const llm = document.querySelector('input[name="llm"]:checked').value;
    const llmAddon = llm === 'byol' ? -3 : 0; // discount if BYOL

    const perUser = Math.round((basePerUser + llmAddon) * depMultiplier);
    const monthly = perUser * users;
    const annual = monthly * 12;

    // ROI calculations
    const avgDataCost = users * 800; // estimated data operations cost/month
    const savings = Math.round(avgDataCost * 0.583); // 58.3% optimization
    const annualSavings = savings * 12;
    const paybackMonths = monthly > 0 ? Math.ceil(annual / annualSavings) : 0;

    // Update display
    document.getElementById('perUserCost').textContent = '$' + perUser;
    document.getElementById('monthlyCost').textContent = '$' + monthly.toLocaleString();
    document.getElementById('annualCost').textContent = '$' + annual.toLocaleString();
    document.getElementById('roiPurity').textContent = '91.67%';
    document.getElementById('roiSavings').textContent = '$' + annualSavings.toLocaleString();
    document.getElementById('roiPayback').textContent = paybackMonths + ' mo';
  }

  slider.addEventListener('input', calculate);

  toggles.forEach(t => {
    t.addEventListener('click', () => {
      t.classList.toggle('active');
      calculate();
    });
  });

  deployRadios.forEach(radio => {
    radio.addEventListener('click', () => {
      deployRadios.forEach(r => r.classList.remove('active'));
      radio.classList.add('active');
      radio.querySelector('input').checked = true;
      calculate();
    });
  });

  llmRadios.forEach(radio => {
    radio.addEventListener('click', () => {
      llmRadios.forEach(r => r.classList.remove('active'));
      radio.classList.add('active');
      radio.querySelector('input').checked = true;
      calculate();
    });
  });

  calculate(); // initial
}

/* ── Resource Filters ── */
function initResourceFilters() {
  const filters = document.querySelectorAll('.resources__filter');
  const cards = document.querySelectorAll('.resource-card');

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');
      const type = filter.dataset.filter;
      cards.forEach(card => {
        if (type === 'all' || card.dataset.type === type) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease-out forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ── Lead Form ── */
function initLeadForm() {
  const form = document.getElementById('leadFormEl');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.form-field').forEach(f => f.classList.remove('error'));
    form.querySelectorAll('.form-field__error').forEach(e => e.remove());

    // Validate required fields
    const fields = [
      { id: 'leadName', msg: 'Please enter your name' },
      { id: 'leadEmail', msg: 'Please enter a valid work email' },
      { id: 'leadCompany', msg: 'Please enter your company' },
      { id: 'leadRole', msg: 'Please select your role' }
    ];

    fields.forEach(({ id, msg }) => {
      const el = document.getElementById(id);
      const field = el.closest('.form-field');
      if (!el.value || (id === 'leadEmail' && !el.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))) {
        field.classList.add('error');
        const errEl = document.createElement('div');
        errEl.className = 'form-field__error';
        errEl.textContent = msg;
        field.appendChild(errEl);
        valid = false;
      }
    });

    if (valid) {
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = '✓ Thank You! We\'ll Be in Touch.';
      btn.style.background = 'var(--color-green)';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Request Your Demo →';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 4000);
    }
  });
}

/* ── Newsletter Form ── */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn = form.querySelector('button');
    if (input.value && input.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      btn.textContent = '✓ Subscribed!';
      btn.style.background = 'var(--color-green)';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
        input.value = '';
      }, 3000);
    }
  });
}

/* ── Scroll Animations ── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Counter Animations ── */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const decimals = parseInt(el.dataset.decimals) || 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const current = target * eased;
          el.textContent = current.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}
