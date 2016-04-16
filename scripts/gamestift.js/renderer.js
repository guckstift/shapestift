
function Renderer (game)
{
	this.game = game;
}

Renderer.prototype.triangles = function (props)
{
	count = props.count || 1;
	program = props.program || this.game.program || this.game.programs ["std-program"];
	camera = props.camera || this.game.camera || this.game.cameras ["std-camera"];
	buffers = props.buffers || {};
	uniforms = props.uniforms || {};
	textures = props.textures || {};
	indexBuf = props.indexBuf;
	
	count = count * 3; // triangle count to element/vertex count
	program.use ();
	camera.enable (program);
	
	_.each (buffers, function (buffer, attributeName) {
		program.enableAttributeArray (attributeName, buffer);
	}, this);
	
	_.each (uniforms, function (uniform, uniformName) {
		program.setUniform (uniformName, uniform.values, uniform.count, uniform.type);
	}, this);
	
	_.each (textures, function (texture, uniformName) {
		program.enableTexture (uniformName, texture);
	}, this);
	
	if (indexBuf) {
		indexBuf.bind ();
		this.game.gl.drawElements (this.game.gl.TRIANGLES, count, this.game.gl.UNSIGNED_SHORT, 0);
	}
	else {
		this.game.gl.drawArrays (this.game.gl.TRIANGLES, 0, count);
	}
	
	program.disableTextures ();
}

