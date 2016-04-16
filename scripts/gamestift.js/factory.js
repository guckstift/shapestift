
function Factory (game)
{
	this.game = game;
}

Factory.prototype.program = function (key, shaders)
{
	if (key in this.game.programs) {
		return this.game.programs [key];
	}
	else {
		return this.game.programs [key] = this.game.create.program (shaders);
	}
}

Factory.prototype.camera = function (key)
{
	if (key in this.game.cameras) {
		return this.game.cameras [key];
	}
	else {
		return this.game.programs [key] = this.game.create.camera ();
	}
}

Factory.prototype.screenCamera = function (key)
{
	if (key in this.game.cameras) {
		return this.game.cameras [key];
	}
	else {
		return this.game.programs [key] = this.game.create.screenCamera ();
	}
}

