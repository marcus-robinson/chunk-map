ChunkMap
==========

![ChunkMap](/docs/images/background.png "ChunkMap")

ChunkMap is a JavaScript implementation of a chunked 2D tilemap using the [Phaser](http://www.phaser.io/) game engine.
The map is procedurally generated using Simplex noise and only the chunks of map neighbouring the camera are rendered, allowing the creation of potentially infinite maps that perform well. Phaser doesn't support infinite World bounds, so this implementation has a fixed world size of 8192x8192.


Building and Running
--------

Installation requires [npm](https://www.npmjs.com/).

Browsers have a lot of security issues when the `file` protocol is used. To make life easier,  ChunkMap uses the simple HTTP server [http-server](https://www.npmjs.com/package/http-server).

`npm install` in the project's root directory.
_http-server_ is automatically started after install.

If you've already used `npm install`, running `npm start` will launch _http-server_.

Now you can view the tilemap:

* http://localhost:8080
* Click and drag the map to look around

TODO
--------
* Performance improvements


Additional Notes
--------
ChunkMap uses the awesome [Voxel pack](http://kenney.nl/assets/voxel-pack) by Kenney.
ChunkMap takes plenty of inspiration from Anders Evenrud's [Tile Game](https://github.com/andersevenrud/TileGame).
