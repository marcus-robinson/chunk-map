/**
 * @author       Marcus Robinson <mr.marcus.l.robinson@gmail.com>
 * @copyright    2015
 */
"use strict";

var ChunkMap = window.ChunkMap || {}; // Namespace

(function() {

  /**
   * A static factory for creating Phase.Tiles for use by Chunks
   *
   */
  ChunkMap.TileFactory = {};


  ChunkMap.TileFactory.createSeed = function(s) {


  };

  /**
   * Generate Simplex noise for a given coordinate. This noise data is then used
   * to determine what the map should look like at the specific coordinate.
   *
   * @method ChunkMap.Map#generate
   * @param {number} cx - Chunk x index
   * @param {number} cy - Chunk y index
   * @param {number} tx - Tile x index
   * @param {number} ty - Tile y index
   * @param {number} layer - The layer of noise to generate
   * @return {number} A value between 0 and 1 representing the level of noise at this point.
   */
  ChunkMap.TileFactory.generate = function(cx, cy, tx, ty, layer) {
    layer = (typeof layer === 'undefined') ? 0 : layer;
    var d = this.generation._delta;
    var s = this.generation._float;
    var n = this.noise.snoise(
      ((((cx * ChunkMap.Map.CHUNK_TILES) + (tx))) / s) / d,
      ((((cy * ChunkMap.Map.CHUNK_TILES) + (ty))) / s) / d,
      layer);

    return n;
  };


})();



/**
 * @author       Marcus Robinson <mr.marcus.l.robinson@gmail.com>
 * @copyright    2015
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
"use strict";

var WorldSim = window.ChunkMap || {}; // Namespace

(function() {

  /**
   * The TileFactory generates a tile for a given coordinate on the map.
   *
   * @class WorldSim.TileFactory
   * @constructor
   * @param {WorldSim.Map} map - reference to the map we will be drawing tiles for.
   */
  WorldSim.TileFactory = function (map, params) {

    /**
     * @property {ChunkMap.Map} map - A reference to the owning map.
     */
    this.map = map;

    /**
     * @property {object} generation - An object of values that are used when generating simplex noise for the map.
     * @default
     */
    this.generation    = {
      min       : WorldSim.Map.DEFAULT_GEN_MIN,
      max       : WorldSim.Map.DEFAULT_GEN_MAX,
      quality   : WorldSim.Map.DEFAULT_GEN_QUAL,
      seed      : WorldSim.Map.DEFAULT_GEN_SEED,
      _delta    : -1,
      _num      : 0,
      _float    : 0.0
    };

    //populate with values from params argument
    for ( var i in params ) {
      if ( this.generation.hasOwnProperty(i) ) {
        this.generation[i] = params[i];
      }
    }
    this.generation._num   = WorldSim.Utils.createSeed(this.generation.seed);
    this.generation._float = parseFloat('0.' + Math.abs(this.generation._num));
    this.generation._delta = this.generation.quality + this.generation._float;

    /**
     * @property {ChunkMap.SimplexNoise} noise - A reference to Simplex Noise generator
     */
    this.noise = new WorldSim.SimplexNoise(this.generation._num);

    this.textureIndexByType = {
      'water' : 0,
      'sand' : 2,
      'grass' : 3,
      'stone': 1,
      'dirt': 4
    };

    var ttype   = '';
    var subtype = '';

    this.v=0;
    this.vv=0;
    this.z=0;


  };


  WorldSim.TileFactory.prototype = {

    /**
     * Generate Simplex noise for a given coordinate. This noise data is then used
     * to determine what the map should look like at the specific coordinate.
     *
     * @method ChunkMap.TileFactory#_generate
     * @param {number} cx - Chunk x index
     * @param {number} cy - Chunk y index
     * @param {number} tx - Tile x index
     * @param {number} ty - Tile y index
     * @param {number} [layer] - The layer of noise to generate
     * @return {number} A value between 0 and 1 representing the level of noise at this point.
     * @private
     */
    _generate: function(cx, cy, tx, ty, layer) {
      layer = (typeof layer === 'undefined') ? 0 : layer;
      var d = this.generation._delta;
      var s = this.generation._float;
      var n = this.noise.snoise(
        ((((cx * WorldSim.Map.CHUNK_TILES) + (tx))) / s) / d,
        ((((cy * WorldSim.Map.CHUNK_TILES) + (ty))) / s) / d,
        layer);

      return n;
    },

    /**
     * Puts a tile of the given index value at the coordinate specified.
     * If you pass `null` as the tile it will pass your call over to Tilemap.removeTile instead.
     *
     * @method ChunkMap.TileFactory#createTile
     * @param {number} chunkX - X position of the Chunk this tile will live in (given in tile units, not pixels)
     * @param {number} chunkY - Y position of the Chunk this tile will live in (given in tile units, not pixels)
     * @param {number} tileX - X position of the tile relative to the parent Chunk (given in tile units, not pixels)
     * @param {number} tileY - Y position of the tile relative to the parent Chunk (given in tile units, not pixels)
     * @param {Phaser.TilemapLayer} layer - The layer in the Tilemap data that this tile belongs to.
     * @return {Phaser.Tile} The Tile object that was created
     */
    createTile: function(chunkX, chunkY, tileX, tileY, layer) {
      this.v = this._generate(chunkX, chunkY, tileX, tileY);

      this.ttype = 'water';
      this.subtype = '';
      if ( this.v > 0 ) {
        if ( this.v <= 0.1 ) {
          this.ttype = 'sand';
        } else if ( this.v <= 0.4 ) {
          this.ttype = 'grass';
          if ( this.v >= 0.30 && this.v <= 0.35 ) {
            this.subtype = 'tree';
          }
        } else {
          this.ttype = 'stone';
        }
      }

      return new Phaser.Tile(layer, this.textureIndexByType[this.ttype], tileX, tileY, WorldSim.Map.TILE_SIZE, WorldSim.Map.TILE_SIZE)
    }

  };

  WorldSim.TileFactory.prototype.constructor = WorldSim.TileFactory;

})();
