/* ============================================================
   VK AUTOMOTIVE — script.js
   Handles: Nav, Hero Slideshow, Row Sliders, FAQ, Form Logic
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // ── 1. Active Nav Link ──────────────────────────────────────
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // ── 2. Mobile Nav Toggle ────────────────────────────────────
  const toggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      const isOpen = navLinks.classList.contains("open");
      toggle.setAttribute("aria-expanded", isOpen);
    });
    // Close on link click
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // ── 3. Hero Slideshow ───────────────────────────────────────
  initSlideshow("hero-slides", "hero-dot", 5000);

  // ── 4. Row Sliders ──────────────────────────────────────────
  document.querySelectorAll(".row-slider").forEach((slider) => {
    const slides = slider.querySelectorAll(".row-slide");
    if (slides.length <= 1) return;

    let current = 0;
    let interval = null;

    const show = (n) => {
      slides[current].classList.remove("active");
      current = (n + slides.length) % slides.length;
      slides[current].classList.add("active");
    };

    const startAuto = () => {
      interval = setInterval(() => show(current + 1), 4000);
    };
    const stopAuto = () => clearInterval(interval);

    startAuto();

    const prevBtn = slider.querySelector(".slider-prev");
    const nextBtn = slider.querySelector(".slider-next");

    if (prevBtn)
      prevBtn.addEventListener("click", () => {
        stopAuto();
        show(current - 1);
        startAuto();
      });
    if (nextBtn)
      nextBtn.addEventListener("click", () => {
        stopAuto();
        show(current + 1);
        startAuto();
      });

    // Pause on hover
    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", startAuto);
  });

  // ── 5. FAQ Accordion ───────────────────────────────────────
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    if (!q) return;
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      // Close all
      document
        .querySelectorAll(".faq-item")
        .forEach((i) => i.classList.remove("open"));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add("open");
    });
  });

  // ── 6. Detailing Form Logic ─────────────────────────────────
  initDetailingForm();

  // ── 7. Scroll reveal ───────────────────────────────────────
  initScrollReveal();
});

/* ── Hero Slideshow Init ───────────────────────────────────── */
function initSlideshow(slidesId, dotClass, delay = 5000) {
  const container = document.getElementById(slidesId);
  if (!container) return;

  const slides = container.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll("." + dotClass);
  if (!slides.length) return;

  let current = 0;
  let timer = null;

  const show = (n) => {
    slides[current].classList.remove("active");
    if (dots[current]) dots[current].classList.remove("active");
    current = (n + slides.length) % slides.length;
    slides[current].classList.add("active");
    if (dots[current]) dots[current].classList.add("active");
  };

  const start = () => {
    timer = setInterval(() => show(current + 1), delay);
  };
  const stop = () => clearInterval(timer);

  start();

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stop();
      show(i);
      start();
    });
  });

  container.closest(".hero")?.addEventListener("mouseenter", stop);
  container.closest(".hero")?.addEventListener("mouseleave", start);
}

/* ── Detailing Form ───────────────────────────────────────── */
function initDetailingForm() {
  const form = document.getElementById("detailing-form");
  if (!form) return;

  const prices = {
    standard: { interior: 75, exterior: 75, combo: 140 },
    premium: { interior: 125, exterior: 125, combo: 230 },
  };

  let selectedTier = "standard";
  let selectedService = "interior";

  const priceDisplay = document.getElementById("selected-price");
  const tierDisplay = document.getElementById("selected-tier-label");
  const svcDisplay = document.getElementById("selected-svc-label");
  const hiddenPkg = document.getElementById("hidden-package");
  const hiddenPrice = document.getElementById("hidden-price");

  function updatePrice() {
    const price = prices[selectedTier][selectedService];
    if (priceDisplay) priceDisplay.textContent = "€" + price;
    if (tierDisplay) tierDisplay.textContent = capitalize(selectedTier);
    if (svcDisplay) svcDisplay.textContent = capitalize(selectedService);
    if (hiddenPkg)
      hiddenPkg.value = `${capitalize(selectedTier)} — ${capitalize(selectedService)}`;
    if (hiddenPrice) hiddenPrice.value = "€" + price;
  }

  // Tier tabs
  document.querySelectorAll(".pkg-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".pkg-tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      selectedTier = tab.dataset.tier;
      updatePrice();
    });
  });

  // Service options
  document.querySelectorAll(".pkg-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      document
        .querySelectorAll(".pkg-option")
        .forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
      selectedService = opt.dataset.service;
      updatePrice();
    });
  });

  updatePrice();

  // Populate Day select
  const daySelect = document.getElementById("booking-day");
  if (daySelect) {
    const today = new Date();
    const todayD = today.getDate();
    const todayM = today.getMonth(); // 0-indexed
    const todayY = today.getFullYear();
    daySelect.innerHTML = '<option value="" disabled selected>Day</option>';
    for (let d = 1; d <= 31; d++) {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      daySelect.appendChild(opt);
    }
  }

  // Populate Month select
  const monthSelect = document.getElementById("booking-month");
  if (monthSelect) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentM = new Date().getMonth();
    monthSelect.innerHTML = '<option value="" disabled selected>Month</option>';
    months.forEach((m, i) => {
      const opt = document.createElement("option");
      opt.value = i + 1;
      opt.textContent = m;
      if (i >= currentM) {
        // Highlight future months slightly (optional, just add them all)
      }
      monthSelect.appendChild(opt);
    });
  }

  // Form submit visual feedback
  form.addEventListener("submit", (e) => {
    const btn = form.querySelector(".submit-btn");
    if (btn) {
      btn.textContent = "Sending…";
      btn.style.opacity = "0.7";
    }
    // Netlify handles actual submission
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ── Scroll Reveal ────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    ".service-row, .inquire-card, .pillar, .faq-item, .stat-item",
  );
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  elements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    observer.observe(el);
  });
}
