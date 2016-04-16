
function Creator (game)
{
	this.game = game;
}

Creator.prototype.shader = function (name, source)
{
	source = source || this.game.shaders [name];
	return new Shader (this.game, name, source);
}

Creator.prototype.program = function (shaders)
{
	for (var i=0; i<shaders.length; i++) {
		if (typeof shaders [i] == "string") {
			shaders [i] = this.game.shaders [shaders [i]];
		}
	}
	
	return new Program (this.game, shaders);
}

Creator.prototype.texture = function (img)
{
	return new Texture (this.game, img);
}

Creator.prototype.buffer = function (data, components, type, isIbo)
{
	return new Buffer (this.game, data, components, type, isIbo);
}

Creator.prototype.camera = function ()
{
	return new Camera (this.game);
}

Creator.prototype.screenCamera = function ()
{
	return new ScreenCamera (this.game);
}

Creator.prototype.sprite = function (texture)
{
	return new Sprite (this.game, this.game.textures [texture]);
}

