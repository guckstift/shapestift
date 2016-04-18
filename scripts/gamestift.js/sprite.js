
//function Sprite (game, texture, cols, rows)
function Sprite (game, props)
{
	this.game = game;
	this.texture = props.texture;
	this.pos = props.pos || [0, 0];
	this.origin = props.origin || [0, 0];
	this.scale = props.scale || [1, 1];
	this.alpha = props.alpha || 1;
	this.speed = props.speed || [0, 0];
	this.accel =  props.accel || [0, 0];
	this.tiling = props.tiling || [1, 1];
	this.frame = props.frame || 0;
	
	this.numframes = this.tiling[0] * this.tiling[1];
	this.texsize = this.texture.size;
	this.framesize = [
		this.texsize[0] / this.tiling[0],
		this.texsize[1] / this.tiling[1],
	];
	
	this.verts = [
		0, 0,
		1, 0,
		1, 1,
		0, 1,
	];
	this.texCoords = [
		0, 0,
		1, 0,
		1, 1,
		0, 1,
	];
	this.indices = [
		0, 1, 2,
		2, 3, 0,
	];
	
	this.vertBuf = this.game.create.buffer (this.verts, 2, "float", false);
	this.texCoordBuf = this.game.create.buffer (this.texCoords, 2, "float", false);
	this.indexBuf = this.game.create.buffer (this.indices, 1, "ushort", true);
}

Sprite.prototype.draw = function ()
{
	if (
		floor (this.pos[0]) + this.framesize[0] >= floor (this.game.camera.pos[0]) - this.game.size[0]/2 &&
		floor (this.pos[0]) - this.framesize[1] <= floor (this.game.camera.pos[0]) + this.game.size[0]/2 &&
		floor (this.pos[1]) + this.framesize[0] >= floor (this.game.camera.pos[1]) - this.game.size[1]/2 &&
		floor (this.pos[1]) - this.framesize[1] <= floor (this.game.camera.pos[1]) + this.game.size[1]/2
	) {
		this.game.draw.triangles ({
			count: 2,
			program: this.game.programs ["sprite-prog"],
			camera: this.game.cameras ["screen-cam"],
			buffers: {
				aVert: this.vertBuf,
				aTexCoord: this.texCoordBuf,
			},
			uniforms: {
				uPos: {values: [floor (this.pos[0]), floor (this.pos[1])]},
				uSize: {values: this.framesize},
				uOrigin: {values: this.origin},
				uScale: {values: this.scale},
				uTiling: {values: this.tiling},
				uFrame: {values: this.frame},
				uAlpha: {values: this.alpha},
			},
			textures: {
				uTex: this.texture,
			},
			indexBuf: this.indexBuf,
		});
	}
}

Sprite.prototype.update = function (dt)
{
	this.speed[0] += this.accel[0] * dt / 1000;
	this.speed[1] += this.accel[1] * dt / 1000;
	this.pos[0] += this.speed[0] * dt / 1000;
	this.pos[1] += this.speed[1] * dt / 1000;
}

Sprite.prototype.bbox = function ()
{
	return [
		(0 - this.origin[0]) * this.framesize[0] * abs(this.scale[0]) + this.pos[0],
		(0 - this.origin[1]) * this.framesize[1] * abs(this.scale[1]) + this.pos[1],
		(1 - this.origin[0]) * this.framesize[0] * abs(this.scale[0]) + this.pos[0],
		(1 - this.origin[1]) * this.framesize[1] * abs(this.scale[1]) + this.pos[1],
	];
}


