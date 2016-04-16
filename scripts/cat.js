
function Cat (game)
{
	Sprite.call (this, game, {
		texture: game.textures ["images/cat.png"],
		tiling: [4,4],
		origin: [0.5,  0.5],
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
}

Cat.prototype.startRunRight = function ()
{
	if (this.state != "running") {
		this.state = "running";
		this.speed = [+100, 0];
		this.scale = [+1, 1];
		this.frame = 1;
		this.anitime = 0;
	}
}

Cat.prototype.startRunLeft = function ()
{
	if (this.state != "running") {
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
		//this.scale = [1, 1];
		this.frame = 0;
		this.anitime = 0;
	}
}

