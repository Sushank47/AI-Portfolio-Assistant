/**
 * Main Application Interactive Controller
 * Billa Komal Sushank - Interactive Business Card
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initTypewriterEffect();
  renderProjectCards();
  initMobileMenu();
});

/* 1. Navbar Glassmorphism Scroll Effect */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* 2. Typewriter Effect for Hero Headline */
function initTypewriterEffect() {
  const target = document.getElementById('typewriter-text');
  if (!target || typeof CONFIG === 'undefined' || !CONFIG.heroTypewriterTitles) return;

  const titles = CONFIG.heroTypewriterTitles;
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseTime = 2000;

  function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      target.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
    } else {
      target.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      isDeleting = true;
      setTimeout(type, pauseTime);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      setTimeout(type, 300);
    } else {
      setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
    }
  }

  type();
}

/* 3. Render 6 Featured Projects */
function renderProjectCards() {
  const container = document.getElementById('projects-grid');
  if (!container || typeof PROJECTS === 'undefined') return;

  container.innerHTML = '';

  PROJECTS.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card glass-panel';

    const tagsHtml = project.tags.map(tag => `<span class="badge">${tag}</span>`).join('');

    card.innerHTML = `
      <div class="project-img-wrapper">
        <img src="${project.image}" alt="${project.title}" loading="lazy" class="project-img" />
        <div class="project-category">${project.category}</div>
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.description}</p>
        <div class="project-tags">${tagsHtml}</div>
        
        <div class="project-actions">
          <a href="${project.live}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            Live Demo
          </a>
          <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
          <button type="button" class="btn btn-ai btn-sm trigger-ai-chat" data-ai-prompt="${project.aiPrompt}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Ask AI
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

/* 4. Mobile Hamburger Navigation Toggle */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    // Close menu when clicking links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }
}
