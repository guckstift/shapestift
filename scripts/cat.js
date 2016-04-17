
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
	
	/*
	this.thinspeed = 300;
	this.thinjump = 900;
	this.fatspeed = 150;
	this.fatjump = 600;
	this.fallaccel = 1700;
	this.fatremain = 0;
	*/
	
	this.fallspeed = 8;
	
	this.thinspeed = 4;
	this.fatspeed = 2;
	this.thinjump = 32;
	this.fatjump = 16;
	
	this.isfat = false;
	this.fatremain = 0;
	
	this.startStanding ();
	this.goThin ();
}

subclass (Cat, Sprite);

Cat.prototype.update = function (dt)
{
	if (game.keymap [game.ARROWLEFT]) {
		this.run ("left");
	}
	else if (game.keymap [game.ARROWRIGHT]) {
		this.run ("right");
	}
	else {
		this.stopRun ();
	}
	
	if (game.keymap [game.ARROWDOWN]) {
		this.eat ();
	}
	
	if (game.keymap [game.ARROWUP] || game.keymap [game.SPACE]) {
		this.jump ();
	}
	
	switch (this.state) {
		case "standing":
			this.speed[0] = 0;
			this.speed[1] = 0;
			break;
		case "running":
			this.speed[0] = this.dir == "right" ? +this.tfspeed : this.dir == "left" ? -this.tfspeed : 0;
			this.frame += 0.125;
			this.fatremain -= 1;
			if (this.frame > 6) this.frame = 1;
			break;
		case "jumping":
			this.speed[0] = this.dir == "right" ? +this.tfspeed : this.dir == "left" ? -this.tfspeed : 0;
			this.speed[1] = -this.fallspeed;
			this.anitime += 1;
			this.fatremain -= 1;
			if (this.anitime > this.tfjump) this.startFalling ();
			break;
		case "falling":
			this.speed[0] = this.dir == "right" ? +this.tfspeed : this.dir == "left" ? -this.tfspeed : 0;
			this.speed[1] = +this.fallspeed;
			this.anitime += 1;
			break;
		case "eating":
			this.anitime += 1;
			if (this.anitime >= 32) {
				this.goFat ();
				this.game.world.setBlockAtPos ([
					this.pos[0]+32*this.scale[0],
					this.pos[1]-32,
				], "y");
				this.startStanding ();
			}
			break;
	}
	
	if (this.fatremain <= 0)  {
		this.goThin ();
	}
	
	var bbox = this.bbox ();
	
	if (
		game.world.isPointFree ([bbox[0] + 1, bbox[3]]) &&
		game.world.isPointFree ([bbox[2] - 1, bbox[3]])
	) {
		if (this.state == "standing" || this.state == "running") {
			this.startFalling ();
			this.speed[1] = +this.fallspeed;
		}
	}
	else {
		if (this.state == "falling") {
			this.startStanding ();
			this.speed[1] = 0;
		}
	}
	
	if (
		(
			this.scale[0] > 0 &&
			game.world.isPointFree ([bbox[2] + 1, bbox[3] - 1]) == false
		) ||
		(
			this.scale[0] < 0 &&
			game.world.isPointFree ([bbox[0] - 1, bbox[3] - 1]) == false
		)
	) {
		this.speed[0] = 0;
	}
	
	this.pos[0] += this.speed[0];
	this.pos[1] += this.speed[1];
	
	/*
	var col = this.collision ();
	
	switch (this.state) {
		case "standing":
			this.accel = [0, 0];
			this.speed = [0, 0];
			//
			if ((col & 0b1100) == 0) {
				this.startFalling ()
			}
			break;
		case "running":
			this.anitime += dt;
			this.frame = 1 + (floor (this.anitime/125) % 6);
			//
			if ((col & 0b1100) == 0) {
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
			if (col & 0b1100) {
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
	
	/*
	while (col) {
		var col = this.collision ();
		if ( (col&Cat.LB) ) {
			this.pos[0] ++;
			this.pos[1] --;
		}
		var col = this.collision ();
		if ( (col&Cat.RB) ) {
			this.pos[0] --;
			this.pos[1] --;
		}
		var col = this.collision ();
		if ( (col&Cat.LT) ) {
			this.pos[0] ++;
			this.pos[1] ++;
		}
		var col = this.collision ();
		if ( (col&Cat.RT) ) {
			this.pos[0] --;
			this.pos[1] ++;
		}
	}
	* /
	
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
	*/
}

Cat.prototype.startStanding = function ()
{
	if (this.state == "standing") return;
	this.state = "standing";
	this.frame = 0;
	this.dir = "middle";
	console.log (this.state);
	/*
	this.state = "standing";
	this.frame = 0;
	this.dir = "middle";
	this.accel = [0, 0];
	this.speed = [0, 0];
	console.log (this.state)
	*/
}

Cat.prototype.startFalling = function ()
{
	if (this.state == "falling") return;
	this.state = "falling";
	this.frame = 8;
	this.anitime = 0;
	console.log (this.state);
	/*
	this.state = "falling";
	*/
}

Cat.prototype.startRunning = function (dir)
{
	if (this.state == "running") return;
	this.state = "running";
	this.frame = 1;
	console.log (this.state);
}

Cat.prototype.startJumping = function ()
{
	if (this.state == "jumping") return;
	this.state = "jumping";
	this.frame = 7;
	this.anitime = 0;
	console.log (this.state);
	/*
	this.frame = 7;
	this.anitime = 0;
	this.speed[1] = - (this.isfat ? this.fatjump : this.thinjump);
	*/
}

Cat.prototype.startEating = function ()
{
	this.state = "eating";
	this.frame = 9;
	this.anitime = 0;
	console.log (this.state);
}

Cat.prototype.goFat = function ()
{
	this.isfat = true;
	this.fatremain = 1024;
	this.texture = this.texfat;
	this.tfspeed = this.fatspeed;
	this.tfjump = this.fatjump;
}

Cat.prototype.goThin = function ()
{
	this.isfat = false;
	this.fatremain = 0;
	this.texture = this.texthin;
	this.tfspeed = this.thinspeed;
	this.tfjump = this.thinjump;
}

Cat.prototype.run = function (dir)
{
	this.dir = dir;
	this.scale[0] = dir == "right" ? +1 : -1;
	if (this.state == "standing") {
		this.startRunning (dir);
	}
	/*
	this.dir = dir;
	
	if (this.state == "standing") {
		this.startRunning (dir);
	}
	*/
}

Cat.prototype.stopRun = function ()
{
	this.dir = "middle";
	if (this.state == "running") {
		this.startStanding ();
	}
	/*
	this.dir = "middle";
	
	if (this.state == "running") {
		this.startStanding ();
	}
	*/
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
		bbox[1],
		bbox[2] - 32,
		bbox[3],
	];
}

Cat.LT = 0b0001;
Cat.RT = 0b0010;
Cat.LB = 0b0100;
Cat.RB = 0b1000;

Cat.prototype.collision = function ()
{
	var bbox = this.bbox ();
	var res = 
		0b0001 * (!this.game.world.isPointFree ([bbox[0], bbox[1]]) ) + // lt
		0b0010 * (!this.game.world.isPointFree ([bbox[2], bbox[1]]) ) + // rt
		0b0100 * (!this.game.world.isPointFree ([bbox[0], bbox[3]]) ) + // lb
		0b1000 * (!this.game.world.isPointFree ([bbox[2], bbox[3]]) ) + // rb
	0;
	
	return res;
}


