/* ============================================================
   STACK — sequence.js
   Scroll-scrubbed, fully reversible burger construction.

   All 10 ingredient layers live in the DOM at once, stacked in a
   shared assembly area. Scroll position maps to a continuous
   0 -> 10 progress value; layer N owns the scroll segment
   [N, N+1) and slides in from its assigned direction during that
   segment, then stays locked. Because every frame is a pure
   function of the current scroll position, reverse-scrolling
   undoes the motion automatically — nothing is “replayed”.
   ============================================================ */

(function(){
  'use strict';

  var STAGE_NAMES = [
    'القاعدة',
    'اللحم الأول',
    'الجبنة الأولى',
    'اللحم الثاني',
    'الجبنة الثانية',
    'الصوص',
    'الخس',
    'الطماطم والمخلل',
    'البصل',
    'القمة'
  ];

  // exact entrance order required by spec: TOP, RIGHT, LEFT, RIGHT, LEFT, RIGHT, LEFT, RIGHT, LEFT, TOP
  var DIRECTIONS = ['top','right','left','right','left','right','left','right','left','top'];

  var buildSection = document.querySelector('.build');
  if (!buildSection) return;

  var layers  = Array.prototype.slice.call(buildSection.querySelectorAll('.build__layer'));
  var countEl = buildSection.querySelector('#stage-current');
  var nameEl  = buildSection.querySelector('#stage-name');
  var ticks   = Array.prototype.slice.call(buildSection.querySelectorAll('.build__progress-tick'));

  var STAGE_COUNT = layers.length; // 10
  var lastStageShown = -1;
  var ticking = false;

  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

  // how far a layer travels before it starts easing in, per direction.
  // scaled to viewport so the motion reads consistently on any screen,
  // and reduced automatically on narrow (mobile) viewports.
  function travelDistance(dir){
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (dir === 'top'){
      return Math.min(h * 0.42, 420);
    }
    return Math.min(w * 0.38, 520);
  }

  function update(){
    ticking = false;

    var rect = buildSection.getBoundingClientRect();
    var scrollableHeight = buildSection.offsetHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;

    var scrolled = clamp(-rect.top, 0, scrollableHeight);
    var progress = scrolled / scrollableHeight;       // 0 -> 1 across the whole build section
    var globalIndex = progress * STAGE_COUNT;          // 0 -> 10, one full unit per layer

    layers.forEach(function(layer, j){
      var dir = DIRECTIONS[j];
      var localT = clamp(globalIndex - j, 0, 1);        // this layer's own 0->1 progress
      var result = window.STACK.slideTransform(localT, dir, travelDistance(dir));
      layer.style.transform = result.transform;
      layer.style.opacity = result.opacity;
    });

    var currentStage = clamp(Math.floor(globalIndex), 0, STAGE_COUNT - 1);
    if (progress >= 1) currentStage = STAGE_COUNT - 1;

    if (currentStage !== lastStageShown){
      lastStageShown = currentStage;
      if (countEl) countEl.textContent = String(currentStage + 1).padStart(2, '0');
      if (nameEl) nameEl.textContent = STAGE_NAMES[currentStage];
      ticks.forEach(function(tick, i){
        tick.classList.toggle('is-active', i === currentStage);
      });
    }
  }

  function onScroll(){
    if (!ticking){
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('stack:loaded', update);

  // initial paint (also covers the reduced-motion / no-scroll-yet state)
  update();

})();
