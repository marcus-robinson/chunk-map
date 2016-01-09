/**
 * @author       Marcus Robinson <mr.marcus.l.robinson@gmail.com>
 * @copyright    2015
 */
"use strict";

var ChunkMap = window.ChunkMap || {}; // Namespace

(function() {

  /**
   * The Engine handles the 4 main Phaser events: preload, create, update and render
   * and it creates the map that
   *
   * @class ChunkMap.Engine
   * @constructor
   * @param {number} canvasWidth - The width of the area we will render into.
   * @param {number} canvasHeight - The height of the area we will render into.
   * @param {string} dom - The name of the DOM element we will render into.
   */
  ChunkMap.Engine = function (canvasWidth, canvasHeight, dom) {

    /**
     * @property {Phaser.Game} game - A reference to the currently running Game.
     */
    this.game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.AUTO, dom, {preload: this._onPreload, create: this._onCreate, update: this._onUpdate, render: this._onRender}, false, false);
    ChunkMap.game = this.game;

    /**
     * @property {ChunkMap.Map} map - A reference to the chunked map
     */
    this.map = null;
  };


  ChunkMap.Engine.prototype = {

    /**
     * Destroy the simulation.
     * @method ChunkMap.Engine#destroy
     */
    destroy: function() {
      this.game.destroy();
    },

    /**
     * Handler method for Phaser's preload event
     * @method ChunkMap.Engine#_onPreload
     * @private
     */
    _onPreload: function() {
      ChunkMap.game.time.advancedTiming = true;
      ChunkMap.game.load.image('terrain', 'img/game/terrain.png');
    },

    /**
     * Handler method for Phaser's create event
     * @method ChunkMap.Engine#_onCreate
     * @private
     */
    _onCreate: function() {
      ChunkMap.game.world.setBounds(0, 0, ChunkMap.Map.WORLD_SIZE, ChunkMap.Map.WORLD_SIZE);
      ChunkMap.game.stage.backgroundColor = "#000000";

      //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
      //game.stage.disableVisibilityChange = true;

      this.map = new ChunkMap.Map(this.game, {});
      this.map.draw(ChunkMap.game.camera.x, ChunkMap.game.camera.y);
    },

    /**
     * Handler method for Phaser's update event
     * @method ChunkMap.Engine#_onUpdate
     * @private
     */
    _onUpdate: function() {
      if (ChunkMap.game.input.activePointer.isDown) {

        if (ChunkMap.game.origDragPoint) {
          // move the camera by the amount the mouse has moved since last update
          var xChange = ChunkMap.game.origDragPoint.x - ChunkMap.game.input.activePointer.position.x;
          var yChange = ChunkMap.game.origDragPoint.y - ChunkMap.game.input.activePointer.position.y;
          ChunkMap.game.camera.x += xChange;
          ChunkMap.game.camera.y += yChange;
        }

        // set new drag origin to current position
        ChunkMap.game.origDragPoint = ChunkMap.game.input.activePointer.position.clone();
        this.map.draw(ChunkMap.game.camera.x, ChunkMap.game.camera.y);
      }
      else {
        ChunkMap.game.origDragPoint = null;
      }
    },

    /**
     * Handler method for Phaser's Render event
     * @method ChunkMap.Engine#_onRender
     * @private
     */
    _onRender: function()
    {
      ChunkMap.game.debug.text(ChunkMap.game.time.fps || '--', 2, 14, "#00ff00");
    }
  };

  ChunkMap.Engine.prototype.constructor = ChunkMap.Engine;

})();
