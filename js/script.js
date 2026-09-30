/* ============================================================
   Navatanee Golf Course & Club — Interactions
   Vanilla JavaScript, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initYear();
    initStickyHeader();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initActiveNav();
    initBackToTop();
    initNewsFilter();
    initContactForm();
  });

  /* ---------- Footer year ---------- */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Sticky header on scroll ---------- */
  function initStickyHeader() {
    var header = document.getElementById("header");
    if (!header) return;

    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile hamburger menu ---------- */
  function initMobileMenu() {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.classList.toggle("is-open", open);
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(!menu.classList.contains("is-open"));
    });

    // Close when a link is clicked
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { 
        setTimeout(() => {
          setOpen(false);
        }, 300); 
      });
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) setOpen(false);
    });

    // Reset when resizing back to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 720 && menu.classList.contains("is-open")) setOpen(false);
    });
  }

  /* ---------- Smooth scrolling for anchor links ---------- */
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (id === "#" || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // Move focus for accessibility without jumping
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ---------- Scroll reveal animations ---------- */
  function initScrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Active menu highlighting via scroll spy ---------- */
  function initActiveNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
    var sections = links
      .map(function (link) {
        var id = link.getAttribute("href");
        return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    if (!("IntersectionObserver" in window)) return;

    // Track intersection ratio for every section, then highlight only the most
    // visible one. This ensures the active state is cleared when a section
    // scrolls out of view instead of leaving a stale highlight behind.
    var visibility = {};

    function updateActive() {
      var currentId = null;
      var maxRatio = 0;
      sections.forEach(function (section) {
        var ratio = visibility[section.id] || 0;
        if (ratio > maxRatio) {
          maxRatio = ratio;
          currentId = "#" + section.id;
        }
      });

      links.forEach(function (link) {
        link.classList.toggle(
          "is-active",
          currentId !== null && link.getAttribute("href") === currentId
        );
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visibility[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });
      updateActive();
    }, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: "-20% 0px -35% 0px"
    });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------- Back to top button ---------- */
  function initBackToTop() {
    var btn = document.getElementById("toTop");
    if (!btn) return;

    function onScroll() {
      btn.classList.toggle("is-visible", window.scrollY > 500);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- News category filtering ---------- */
  function initNewsFilter() {
    var buttons = document.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll(".news-card");
    var empty = document.getElementById("newsEmpty");
    if (!buttons.length || !cards.length) return;

    function applyFilter(filter) {
      var visible = 0;
      cards.forEach(function (card) {
        var match = filter === "all" || card.getAttribute("data-category") === filter;
        card.classList.toggle("is-hidden", !match);
        if (match) visible++;
      });
      if (empty) empty.hidden = visible !== 0;
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        applyFilter(btn.getAttribute("data-filter"));
      });
    });
  }

  /* ---------- Contact form validation ---------- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    var success = document.getElementById("formSuccess");
    if (!form) return;

    var validators = {
      name: function (v) {
        if (!v.trim()) return "Please enter your full name.";
        if (v.trim().length < 2) return "Name must be at least 2 characters.";
        return "";
      },
      email: function (v) {
        if (!v.trim()) return "Please enter your email address.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return "Please enter a valid email address.";
        return "";
      },
      phone: function (v) {
        if (!v.trim()) return "Please enter your phone number.";
        if (!/^[+()\d\s-]{7,20}$/.test(v.trim())) return "Please enter a valid phone number.";
        return "";
      },
      subject: function (v) {
        if (!v.trim()) return "Please enter a subject.";
        return "";
      },
      message: function (v) {
        if (!v.trim()) return "Please enter your message.";
        if (v.trim().length < 10) return "Message must be at least 10 characters.";
        return "";
      }
    };

    function fieldWrap(input) { return input.closest(".field"); }
    function errorEl(name) { return form.querySelector('[data-error-for="' + name + '"]'); }

    function validateField(input) {
      var fn = validators[input.name];
      if (!fn) return true;
      var msg = fn(input.value);
      var wrap = fieldWrap(input);
      var err = errorEl(input.name);
      if (msg) {
        if (wrap) wrap.classList.add("is-invalid");
        if (err) err.textContent = msg;
        input.setAttribute("aria-invalid", "true");
        return false;
      }
      if (wrap) wrap.classList.remove("is-invalid");
      if (err) err.textContent = "";
      input.removeAttribute("aria-invalid");
      return true;
    }

    // Validate on blur + clear on input
    Object.keys(validators).forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;
      input.addEventListener("blur", function () { validateField(input); });
      input.addEventListener("input", function () {
        var wrap = fieldWrap(input);
        if (wrap && wrap.classList.contains("is-invalid")) validateField(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var firstInvalid = null;

      Object.keys(validators).forEach(function (name) {
        var input = form.elements[name];
        if (input && !validateField(input)) {
          valid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!valid) {
        if (success) success.hidden = true;
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Success (static site — no backend submission)
      form.reset();
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }
})();
