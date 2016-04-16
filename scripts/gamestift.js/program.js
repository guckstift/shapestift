
function Program (game, shaders)
{
	var self = this;
	
	this.game = game;
	this.shaders = shaders;
	
	this.nextTexUnit = 0;
	
	var gl = this.game.gl;
	
	this.prog = gl.createProgram ();
	
	this.shaders.forEach (function (shader) {
		gl.attachShader (self.prog, shader.shader);
	});
	
	gl.linkProgram (this.prog);
	
	if (!gl.getProgramParameter (this.prog, gl.LINK_STATUS)) {
		throw (
			"error linking shader program: " + gl.getProgramInfoLog (this.prog)
		);
	}
}

Program.prototype.use = function ()
{
	var gl = this.game.gl;
	
	gl.useProgram (this.prog);
}

Program.prototype.getAttribute = function (name)
{
	var gl = this.game.gl;
	
	return gl.getAttribLocation (this.prog, name);
}

Program.prototype.getUniform = function (name)
{
	var gl = this.game.gl;
	
	return gl.getUniformLocation (this.prog, name);
}

Program.prototype.enableAttributeArray = function (attribute, buffer)
{
	var gl = this.game.gl;
	
	var attributeLocation = this.getAttribute (attribute);
	
	buffer.bind ();
	gl.enableVertexAttribArray (attributeLocation);

	gl.vertexAttribPointer (
		attributeLocation,
		buffer.components,
		buffer.glType,
		false, 0, 0
	);
}

Program.prototype.setUniform = function (uniform, values, count, type)
{
	uniform = this.getUniform (uniform);
	values = typeof values == "number" ? [values] : values;
	count = count || 1;
	type = type || "float";
	
	var gl = this.game.gl;
	var components = values.length / count;
	
	if (components >= 1 && components <= 4) {
		var setUniformFunc = gl ["uniform" + components + "" + type [0] + "v"];
		setUniformFunc.call (gl, uniform, values);
	}
	else if (components == 9) {
		gl.uniformMatrix3fv (uniform, false, values);
	}
	else if (components == 16) {
		gl.uniformMatrix4fv (uniform, false, values);
	}
}

Program.prototype.enableTexture = function (uniform, texture)
{
	var gl = this.game.gl;
	
	texture.bind (this.nextTexUnit);
	this.setUniform (uniform, this.nextTexUnit, 1, "int");
	this.nextTexUnit ++;
}

Program.prototype.enableTextures = function (uniform, textures)
{
	var gl = this.game.gl;
	var texCount = textures.length;
	var texUnits = _.range (this.nextTexUnit, texCount)
	
	_.each (textures, function (tex, i) {
		tex.bind (texUnits [i]);
	}, this);
	
	this.setUniform (uniform, texUnits, texCount, "int");
	this.nextTexUnit += texCount;
}

Program.prototype.disableTextures = function ()
{
	this.nextTexUnit = 0;
}

