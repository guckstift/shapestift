
function Cat (game)
{
	this.texthin = game.textures ["images/cat.png"];
	this.texfat = game.textures ["images/fatcat.png"];
	
	this.isfat = false;

	Sprite.call (this, game, {
		texture: this.texthin,
		tiling: [4,4],
		origin: [0.5,  1],
	});
	
	this.thinspeed = 300;
	this.thinjump = 900;
	this.fatspeed = 150;
	this.fatjump = 600;
	this.fallaccel = 1700;
	
	this.fatremain = 0;
	
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
			if (
				this.game.world.isPointFree ([this.pos[0]-64+27, this.pos[1]]) &&
				this.game.world.isPointFree ([this.pos[0]+64-27, this.pos[1]]) &&
				this.game.world.isPointFree ([this.pos[0], this.pos[1]])
			) {
				this.startFalling ()
			}
			break;
		case "running":
			this.anitime += dt;
			this.frame = 1 + (floor (this.anitime/125) % 6);
			//
			if (
				this.game.world.isPointFree ([this.pos[0]-64+27, this.pos[1]]) &&
				this.game.world.isPointFree ([this.pos[0]+64-27, this.pos[1]]) &&
				this.game.world.isPointFree ([this.pos[0], this.pos[1]])
			) {
				this.startFalling ()
			}
			break;
		case "jumping":
			this.accel[1] = +this.fallaccel;
			//
			if (this.speed[1] > 0) {
				this.startFalling ();
			}
			break;
		case "falling":
			this.accel[1] = +this.fallaccel;
			//
			if (! (
				this.game.world.isPointFree ([this.pos[0]-64+27, this.pos[1]]) &&
				this.game.world.isPointFree ([this.pos[0]+64-27, this.pos[1]]) &&
				this.game.world.isPointFree ([this.pos[0], this.pos[1]]) )
			) {
				this.startStanding ();
			}
			break;
		case "eating":
			this.anitime += dt;
			//
			if (this.anitime >= 500) {
				this.isfat = true;
				this.fatremain = 5 * 1000;
				this.texture = this.texfat;
				this.game.world.setBlockAtPos ([
					this.pos[0]+32*this.scale[0],
					this.pos[1]-32,
				], "y");
				this.startStanding ();
			}
			break;
	}
	
	if (this.state == "jumping" || this.state == "running") {
		this.fatremain -= dt;
		if (this.fatremain <= 0)  {
			this.isfat = false;
			this.fatremain = 0;
			this.texture = this.texthin;
		}
	} 
	
	if (this.dir == "left") {
		this.speed[0] = - (this.isfat ? this.fatspeed : this.thinspeed);
		this.scale[0] = -1;
	}
	else if (this.dir == "right") {
		this.speed[0] = + (this.isfat ? this.fatspeed : this.thinspeed);
		this.scale[0] = +1;
	}
	else if (this.dir == "middle") {
		this.speed[0] = 0;
	}
	
	//var catBox = this.bbox ();
	
	// position correction if terrain collision
	
	var pos = this.pos;
	
	Sprite.prototype.update.call (this, dt);
	
	// wall to the bottom
	while (!this.game.world.isPointFree ([this.pos[0], this.pos[1]-1])) {
		this.speed[1] = 0;
		this.pos[1] --;
	}
	
	if (this.state != "falling" && this.state != "jumping") {
		// wall to the left
		while (!this.game.world.isPointFree ([this.pos[0]-64+27, this.pos[1]-1])) {
			this.speed[0] = 0;
			this.accel[0] = 0;
			this.pos[0] ++;
		}

		// wall to the right
		while (!this.game.world.isPointFree ([this.pos[0]+64-27, this.pos[1]-1])) {
			this.speed[0] = 0;
			this.accel[0] = 0;
			this.pos[0] --;
		}
	}
		
	// wall to the top
	if (!this.game.world.isPointFree ([this.pos[0], this.pos[1]-128+49-1])) {
		this.speed[1] = 0;
		this.pos[1] ++;
	}
	
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
	this.state = "standing";
	this.frame = 0;
	this.dir = "middle";
	this.accel = [0, 0];
	this.speed = [0, 0];
	console.log (this.state)
}

Cat.prototype.startFalling = function ()
{
	this.state = "falling";
	this.frame = 8;
	console.log (this.state)
}

Cat.prototype.startRunning = function (dir)
{
	this.state = "running";
	this.frame = 1;
	this.anitime = 0;
	this.dir = dir;
	this.accel = [0, 0];
	this.speed = [0, 0];
	console.log (this.state)
}

Cat.prototype.startJumping = function ()
{
	this.state = "jumping";
	this.frame = 7;
	this.anitime = 0;
	this.speed[1] = - (this.isfat ? this.fatjump : this.thinjump);
	console.log (this.state);
}

Cat.prototype.startEating = function ()
{
	this.state = "eating";
	this.frame = 9;
	this.anitime = 0;
	console.log (this.state);
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

Cat.prototype.eat = function ()
{
	if (this.state == "standing") {
		if (this.game.world.getBlock ([
			this.pos[0]+32*this.scale[0],
			this.pos[1]-32,
		]) == "x" && !this.isfat) {
			this.startEating ();
		}
	}
}

Cat.prototype.bbox = function ()
{
	var bbox = Sprite.prototype.bbox.call (this);
	
	return [
		bbox[0] + 32,
		bbox[1] + 53,
		bbox[0] + 111,
		bbox[3],
	];
}

Cat.prototype.collision = function ()
{
	//var res = [false, false;
	var bbox = this.bbox ();
	
	//if (!this.game.world.isPointFree ([bbox[0]
}


