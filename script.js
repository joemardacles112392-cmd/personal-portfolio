/* ==========================================================================
   SCRIPT.JS - Interactive Portfolio Logic for Joemar Dacles
   Features:
   1. Dark / Light Mode Switcher with LocalStorage & System Detection
   2. Responsive Mobile Navigation Drawer (Click Outside & Esc Support)
   3. Dynamic Project Filtering by Category (Clean Display Handling)
   4. Live Technical Sandbox (Counter, Accent Switcher, Greeting Generator)
   5. Interactive Contact Form with Validation & Live Error Clearing
   6. Active Nav Scrollspy (Sticky Navbar Offset & Initial Run)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------
  // 1. THEME SWITCHER (DARK / LIGHT MODE)
  // ----------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or infer from system preference
  const savedTheme = localStorage.getItem('site-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('site-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      themeToggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
  }

  // ----------------------------------------------------
  // 2. MOBILE MENU DRAWER
  // ----------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNav.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking any nav link inside drawer
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside of the drawer
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && e.target !== mobileMenuBtn) {
        mobileNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when pressing the Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----------------------------------------------------
  // 3. DYNAMIC PROJECT FILTERING
  // ----------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = (button.getAttribute('data-filter') || 'all').trim().toLowerCase();

        projectCards.forEach(card => {
          const cardCategory = (card.getAttribute('data-category') || '').trim().toLowerCase();
          
          if (filterValue === 'all' || cardCategory === filterValue || cardCategory.includes(filterValue)) {
            card.style.display = ''; // Reverts to CSS layout (grid / flex)
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ----------------------------------------------------
  // 4. TECHNICAL DEMONSTRATION SANDBOX
  // ----------------------------------------------------

  // 4A: Counter Feature
  let count = 0;
  const counterValue = document.getElementById('counterValue');
  const counterIncBtn = document.getElementById('counterIncBtn');
  const counterDecBtn = document.getElementById('counterDecBtn');
  const counterResetBtn = document.getElementById('counterResetBtn');

  if (counterIncBtn && counterDecBtn && counterResetBtn && counterValue) {
    counterIncBtn.addEventListener('click', () => {
      count++;
      updateCounter();
    });

    counterDecBtn.addEventListener('click', () => {
      count--;
      updateCounter();
    });

    counterResetBtn.addEventListener('click', () => {
      count = 0;
      updateCounter();
    });

    function updateCounter() {
      counterValue.textContent = count;
      counterValue.style.transform = 'scale(1.15)';
      setTimeout(() => {
        counterValue.style.transform = 'scale(1)';
      }, 150);
    }
  }

  // 4B: CSS Accent Color Switcher
  const colorButtons = document.querySelectorAll('.color-btn');
  colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedColor = btn.getAttribute('data-color');
      if (selectedColor) {
        document.documentElement.style.setProperty('--primary-accent', selectedColor);
        document.documentElement.style.setProperty('--primary-hover', selectedColor);
      }
    });
  });

  // 4C: Live Greeting Input
  const demoNameInput = document.getElementById('demoNameInput');
  const demoGreetingOutput = document.getElementById('demoGreetingOutput');

  if (demoNameInput && demoGreetingOutput) {
    demoNameInput.addEventListener('input', (e) => {
      const name = e.target.value.trim();
      if (name) {
        demoGreetingOutput.textContent = `Kumusta, ${name}! Salamat sa pagbisita sa aking portfolio.`;
      } else {
        demoGreetingOutput.textContent = 'Kumusta, Bisita! Welcome to this website.';
      }
    });
  }

  // ----------------------------------------------------
  // 5. CONTACT FORM VALIDATION & SUBMISSION
  // ----------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    // Tolerant queries by ID or name attribute
    const nameInput = document.getElementById('senderName') || contactForm.querySelector('[name="name"]');
    const emailInput = document.getElementById('senderEmail') || contactForm.querySelector('[name="email"]');
    const subjectInput = document.getElementById('senderSubject') || contactForm.querySelector('[name="subject"]');
    const messageInput = document.getElementById('senderMessage') || contactForm.querySelector('[name="message"]');
    const submitBtn = document.getElementById('submitBtn') || contactForm.querySelector('button[type="submit"]');

    // Live error clearing as user types
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => showError(input, false));
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (nameInput) {
        if (!nameInput.value.trim()) {
          showError(nameInput, true);
          isValid = false;
        } else {
          showError(nameInput, false);
        }
      }

      // Validate Email
      if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          showError(emailInput, true);
          isValid = false;
        } else {
          showError(emailInput, false);
        }
      }

      // Validate Subject
      if (subjectInput) {
        if (!subjectInput.value.trim()) {
          showError(subjectInput, true);
          isValid = false;
        } else {
          showError(subjectInput, false);
        }
      }

      // Validate Message
      if (messageInput) {
        if (!messageInput.value.trim()) {
          showError(messageInput, true);
          isValid = false;
        } else {
          showError(messageInput, false);
        }
      }

      if (isValid) {
        const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Ipinapadala...';
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
          contactForm.reset();
          if (formSuccessAlert) {
            formSuccessAlert.style.display = 'block';
            setTimeout(() => {
              formSuccessAlert.style.display = 'none';
            }, 6000);
          }
        }, 800);
      }
    });
  }

  function showError(inputEl, isError) {
    if (!inputEl) return;
    const group = inputEl.closest('.form-group');
    if (group) {
      if (isError) {
        group.classList.add('has-error');
      } else {
        group.classList.remove('has-error');
      }
    }
  }

  // ----------------------------------------------------
  // 6. SCROLLSPY ACTIVE NAVIGATION LINK
  // ----------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileNavLinksList = document.querySelectorAll('.mobile-nav .mobile-nav-link');

  function updateActiveNav() {
    let current = '';
    const scrollPosition = window.scrollY + 120; // 120px offset for sticky navbar

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    // Default to first section (e.g. 'home') if scrolled near the top
    if (window.scrollY < 120 && sections.length > 0) {
      current = sections[0].getAttribute('id') || 'home';
    }

    if (current) {
      desktopNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });

      mobileNavLinksList.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav(); // Run once immediately on DOM load

});