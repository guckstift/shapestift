
function World (game)
{
	this.game = game;
	
	this.map = [
		[1,1,1,0,0],
		[0,0,0,1,1],
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

