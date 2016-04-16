
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
	this.game.draw.triangles ({
		count: 2,
		program: this.game.programs ["sprite-prog"],
		camera: this.game.cameras ["screen-cam"],
		buffers: {
			aVert: this.vertBuf,
			aTexCoord: this.texCoordBuf,
		},
		uniforms: {
			uPos: {values: this.pos},
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

Sprite.prototype.update = function (dt)
{
	this.pos[0] += this.speed[0] * dt / 1000;
	this.pos[1] += this.speed[1] * dt / 1000;
}

