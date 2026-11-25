/**
 * SAMROY JHONSON SEQUEIRA - DEVELOPER PORTFOLIO
 * Modular Vanilla ES6+ Interactive Controller
 * Features:
 *   - Dark/Light Theme Switching with localStorage persistence
 *   - Mobile Drawer Navigation & Focus Trapping
 *   - Active ScrollSpy for Header Navigation Links
 *   - Project & Skill Category Filtering Tabs
 *   - Animated Skill Meters (Intersection Observer)
 *   - One-Click Email Copy to Clipboard with Feedback
 *   - Interactive Contact Form with Validation & Mailto Generator
 *   - Resume Modal Dialog with Direct Print/PDF Support
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. THEME CONTROLLER (Default: Light Theme per preferences)
  // -------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'samroy_portfolio_theme';
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle-btn');

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    // Default to Light Theme per user prompt specification
    return 'light';
  }

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (themeToggleBtn) {
      const isDark = theme === 'dark';
      themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      themeToggleBtn.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  // Initialize theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  }

  // -------------------------------------------------------------------------
  // 2. MOBILE DRAWER NAVIGATION
  // -------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    drawerBackdrop.classList.add('active');
    drawerBackdrop.setAttribute('aria-hidden', 'false');
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
    // Focus close button for accessibility
    if (closeDrawerBtn) closeDrawerBtn.focus();
  }

  function closeDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop.classList.remove('active');
    drawerBackdrop.setAttribute('aria-hidden', 'true');
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.focus();
    }
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('active');
      isOpen ? closeDrawer() : openDrawer();
    });
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // -------------------------------------------------------------------------
  // 3. STICKY NAVBAR & SCROLLSPY
  // -------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link determination
    let currentSectionId = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    desktopNavLinks.forEach((link) => {
      link.classList.remove('active');
      if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // -------------------------------------------------------------------------
  // 4. ANIMATE SKILL METERS ON SCROLL (IntersectionObserver)
  // -------------------------------------------------------------------------
  const meterBars = document.querySelectorAll('.meter-bar');

  if ('IntersectionObserver' in window) {
    const meterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            requestAnimationFrame(() => {
              setTimeout(() => {
                bar.style.width = targetWidth;
              }, 100);
            });
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.2 }
    );

    meterBars.forEach((bar) => meterObserver.observe(bar));
  }

  // -------------------------------------------------------------------------
  // 5. SKILLS CATEGORY FILTERING TABS
  // -------------------------------------------------------------------------
  const skillTabs = document.querySelectorAll('.filter-tab');
  const skillBlocks = document.querySelectorAll('.skill-category-block');

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const category = tab.getAttribute('data-category');

      skillBlocks.forEach((block) => {
        if (category === 'all' || block.getAttribute('data-category') === category) {
          block.style.display = 'block';
        } else {
          block.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 6. PROJECT FILTERING TABS
  // -------------------------------------------------------------------------
  const projectTabs = document.querySelectorAll('.project-tab');
  const projectCards = document.querySelectorAll('.project-card');

  projectTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      projectTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.split(' ').includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 7. COPY EMAIL TO CLIPBOARD
  // -------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailToCopy = 'samroysmiles@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback for older browsers
          const tempInput = document.createElement('input');
          tempInput.value = emailToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        const copyTextEl = copyEmailBtn.querySelector('.copy-text');
        copyEmailBtn.classList.add('copied');
        if (copyTextEl) copyTextEl.textContent = 'Copied!';

        setTimeout(() => {
          copyEmailBtn.classList.remove('copied');
          if (copyTextEl) copyTextEl.textContent = 'Copy';
        }, 2500);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    });
  }

  // -------------------------------------------------------------------------
  // 8. INTERACTIVE CONTACT FORM WITH VALIDATION & MAILTO LAUNCHER
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('sender-name');
  const emailInput = document.getElementById('sender-email');
  const subjectInput = document.getElementById('message-subject');
  const bodyInput = document.getElementById('message-body');
  const feedbackMsg = document.getElementById('form-feedback');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.classList.add('invalid');
        isValid = false;
      } else {
        nameInput.classList.remove('invalid');
      }

      // Validate Email
      if (!validateEmail(emailInput.value.trim())) {
        emailInput.classList.add('invalid');
        isValid = false;
      } else {
        emailInput.classList.remove('invalid');
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        subjectInput.classList.add('invalid');
        isValid = false;
      } else {
        subjectInput.classList.remove('invalid');
      }

      // Validate Message Body
      if (!bodyInput.value.trim()) {
        bodyInput.classList.add('invalid');
        isValid = false;
      } else {
        bodyInput.classList.remove('invalid');
      }

      if (!isValid) {
        if (feedbackMsg) {
          feedbackMsg.className = 'form-feedback-message error';
          feedbackMsg.textContent = 'Please fill out all required fields properly.';
        }
        return;
      }

      // Format mailto link
      const recipient = 'samroysmiles@gmail.com';
      const senderName = encodeURIComponent(nameInput.value.trim());
      const senderEmail = encodeURIComponent(emailInput.value.trim());
      const subject = encodeURIComponent(`[Portfolio Inquiry] ${subjectInput.value.trim()}`);
      const body = encodeURIComponent(
        `Hello Samroy,\n\n${bodyInput.value.trim()}\n\nFrom:\n${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}`
      );

      const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

      if (feedbackMsg) {
        feedbackMsg.className = 'form-feedback-message success';
        feedbackMsg.textContent = 'Opening your email client with your pre-filled message...';
      }

      // Launch mailto
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);
    });

    // Clear validation styling on input
    [nameInput, emailInput, subjectInput, bodyInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('invalid');
          if (feedbackMsg) {
            feedbackMsg.className = 'form-feedback-message';
            feedbackMsg.textContent = '';
          }
        });
      }
    });
  }

  // -------------------------------------------------------------------------
  // 9. RESUME MODAL DIALOG & PRINT FUNCTIONALITY
  // -------------------------------------------------------------------------
  const resumeModal = document.getElementById('resume-modal');
  const viewResumeNavBtn = document.getElementById('view-resume-nav-btn');
  const viewResumeDrawerBtn = document.getElementById('view-resume-drawer-btn');
  const heroResumeBtn = document.getElementById('hero-resume-btn');
  const closeResumeBtn = document.getElementById('close-resume-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');

  function openResumeModal() {
    if (!resumeModal) return;
    if (typeof resumeModal.showModal === 'function') {
      resumeModal.showModal();
    } else {
      resumeModal.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
    if (closeResumeBtn) closeResumeBtn.focus();
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    if (typeof resumeModal.close === 'function') {
      resumeModal.close();
    } else {
      resumeModal.removeAttribute('open');
    }
    document.body.style.overflow = '';
  }

  if (viewResumeNavBtn) {
    viewResumeNavBtn.addEventListener('click', openResumeModal);
  }
  if (viewResumeDrawerBtn) {
    viewResumeDrawerBtn.addEventListener('click', () => {
      closeDrawer();
      openResumeModal();
    });
  }
  if (heroResumeBtn) {
    heroResumeBtn.addEventListener('click', openResumeModal);
  }
  if (closeResumeBtn) {
    closeResumeBtn.addEventListener('click', closeResumeModal);
  }

  // Close modal when clicking outside on backdrop
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      const dialogDimensions = resumeModal.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        closeResumeModal();
      }
    });

    resumeModal.addEventListener('cancel', () => {
      document.body.style.overflow = '';
    });
  }

  // Trigger browser print for Resume
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // -------------------------------------------------------------------------
  // 10. CURRENT YEAR IN FOOTER
  // -------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
})();
