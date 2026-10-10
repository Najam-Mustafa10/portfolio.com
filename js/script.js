(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");
  const links = [...document.querySelectorAll(".nav-link")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const backToTop = document.querySelector(".back-to-top");
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  const year = document.querySelector("#year");
  const roleEl = document.querySelector("[data-role-text]");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const closeMenu = () => {
    header.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  const openMenu = () => {
    header.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  links.forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  const setActiveLink = () => {
    const fromTop = window.scrollY + 96;
    let current = "home";

    sections.forEach((section) => {
      if (section.offsetTop <= fromTop) {
        current = section.id;
      }
    });

    links.forEach((link) => {
      const href = link.getAttribute("href")?.slice(1);
      link.classList.toggle("is-active", href === current);
    });

    backToTop.classList.toggle("is-visible", window.scrollY > 400);
  };

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion && roleEl) {
    const title = "Full Stack Developer";
    let i = 0;
    roleEl.textContent = "";

    const type = () => {
      if (i <= title.length) {
        roleEl.textContent = title.slice(0, i);
        i += 1;
        window.setTimeout(type, 70);
      }
    };

    type();
  }

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.animationPlayState = "paused";
      observer.observe(el);
    });
  }

  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (prefersReducedMotion) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = (0.5 - y / rect.height) * 8;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  const showError = (name, message) => {
    const node = document.querySelector(`[data-error-for="${name}"]`);
    if (node) node.textContent = message;
  };

  const clearErrors = () => {
    document.querySelectorAll(".field-error").forEach((node) => {
      node.textContent = "";
    });
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();
    status.textContent = "";

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    };

    let valid = true;

    if (data.name.length < 2) {
      showError("name", "Please enter your name.");
      valid = false;
    }

    if (!isValidEmail(data.email)) {
      showError("email", "Please enter a valid email address.");
      valid = false;
    }

    if (data.subject.length < 3) {
      showError("subject", "Please enter a subject.");
      valid = false;
    }

    if (data.message.length < 10) {
      showError("message", "Please write a message of at least 10 characters.");
      valid = false;
    }

    if (!valid) {
      status.textContent = "Please correct the highlighted fields.";
      return;
    }

    form.reset();
    status.textContent =
      "Message validated successfully. Actual email delivery requires a backend or email service.";
  });
})();
