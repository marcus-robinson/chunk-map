/**
 * @author       Marcus Robinson <mr.marcus.l.robinson@gmail.com>
 * @copyright    2015
 */
"use strict";

var ChunkMap = window.ChunkMap || {}; // Namespace

(function() {

/**
 * A WorldSim.Map is an enormous procedurally generated map. It maintains a collection of WorldSim.Chunks and will
 * create/destroy these chunks as the player moves around the map in order to minimise the amount
 * of memory used by the game. This allows for potentially infinite maps, but at the moment a size must be defined.
 *
 * @class ChunkMap.Map
 * @constructor
 * @param {Phaser.Game} game - Game reference to the currently running game.
 * @param {number} id - Not being used at the moment, will be when Phaser supports multiple camera
 * @param {number} x - Position of the camera on the X axis
 * @param {number} y - Position of the camera on the Y axis
 * @param {number} width - The width of the view rectangle
 * @param {number} height - The height of the view rectangle
 */
ChunkMap.Map = function (game, params) {

  /**
   * @property {Phaser.Game} game - A reference to the currently running Game.
   */
  this.game = game;

  /**
   * @property {Phaser.World} world - A reference to the game world.
   */
  this.world = game.world;

  /**
   * @property {object} _chunkCache - A cache containing all chunks currently being rendered by the map.
   * @private
   */
  this._chunkCache = {};

  /**
   * @property {ChunkMap.TileFactory} tileFactory - A factory to create tiles. This is passed to each chunk and used to generate tiles.
   */
  this.tileFactory = new ChunkMap.TileFactory(this, params);

  console.group('ChunkMap::Map()', 'New Map instance created.');
  console.log('World', this.generation);
  console.groupEnd();
};

/**
 *  World size is the length of one edge of the map.
 * @constant
 * @type {number}
 */
ChunkMap.Map.WORLD_SIZE        = 8192;//px

/**
 * A world is composed of chunks with this size. This value should be equal to or 
 * larger than the width of the game canvas.
 * @constant
 * @type {number}
 */
ChunkMap.Map.CHUNK_SIZE        = 1024;//px -

/**
 * A chunk is composed of tiles with this size
 * @constant
 * @type {number}
 */
ChunkMap.Map.TILE_SIZE         = 32//px;

/**
 * Number of chunks along the edge of the map
 * @constant
 * @type {number}
 */
ChunkMap.Map.WORLD_CHUNKS      = ChunkMap.Map.WORLD_SIZE / ChunkMap.Map.CHUNK_SIZE;

/**
 * Number of tiles along the edge of a chunk
 * @constant
 * @type {number}
 */
ChunkMap.Map.CHUNK_TILES       = ChunkMap.Map.CHUNK_SIZE / ChunkMap.Map.TILE_SIZE;

/**
 * Number of tiles along the edge of the map
 * @constant
 * @type {number}
 */
ChunkMap.Map.WORLD_TILES       = ChunkMap.Map.WORLD_CHUNKS * ChunkMap.Map.CHUNK_TILES;

/**
 * Default values used for generating Simplex Noise
 */
ChunkMap.Map.DEFAULT_GEN_MIN   = 0;
ChunkMap.Map.DEFAULT_GEN_MAX   = 32;
ChunkMap.Map.DEFAULT_GEN_SEED  = "default";
ChunkMap.Map.DEFAULT_GEN_QUAL  = 128.0;

ChunkMap.Map.prototype = {

  /**
   * Render out the relevant chunks for the given camera coordinates.
   * Depending on the camera's position, neighbouring chunks are loaded and all other chunks are unloaded.
   *
   * @method ChunkMap.Map#draw
   * @param {number} cameraX - Camera's x coordinate in pixels
   * @param {number} cameraY - Camera's y coordinate in pixels
   */
  draw: function(cameraX, cameraY) {
    var currentChunkIndex = this.getChunkIndexForCoordinate(cameraX, cameraY);
    var x = currentChunkIndex.x;
    var y = currentChunkIndex.y;

    //!!
    //TODO - improve performance by getting currentChunkIndex and rendering/destroying chunks without iterating through
    //the entire map. Since map could be near infinite, we can't assume we can iterate it. This only works because we have a small map.
    //!!

    //loop through all chunks and destroy or render based on if they are a neighbour or not
    for(var i = 0; i <= ChunkMap.Map.WORLD_CHUNKS; i++){
      for(var j = 0; j <= ChunkMap.Map.WORLD_CHUNKS; j++){

        if( (i == x-1 || i==x || i==x+1) &&
          (j == y-1 || j==y || j==y+1)) {
          this.renderChunk(i, j);
        } else {
          this.destroyChunk(i, j);
        }
      }
    }
  },

  /**
   * Destroy a specific ChunkMap.Chunk
   *
   * @method ChunkMap.Map#destroyChunk
   * @param {number} chunkX - The x index of the ChunkMap.Chunk to destroy
   * @param {number} chunkY - The y index of the ChunkMap.Chunk to destroy
   */
  destroyChunk: function(chunkX, chunkY) {
    //destroy the chunk!
    var id = this._hashPair(chunkX, chunkY);
    var chunk = this._chunkCache[id];

    if(chunk) {
      console.log("ChunkMap.Map#destroyChunk", "destroying chunk:", id, "with index:", chunkX, chunkY);
      chunk.destroy();
      delete this._chunkCache[id];
    }
  },

  /**
   * Render a specific ChunkMap.Chunk
   *
   * @method ChunkMap.Map#renderChunk
   * @param {number} chunkX - The x index of the ChunkMap.Chunk to render
   * @param {number} chunkY - The y index of the ChunkMap.Chunk to render
   */
  renderChunk: function(chunkX, chunkY) {
    if(chunkX < 0 || chunkY < 0 || chunkX >= ChunkMap.Map.WORLD_CHUNKS || chunkY >= ChunkMap.Map.WORLD_CHUNKS)
      return;

    var id = this._hashPair(chunkX, chunkY);

    if(this._chunkCache[id])
      return;

    console.log("ChunkMap.Map#renderChunk", "creating chunk:", id, "with index:", chunkX, chunkY);

    this._chunkCache[id] = new ChunkMap.Chunk(this.game, this, 'terrain', chunkX, chunkY);
  },


  /**
   * Generate a unique Id for a given pair of numbers.
   * @method ChunkMap.Map#_hashPair
   * @private
   * @param {number} x - The x value of the pair to hash
   * @param {number} y - The y value of the pair to hash
   * @return {number} a number unique to the two passed params
   */
    _hashPair: function(x, y) {
      return (y << 16) ^ x; //((x + y)*(x + y + 1)/2) + y;
    },

    /**
     * Get a chunk's index based on a tile's world coordinates.
     * @method ChunkMap.Map#_getChunkIndexForTileCoordinate
     * @param {number} x - The world x coordinate of the tile in pixels
     * @param {number} y - The world y coordinate of the tile in pixels
     */
    getChunkIndexForCoordinate: function(x, y){
      
      //Get Tile Index Relative To World For the Coordinates.
      y = y<0 ? 0 : y;
      x = x<0 ? 0 : x;
      var tileX = Math.floor(x/ChunkMap.Map.TILE_SIZE);
      var tileY = Math.floor(y/ChunkMap.Map.TILE_SIZE);
      
      //Get Chunk Index For Tile Index.
      var chunkX = Math.floor(tileX / ChunkMap.Map.CHUNK_TILES);
      var chunkY = Math.floor(tileY / ChunkMap.Map.CHUNK_TILES);
      return {"x": chunkX, "y": chunkY};      
    }
};

ChunkMap.Map.prototype.constructor = ChunkMap.Map;

})();
