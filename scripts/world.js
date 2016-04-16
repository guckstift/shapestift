
function World (game)
{
	this.game = game;
	
	this.map = [
		[1,1,1,0,0,0,0,0,0,0],
		[1,1,1,0,0,0,0,0,0,0],
		[1,1,1,1,0,0,0,0,0,0],
		[1,1,1,0,1,0,0,1,1,1],
		[1,1,1,0,0,1,0,1,0,0],
		[1,1,1,1,1,1,1,1,0,0],
		[1,1,1,0,0,0,0,0,0,1],
		[1,1,1,0,0,0,0,0,0,1],
	];
	
	this.size = [
		this.map[0].length,
		this.map.length,
	];
	
	this.sprites = [];
	
	for (var y=0; y<this.map.length; y++) {
		for (var x=0; x<this.map[y].length; x++) {
			if (this.map[y][x] == 1) {
				this.sprites.push (this.game.create.sprite ({
					texture: "images/soil.png",
					pos: [x * 64, y * 64],
				}));
			}
		}
	}
}

World.prototype.draw = function ()
{
	_.each (this.sprites, function (sprite) {
		sprite.draw ();
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

World.prototype.isPointFree = function (point)
{
	var mapCoord = [
		clamp (0, this.size[0]-1, floor (point[0] / 64)),
		clamp (0, this.size[1]-1, floor (point[1] / 64)),
	];
	return this.map [mapCoord[1]][mapCoord[0]] == 0;
}

/*World.prototype.isBoxFree = function (box)
{
}*/

