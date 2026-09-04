/* ============================================================
   STACK — animations.js
   Easing + linear slide-in transform helpers used by sequence.js

   Each burger layer enters along a single straight axis
   (top / left / right) and eases into its locked position.
   No rotation, no orbit, no elastic bounce — restraint is the
   whole point.
   ============================================================ */

(function(){
  'use strict';

  window.STACK = window.STACK || {};

  var easings = {
    linear:   function(t){ return t; },
    outCubic: function(t){ return 1 - Math.pow(1 - t, 3); },
    outQuart: function(t){ return 1 - Math.pow(1 - t, 4); },
    inOutSine:function(t){ return -(Math.cos(Math.PI * t) - 1) / 2; }
  };

  /**
   * Compute the transform/opacity for a layer sliding in from one side.
   *
   * t:        0 (off-stage, not yet entered) -> 1 (locked in final position)
   * dir:      'top' | 'left' | 'right'
   * distance: travel distance in px at t = 0
   *
   * The layer moves in a straight line toward its resting spot and
   * settles with a soft ease — no bounce, no spin, no drift.
   */
  function slideTransform(t, dir, distance){
    var clamped = t < 0 ? 0 : (t > 1 ? 1 : t);
    var eased = easings.outCubic(clamped);
    var remaining = 1 - eased;

    var x = 0, y = 0;
    if (dir === 'left')  x = -distance * remaining;
    if (dir === 'right') x =  distance * remaining;
    if (dir === 'top')   y = -distance * remaining;

    // reach full opacity slightly before the layer is fully locked,
    // so it never looks like it "pops" in at the very last pixel
    var opacity = eased / 0.72;
    if (opacity < 0) opacity = 0;
    if (opacity > 1) opacity = 1;

    return {
      x: x,
      y: y,
      transform: 'translate(-50%,0) translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0)',
      opacity: opacity
    };
  }

  window.STACK.easings = easings;
  window.STACK.slideTransform = slideTransform;

})();
