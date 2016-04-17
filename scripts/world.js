
function World (game, map)
{
	this.game = game;
	
	this.map = map;
	
	this.size = [
		this.map[0].length,
		this.map.length,
	];
	
	this.spritemap = new Array (this.size[1]);
	for(var i=0; i<this.size[0]; i++) {
		this.spritemap[i] = new Array (this.size[0]);
	}
	
	this.sprites = [];
	
	for (var y=0; y<this.map.length; y++) {
		for (var x=0; x<this.map[y].length; x++) {
			if (this.map[y][x] == "x" || this.map[y][x] == "y") {
				var pos = [x * 64, y * 64 + 6];
			}
			else {
				var pos = [x * 64, y * 64];
			}
			if (this.map[y][x] != 0) {
				var sprite = this.game.create.sprite ({
					texture: "images/tiles.png",
					pos: pos,
					tiling: [8,8],
					frame: MyGame.blockframes [this.map[y][x]],
				});
				this.sprites.push (sprite);
				this.spritemap[y][x] = sprite;
			}
		}
	}
}

MyGame.blockframes = {
	"0": 0,
	"1": 1,
	"2": 2,
	"3": 3,
	"x": 32,
	"y": 33,
};

World.prototype.draw = function ()
{
	_.each (this.sprites, function (sprite) {
		if (
			floor (sprite.pos[0]) + sprite.framesize[0] >= floor (game.camera.pos[0]) - game.size[0]/2 &&
			floor (sprite.pos[0]) - sprite.framesize[1] <= floor (game.camera.pos[0]) + game.size[0]/2 &&
			floor (sprite.pos[1]) + sprite.framesize[0] >= floor (game.camera.pos[1]) - game.size[1]/2 &&
			floor (sprite.pos[1]) - sprite.framesize[1] <= floor (game.camera.pos[1]) + game.size[1]/2
		) {
			sprite.draw ();
		}
	});
}

World.prototype.getBlock = function (point)
{
	var mapCoord = [
		floor (point[0] / 64),
		floor (point[1] / 64),
	];
	
	if (
		mapCoord[0] < 0 || mapCoord[0] > this.size[0]-1 ||
		mapCoord[1] < 0 || mapCoord[1] > this.size[1]-1
	) {
		return 0;
	}
	else {
		return this.map [mapCoord[1]][mapCoord[0]];
	}
}

World.prototype.setBlockAtPos = function (point, v)
{
	var mapCoord = [
		floor (point[0] / 64),
		floor (point[1] / 64),
	];
	
	if (
		mapCoord[0] < 0 || mapCoord[0] > this.size[0]-1 ||
		mapCoord[1] < 0 || mapCoord[1] > this.size[1]-1
	) {
		return;
	}
	else {
		this.map [mapCoord[1]][mapCoord[0]] = v;
		if (this.spritemap [mapCoord[1]][mapCoord[0]].frame) {
			this.spritemap [mapCoord[1]][mapCoord[0]].frame = MyGame.blockframes [v];
		}
	}
}

World.prototype.isPointFree = function (point)
{
	var block = this.getBlock (point);
	return block == 0 || isNaN (parseInt (block)) ||
		(block == 3 && this.game.cat.isfat);
}

