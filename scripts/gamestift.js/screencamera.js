
function ScreenCamera (game)
{
	this.origin = [0.5, 0.5];
	this.pos = [0, 0];
	
	Camera.call (this, game);
}

subclass (ScreenCamera, Camera)

ScreenCamera.prototype.update = function ()
{
	Camera.prototype.update.call (this);

	mat4.scale (this.proj, this.proj, vec3.fromValues (1, -1, 1));
	mat4.translate (this.proj, this.proj, vec3.fromValues (
		this.origin [0]*2 - 1,
		this.origin [1]*2 - 1,
	0));
	mat4.scale (this.proj, this.proj, vec3.fromValues (
		2 / this.game.size[0],
		2 / this.game.size[1],
	1));
	
	mat4.translate (this.view, this.view, vec3.fromValues (
		-this.pos [0],
		-this.pos [1],
	0));
}

