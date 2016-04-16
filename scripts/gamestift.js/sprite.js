
function Sprite (game, texture)
{
	this.game = game;
	this.texture = texture;
	this.pos = [0, 0];
	this.origin = [0.5, 0.5];
	this.scale = [1, 1];
	this.alpha = 0.5;
	this.vel = [0, 0];
	
	this.verts = [
		0, 0,
		this.texture.width, 0,
		this.texture.width, this.texture.height,
		0, this.texture.height,
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
			uPos: {
				values: [
					this.pos[0] - this.origin[0]*this.texture.width,
					this.pos[1] - this.origin[1]*this.texture.height,
				],
				count: 1,
				type: "float",
			},
			uAlpha: {
				values: this.alpha,
				count: 1,
				type: "float",
			},
		},
		textures: {
			uTex: this.texture,
		},
		indexBuf: this.indexBuf,
	});
}

Sprite.prototype.update = function (dt)
{
	this.pos[0] += this.vel[0] * dt / 1000;
	this.pos[1] += this.vel[1] * dt / 1000;
}

