
function Cat (game)
{
	Sprite.call (this, game, {
		texture: game.textures ["images/fatcat.png"],
		tiling: [4,4],
		origin: [0.5,  1],
	});
	
	this.startStanding ();
}

subclass (Cat, Sprite);

Cat.prototype.update = function (dt)
{	
	switch (this.state) {
		case "standing":
			this.accel = [0, 0];
			this.speed = [0, 0];
			//
			if (this.game.world.getBlock ([this.pos[0], this.pos[1]]) == 0) {
				this.startFalling ()
			}
			break;
		case "running":
			this.anitime += dt;
			this.frame = 1 + (floor (this.anitime/125) % 6);
			//
			if (this.game.world.getBlock ([this.pos[0], this.pos[1]]) == 0) {
				this.startFalling ()
			}
			break;
		case "jumping":
			this.accel[1] = +800;
			//
			if (this.speed[1] > 0) {
				this.startFalling ();
			}
			break;
		case "falling":
			this.accel[1] = +800;
			//
			if (this.game.world.getBlock ([this.pos[0], this.pos[1]]) != 0) {
				this.startStanding ();
			}
			break;
	}
	
	if (this.dir == "left") {
		this.speed[0] = -200;
		this.scale[0] = -1;
	}
	else if (this.dir == "right") {
		this.speed[0] = +200;
		this.scale[0] = +1;
	}
	else if (this.dir == "middle") {
		this.speed[0] = 0;
	}
	
	//var catBox = this.bbox ();
	
	// position correction if terrain collision
	
	// wall to the left
	if (this.game.world.getBlock ([this.pos[0]-64+27, this.pos[1]-1]) != 0) {
		this.speed[0] = 0;//+ abs (this.speed[0]);
		this.pos[0] ++;
	}
	
	// wall to the right
	if (this.game.world.getBlock ([this.pos[0]+64-27, this.pos[1]-1]) != 0) {
		this.speed[0] = 0;//- abs (this.speed[0]);
		this.pos[0] --;
	}
	
	// wall to the top
	if (this.game.world.getBlock ([this.pos[0], this.pos[1]-128+49-1]) != 0) {
		this.pos[1] ++;
	}
	
	// wall to the bottom
	if (this.game.world.getBlock ([this.pos[0], this.pos[1]-1]) != 0) {
		this.pos[1] --;
	}
	
	Sprite.prototype.update.call (this, dt);
	
	/*
	if (this.state == "running") {
		this.anitime += dt;
		this.frame = 1 + (floor (this.anitime/125) % 6);
	}
	else if (this.state == "jumping") {
		this.speed[1] += 1000 * dt / 1000;
		if (this.speed[1] > 0) {
			this.startFalling ();
		}
	}
	else if (this.state == "falling") {
		this.speed[1] += 1000 * dt / 1000;
	}
	*/
}

Cat.prototype.startStanding = function ()
{
	console.log ("stand")
	this.state = "standing";
	this.frame = 0;
}

Cat.prototype.startFalling = function ()
{
	console.log ("fall")
	this.state = "falling";
	this.frame = 8;
}

Cat.prototype.startRunning = function (dir)
{
	console.log ("run")
	this.state = "running";
	this.frame = 1;
	this.anitime = 0;
	this.dir = dir;
}

Cat.prototype.startJumping = function ()
{
	console.log ("jump");
	this.state = "jumping";
	this.frame = 7;
	this.anitime = 0;
	this.speed[1] = -500;
}

Cat.prototype.run = function (dir)
{
	this.dir = dir;
	
	if (this.state == "standing") {
		this.startRunning (dir);
	}
}

Cat.prototype.stopRun = function ()
{
	this.dir = "middle";
	
	if (this.state == "running") {
		this.startStanding ();
	}
}

Cat.prototype.jump = function ()
{
	if (this.state == "standing" || this.state == "running") {
		this.startJumping ();
	}
}

/*
Cat.prototype.startStanding = function ()
{
	this.state = "standing";
	this.anitime = 0;
}

Cat.prototype.startRunning = function (dir)
{
	dir = dir || "left";
	
	if (this.state != "running") {
		this.state = "running";
		this.frame = 1;
		this.anitime = 0;
		if (dir == "left") {
			this.speed[0] = -200;
			this.scale = [-1, 1];
		}
		else if (dir == "right") {
			this.speed[0] = +200;
			this.scale = [+1, 1];
		}
		console.log ("run");
	}
}

Cat.prototype.stopRunning = function ()
{
	if (this.state == "running") {
		this.state = "standing";
		this.speed[0] = 0;
		this.frame = 0;
		this.anitime = 0;
		console.log ("stop");
	}
	else if (this.state == "jumping" || this.state == "falling") {
		this.speed[0] = 0;
		console.log ("stop in air");
	}
}

Cat.prototype.startJumping = function ()
{
	if (this.state == "standing" || this.state == "running") {
		this.state = "jumping";
		this.speed[1] = -600;
		this.frame = 7;
		this.anitime = 0;
		console.log ("jump");
	}
}

Cat.prototype.startFalling = function ()
{
	if (this.state != "falling") {
		this.state = "falling";
		this.frame = 8;
		this.anitime = 0;
		console.log ("fall");
	}
}

Cat.prototype.land = function ()
{
	if (this.state == "falling") {
		this.state = "standing";
		this.speed = [0, 0];
		this.frame = 0;
		this.anitime = 0;
		console.log ("land");
	}
}
*/

