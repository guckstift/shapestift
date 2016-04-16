
function Cat (game)
{
	Sprite.call (this, game, {
		texture: game.textures ["images/cat.png"],
		tiling: [4,4],
		origin: [0.5,  0.999],
	});
	
	this.state = "standing";
	this.anitime = 0;
}

subclass (Cat, Sprite);

Cat.prototype.update = function (dt)
{
	Sprite.prototype.update.call (this, dt);
	
	if (this.state == "running") {
		this.anitime += dt;
		this.frame = 1 + (floor (this.anitime/125) % 6);
	}
	else if (this.state == "jumping") {
		this.speed[1] += 4;
		if (this.game.world.map
			[floor (this.pos[1] / 64)]
			[floor (this.pos[0] / 64)] != 0
		) {
			this.land ();
		}
	}
}

Cat.prototype.startRunRight = function ()
{
	if (this.state == "standing") {
		this.state = "running";
		this.speed = [+100, 0];
		this.scale = [+1, 1];
		this.frame = 1;
		this.anitime = 0;
	}
}

Cat.prototype.startRunLeft = function ()
{
	if (this.state == "standing") {
		this.state = "running";
		this.speed = [-100, 0];
		this.scale = [-1, 1];
		this.frame = 1;
		this.anitime = 0;
	}
}

Cat.prototype.stopRun = function ()
{
	if (this.state == "running") {
		this.state = "standing";
		this.speed = [0, 0];
		this.frame = 0;
		this.anitime = 0;
	}
}

Cat.prototype.jump = function ()
{
	if (this.state != "jumping") {
		this.state = "jumping";
		this.speed = [0, -400];
		this.frame = 0;
		this.anitime = 0;
	}
}

Cat.prototype.land = function ()
{
	if (this.state = "jumping") {
		this.state = "standing";
		this.speed = [0, 0];
		this.frame = 0;
		this.anitime = 0;
	}
}

