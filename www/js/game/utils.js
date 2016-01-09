/**
 * @author       Marcus Robinson <mr.marcus.l.robinson@gmail.com>
 * @copyright    2015
 */
"use strict";

var ChunkMap = window.ChunkMap || {}; // Namespace

(function() {

  /**
   * A static utility class for common methods.
   *
   */
  ChunkMap.Utils = {};

  /**
   * Seed from string
   */
  ChunkMap.Utils.createSeed = function(s) {
    if ( typeof s !== "string" ) {
      return s;
    }

    var nums = 0;
    var i = 0, l = s.length, c;
    for ( i; i < l; i++ ) {
      c = s.charCodeAt(i);
      nums += (c * (31 ^ (i-1)));
    }

    return Math.abs(nums);
  };

})();

