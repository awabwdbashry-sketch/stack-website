/* ============================================================
   STACK — main.js
   Loading, navigation, cursor, scroll reveals
   ============================================================ */

(function(){
  'use strict';

  var ALL_IMAGES = [
    'assets/images/layers/layer-01.png',
    'assets/images/layers/layer-02.png',
    'assets/images/layers/layer-03.png',
    'assets/images/layers/layer-04.png',
    'assets/images/layers/layer-05.png',
    'assets/images/layers/layer-06.png',
    'assets/images/layers/layer-07.png',
    'assets/images/layers/layer-08.png',
    'assets/images/layers/layer-09.png',
    'assets/images/layers/layer-10.png',
    'assets/images/gallery/gal-01-beef.jpg',
    'assets/images/gallery/gal-02-cheese.jpg',
    'assets/images/gallery/gal-03-ingredients.jpg',
    'assets/images/gallery/gal-04-burger.jpg',
    'assets/images/gallery/gal-05-ritual.jpg'
  ];

  var loader      = document.querySelector('.loader');
  var barFill     = document.querySelector('.loader__bar-fill');
  var pctLabel    = document.querySelector('.loader__pct');
  var body        = document.body;

  window.STACK = window.STACK || {};
  window.STACK.imageCache = {};

  function preload(){
    var total = ALL_IMAGES.length;
    var loaded = 0;

    function updateProgress(){
      var pct = Math.round((loaded / total) * 100);
      if (barFill)  barFill.style.width = pct + '%';
      if (pctLabel) pctLabel.textContent = pct + '%';
      if (loaded >= total){
        window.dispatchEvent(new CustomEvent('stack:loaded'));
        setTimeout(function(){
          if (loader) loader.classList.add('is-hidden');
          body.classList.add('is-ready');
        }, 250);
      }
    }

    ALL_IMAGES.forEach(function(src){
      var img = new Image();
      img.onload = img.onerror = function(){
        loaded++;
        window.STACK.imageCache[src] = img;
        updateProgress();
      };
      img.src = src;
    });

    updateProgress();
  }

  preload();

  /* ---------------- NAV ---------------- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  var mobileMenu = document.querySelector('.mobile-menu');

  function onScrollNav(){
    if (window.scrollY > 40){
      nav.classList.add('is-condensed');
    } else {
      nav.classList.remove('is-condensed');
    }
  }
  window.addEventListener('scroll', onScrollNav, { passive:true });
  onScrollNav();

  if (toggle){
    toggle.addEventListener('click', function(){
      nav.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
    });
    mobileMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
      });
    });
  }

  /* ---------------- HERO SCROLL BUTTON ---------------- */
  var scrollBtn = document.querySelector('.hero__scroll');
  if (scrollBtn){
    scrollBtn.addEventListener('click', function(){
      var target = document.querySelector('#build');
      if (target) target.scrollIntoView({ behavior:'smooth' });
    });
  }

  /* ---------------- GENERIC REVEAL ON VIEW ---------------- */
  var revealTargets = document.querySelectorAll('.ed-media, .ed-copy, .statement__line, .reveal');
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.28 });
    revealTargets.forEach(function(el){ io.observe(el); });
  } else {
    revealTargets.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---------------- CTA RIPPLE ---------------- */
  var cta = document.querySelector('.reveal__cta');
  if (cta){
    cta.addEventListener('click', function(e){
      var rect = cta.getBoundingClientRect();
      var ripple = document.createElement('span');
      var size = Math.max(rect.width, rect.height) * 1.6;
      ripple.className = 'reveal__cta-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top  = (e.clientY - rect.top  - size/2) + 'px';
      cta.appendChild(ripple);
      setTimeout(function(){ ripple.remove(); }, 750);
    });
  }

  /* ---------------- CUSTOM CURSOR ---------------- */
  var cursor = document.querySelector('.cursor');
  var isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  if (cursor && !isTouch){
    var cx = 0, cy = 0, tx = 0, ty = 0;

    window.addEventListener('mousemove', function(e){
      tx = e.clientX; ty = e.clientY;
      cursor.classList.add('is-active');
    });

    function raf(){
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    var buildHoverEls = document.querySelectorAll('[data-cursor="build"]');
    var openHoverEls = document.querySelectorAll('[data-cursor="open"]');

    function bindLabel(els, text){
      els.forEach(function(el){
        el.addEventListener('mouseenter', function(){
          cursor.classList.add('is-labelled');
          cursor.querySelector('.cursor__label').textContent = text;
        });
        el.addEventListener('mouseleave', function(){
          cursor.classList.remove('is-labelled');
        });
      });
    }
    bindLabel(buildHoverEls, 'BUILD');
    bindLabel(openHoverEls, 'OPEN');

    document.addEventListener('mouseleave', function(){
      cursor.classList.remove('is-active');
    });
  }

})();
