
function Camera (game)
{
	this.game = game;
	this.update ();
}

Camera.prototype.enable = function (program)
{
	program.setUniform ("uView", this.view);
	program.setUniform ("uProj", this.proj);
}

Camera.prototype.update = function ()
{
	this.view = mat4.create ();
	this.proj = mat4.create ();
}

