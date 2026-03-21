/**
 * The Hezekiah Foundation — Main JavaScript
 * Navigation, scroll behavior, form validation, animations
 */

(function () {
  'use strict';

  // ----- Donate link opens Stripe Checkout in new tab (href set in HTML)

  // ----- Mobile navigation toggle
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.querySelector('#nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.contains('is-open');
      navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close menu when clicking a link (for single-page anchor or same-page nav)
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 768) {
          navMenu.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----- Header scroll effect
  var header = document.querySelector('#site-header');
  if (header) {
    var scrollThreshold = 50;
    function updateHeaderScroll() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateHeaderScroll, { passive: true });
    updateHeaderScroll();
  }

  // ----- Our Story fade-in (Intersection Observer)
  var fadeElements = document.querySelectorAll('.our-story .fade-in');
  if (fadeElements.length && 'IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );
    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else if (fadeElements.length) {
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ----- Project videos: start playing as soon as page loads, pause when off-screen
  var projectVideos = document.querySelectorAll('.project-video');
  if (projectVideos.length) {
    function tryPlayVideo(video) {
      var p = video.play();
      if (p && typeof p.then === 'function') {
        p.catch(function (err) {
          console.warn('Video autoplay prevented:', err);
          var wrapper = video.closest('.project-video-wrapper');
          if (wrapper && !wrapper.querySelector('.video-play-overlay')) {
            var overlay = document.createElement('button');
            overlay.className = 'video-play-overlay';
            overlay.innerHTML = '<span>▶</span>';
            overlay.setAttribute('aria-label', 'Play video');
            overlay.addEventListener('click', function () {
              video.play();
              overlay.remove();
            });
            wrapper.appendChild(overlay);
          }
        });
      }
    }

    projectVideos.forEach(function (video) {
      // Start playing as soon as the page is ready (videos are on projects page)
      video.load();
      tryPlayVideo(video);

      // Also try when enough data is loaded (in case play() was too early)
      video.addEventListener('loadeddata', function () {
        if (video.paused) tryPlayVideo(video);
      }, { once: true });
      video.addEventListener('canplay', function () {
        if (video.paused) tryPlayVideo(video);
      }, { once: true });

      // Handle video errors
      video.addEventListener('error', function (e) {
        console.error('Video error:', video.src, video.error);
        var wrapper = video.closest('.project-video-wrapper');
        if (wrapper && !wrapper.querySelector('.video-error-message')) {
          var errorMsg = document.createElement('div');
          errorMsg.className = 'video-error-message';
          var errorText = 'Video format not supported in this browser.';
          if (video.error && video.error.code === 4) {
            errorText = 'Video file not found or cannot be loaded.';
          }
          errorMsg.innerHTML = '<p><strong>' + errorText + '</strong></p><p style="font-size: 0.875rem; margin-top: 0.5rem;">.MOV files work best in Safari. For Chrome/Firefox, please convert videos to MP4 format.</p>';
          wrapper.appendChild(errorMsg);
        }
      });
    });

    // Pause when scrolled out of view, resume when back in view
    if ('IntersectionObserver' in window) {
      var videoObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var video = entry.target;
            if (entry.isIntersecting) {
              tryPlayVideo(video);
            } else {
              video.pause();
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.2 }
      );
      projectVideos.forEach(function (video) {
        videoObserver.observe(video);
      });
    }
  }

  // ----- Contact form: validation + EmailJS
  // Get your Public Key, Service ID, and Template ID from https://dashboard.emailjs.com
  var EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID'
  };

  var form = document.getElementById('contact-form');
  if (form) {
    var fields = [
      { id: 'first-name', errorId: 'first-name-error', required: true, type: 'text' },
      { id: 'last-name', errorId: 'last-name-error', required: true, type: 'text' },
      { id: 'email', errorId: 'email-error', required: true, type: 'email' },
      { id: 'message', errorId: 'message-error', required: true, type: 'text' }
    ];

    function showError(input, errorEl, message) {
      input.classList.add('invalid');
      errorEl.textContent = message;
      if (errorEl) errorEl.style.display = 'block';
    }

    function clearError(input, errorEl) {
      input.classList.remove('invalid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    }

    function validateEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validateField(input, config) {
      var errorEl = document.getElementById(config.errorId);
      if (!errorEl) return true;
      var value = (input.value || '').trim();
      clearError(input, errorEl);

      if (config.required && !value) {
        showError(input, errorEl, 'This field is required.');
        return false;
      }
      if (config.type === 'email' && value && !validateEmail(value)) {
        showError(input, errorEl, 'Please enter a valid email address.');
        return false;
      }
      return true;
    }

    function showFormError(message) {
      var successEl = document.getElementById('form-success');
      if (!successEl) return;
      successEl.textContent = message;
      successEl.classList.add('visible');
      successEl.classList.add('form-error');
    }

    function showFormSuccess() {
      var successEl = document.getElementById('form-success');
      if (!successEl) return;
      successEl.textContent = 'Thank you for your message. We will get back to you as soon as we can.';
      successEl.classList.remove('form-error');
      successEl.classList.add('visible');
      successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      fields.forEach(function (config) {
        var input = document.getElementById(config.id);
        if (input && !validateField(input, config)) valid = false;
      });
      if (!valid) return;

      var successEl = document.getElementById('form-success');
      var submitBtn = form.querySelector('button[type="submit"]');
      var firstName = document.getElementById('first-name').value.trim();
      var lastName = document.getElementById('last-name').value.trim();
      var email = document.getElementById('email').value.trim();
      var message = document.getElementById('message').value.trim();

      if (typeof emailjs === 'undefined') {
        showFormError('Email service is not configured. Please try again later or email us directly.');
        return;
      }

      if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY' || !EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId) {
        showFormError('Email is not set up yet. Please email us at thehezekiahfoundation@gmail.com');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      successEl.classList.remove('visible');

      var templateParams = {
        first_name: firstName,
        last_name: lastName,
        from_name: firstName + ' ' + lastName,
        email: email,
        reply_to: email,
        message: message
      };

      emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams, { publicKey: EMAILJS_CONFIG.publicKey })
        .then(function () {
          showFormSuccess();
          form.reset();
          fields.forEach(function (config) {
            var input = document.getElementById(config.id);
            var errorEl = document.getElementById(config.errorId);
            if (input && errorEl) clearError(input, errorEl);
          });
        })
        .catch(function (err) {
          console.error('EmailJS error:', err);
          showFormError('Something went wrong. Please try again or email us at thehezekiahfoundation@gmail.com');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send';
          }
        });
    });

    // Clear errors on input
    fields.forEach(function (config) {
      var input = document.getElementById(config.id);
      var errorEl = document.getElementById(config.errorId);
      if (input && errorEl) {
        input.addEventListener('input', function () {
          validateField(input, config);
        });
        input.addEventListener('blur', function () {
          if (input.value.trim()) validateField(input, config);
        });
      }
    });
  }
})();
