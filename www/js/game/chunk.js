/**
 * @author       Marcus Robinson <mr.marcus.l.robinson@gmail.com>
 * @copyright    2015
 */
"use strict";

var ChunkMap = window.ChunkMap || {}; // Namespace

(function() {

/**
 * A Chunk is a subset of tiles used by WorldSim.Map. A Chunk is a part of the map, containing many WorldSim.ChunkTiles.
 * It has a fixed size and is used to load part of a possibly infinite WorldSim.Map.
 *
 * It maintains a Phaser.Tilemap and a
 * Phaser.TilemapLayer in order to draw its set of tiles.
 *
 * @class ChunkMap.Chunk
 * @constructor
 * @param {Phaser.Game} game - Game reference to the currently running game.
 * @param {ChunkMap.Map} map - Map reference to the owning map.
 * @param {string} tileset - The texture name of the tileset to use when rendering this chunk - TODO - swap this for a tile factory
 * @param {number} chunkX - Not being used at the moment, will be when Phaser supports multiple camera
 * @param {number} chunkY - Position of the camera on the X axis
 */
ChunkMap.Chunk = function (game, map, tileset, chunkX, chunkY) {

  /**
  * @property {Phaser.Game} game - A reference to the currently running Game.
  */
  this.game = game;

  /**
  * @property {Phaser.World} world - A reference to the game world.
  */
  this.world = game.world;

  /**
  * @property {ChunkMap.Map} map - A reference to the owning map.
  */
  this.map = map;

  /**
  * @property {number} x - The x index of this chunk.
  */
  this.x = chunkX;

  /**
  * @property {number} y - The y index of this chunk.
  */
  this.y = chunkY;

  /**
  * @property {Phaser.Tilemap} tileMap - A reference to the tileMap that manages this chunk's tiles.
  */
  this.tileMap = game.add.tilemap();

  this.tileset = tileset;

  this.tileMapLayer = null;


  this._create();
};


ChunkMap.Chunk.prototype = {

    /**
     * Create the Phaser.TilemapLayer and populate with this chunk's tiles.
     * @method ChunkMap.Chunk#_create
     * @private
     */
  _create: function() {
    var chunkX      = this.x;
    var chunkY      = this.y;

    var startingXPos = ChunkMap.Map.CHUNK_SIZE * chunkX;
    var startingYPos = ChunkMap.Map.CHUNK_SIZE * chunkY;

    this.tileMap.addTilesetImage(this.tileset);
    this.tileMapLayer = this.tileMap.create("tilemap", ChunkMap.Map.CHUNK_TILES, ChunkMap.Map.CHUNK_TILES, ChunkMap.Map.TILE_SIZE, ChunkMap.Map.TILE_SIZE);
    this.tileMapLayer.fixedToCamera = false;
    this.tileMapLayer.scrollFactorX = 0;
    this.tileMapLayer.scrollFactorY = 0;
    this.tileMapLayer.position.set(startingXPos, startingYPos);

    this.tileMapLayer.inputEnabled = true;

    var self = this;
    this.tileMapLayer.events.onInputDown.add(function(sprite, pointer){
      var chunkIndex = self.map.getChunkIndexForCoordinate(pointer.worldX, pointer.worldY);
      console.log("digging at chunk:", chunkIndex, "with rect", self.rect);
    }, this.tileMapLayer);

    var tile;
    for(var i = 0; i < ChunkMap.Map.CHUNK_TILES; i++){
      for(var j = 0; j < ChunkMap.Map.CHUNK_TILES; j++){
        tile = this.map.tileFactory.createTile(chunkX, chunkY, i, j, this.tileMapLayer);
        this.tileMap.putTile(tile, tile.x, tile.y);
      }
    }

    this.tileMapLayer.resize(ChunkMap.Map.CHUNK_SIZE, ChunkMap.Map.CHUNK_SIZE);
  },

  destroy: function() {
    this.tileMap.destroy();
    this.tileMapLayer.destroy();
    this.tileMap = null;
    this.tileMapLayer = null;
    this.map = null;
    this.game = null;
  },

  getTile: function(x, y) {
    return null; //todo
  }

};

ChunkMap.Chunk.prototype.constructor = ChunkMap.Chunk;

/**
* @name ChunkMap.Chunk#rect
* @property {Phaser.Rectangle} rect - The rectangle occupied by this Chunk.
* @readonly
*/
Object.defineProperty(ChunkMap.Chunk.prototype, "rect", {

    get: function () {

        return new Phaser.Rectangle((this.x * ChunkMap.Map.CHUNK_SIZE), (this.y * ChunkMap.Map.CHUNK_SIZE), ChunkMap.Map.CHUNK_SIZE, ChunkMap.Map.CHUNK_SIZE);

    }

});

})();
