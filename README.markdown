ChunkMap
==========

![ChunkMap](/docs/images/background.png "ChunkMap")

ChunkMap is a JavaScript implementation of a chunked 2D tilemap using the [Phaser](http://www.phaser.io/) game engine. 
The map is procedurally generated using Simplex noise and only the chunks of map neighbouring the camera are rendered, allowing 
the creation of potentially infinite maps that perform well. Phaser doesn't support infinite World bounds, so this implementation
has a fixed world size of 8192x8192.


Building and Running
--------

ChunkMap requires Bower and an HTTP server. Installation of these dependencies is via npm. If you don't have npm yet:

`curl https://npmjs.org/install.sh | sh`

Run these commands in the project root directory

`npm install bower -g`

`bower install`

`npm install http-server -g`

`http-server www`

Now you can view the tilemap:

* http://localhost:8080/index.html
* Click and drag the map to look around

TODO
--------
* Performance improvements


Additional Notes
--------
ChunkMap uses the awesome [Voxel pack](http://kenney.nl/assets/voxel-pack) by Kenney. 
ChunkMap takes plenty of inspiration from Anders Evenrud's [Tile Game](https://github.com/andersevenrud/TileGame).
