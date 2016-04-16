
function Game (props)
{
	var self = this;
	
	props = props || {};
	
	this.canvasId = props.canvasId;
	this.bgColor = props.bgColor || [0, 0, 0, 1];
	this.size = props.size || [800, 600];
	this.mode = props.mode || "fullsize";
	this.updateInterval = props.updateInterval || 5;
	this.onPreload = this.onPreload || props.onPreload || $.noop;
	this.onPreloadDone = this.onPreloadDone || props.onPreloadDone || $.noop;
	this.onUpdate = this.onUpdate || props.onUpdate || $.noop;
	this.onRender = this.onRender || props.onRender || $.noop;
	this.onMouseMove = this.onMouseMove || props.onMouseMove || $.noop;
	this.onMouseDown = this.onMouseDown || props.onMouseDown || $.noop;
	this.onMouseUp = this.onMouseUp || props.onMouseUp || $.noop;
	this.onMouseWheelDown = this.onMouseWheelDown || props.onMouseWheelDown || $.noop;
	this.onMouseWheelUp = this.onMouseWheelUp || props.onMouseWheelUp || $.noop;
	this.onTouchMove = this.onTouchMove || props.onTouchMove || $.noop;
	this.onTouchStart = this.onTouchStart || props.onTouchStart || $.noop;
	this.onKeyDown = this.onKeyDown || props.onKeyDown || $.noop;
	this.onKeyUp = this.onKeyUp || props.onKeyUp || $.noop;
	
	this.mouseX = 0;
	this.mouseY = 0;
	this.mouseRelX = 0;
	this.mouseRelY = 0;
	this.touchX = 0;
	this.touchY = 0;
	this.touchRelX = 0;
	this.touchRelY = 0;
	
	this.loadingObjs = [];
	this.textures = {};
	this.sounds = {};
	this.shaders = {};
	this.meshes = {};
	this.jsons = {};
	this.texts = {};
	this.programs = {};
	this.cameras = {};
	
	this.create = new Creator (this);
	this.add = new Factory (this);
	this.draw = new Renderer (this);
	
	if (this.canvasId) {
		this.canvas = $("#" + this.canvasId) [0];
	}
	else {
		this.canvas = $("<canvas>") [0];
		$("body").append (this.canvas);
	}
	
	this.gl = this.canvas.getContext ("webgl", {antialias: false, alpha: false});
	
	/*
	this.gl.enable (this.gl.CULL_FACE);
	this.gl.cullFace (this.gl.BACK);
	this.gl.frontFace (this.gl.CCW);
	this.gl.enable (this.gl.DEPTH_TEST);
	this.gl.depthFunc (this.gl.GREATER);
	this.gl.clearDepth (0);
	*/
	this.gl.enable (this.gl.BLEND);
	this.gl.blendEquation (this.gl.FUNC_ADD);
	this.gl.blendFunc (this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	
	this.setBgColor ();
	this.resize ();
	
	if (this.mode == "fullsize")
	{	
		$("html, body").add ($(this.canvas).parents ())
			.css ("margin", "0px")
			.css ("padding", "0px")
			.css ("width", "100%")
			.css ("height", "100%")
			.css ("overflow", "hidden")
		;
		$(this.canvas)
			.css ("margin", "0px")
			.css ("padding", "0px")
			.css ("display", "block")
		;
		
		this.$canvasParent = $(this.canvas).parent ()
		
		$(window).resize (_.bind (this.onWindowResize, this));
		this.onWindowResize ();
	}
}

Game.prototype.standardVertShaderFile = "shaders/standard.vert";
Game.prototype.standardFragShaderFile = "shaders/standard.frag";
Game.prototype.meshVertShaderFile = "shaders/mesh.vert";
Game.prototype.meshFragShaderFile = "shaders/mesh.frag";
Game.prototype.spriteVertShaderFile = "shaders/sprite.vert";
Game.prototype.spriteFragShaderFile = "shaders/sprite.frag";

Game.prototype.ARROWDOWN = 40;
Game.prototype.ARROWLEFT = 37;
Game.prototype.ARROWRIGHT = 39;
Game.prototype.ARROWUP = 38;

Game.prototype.onWindowResize = function ()
{
	this.resize ([
		this.$canvasParent.innerWidth (),
		this.$canvasParent.innerHeight (),
	]);
}

Game.prototype.launch = function ()
{
	var self = this;
	
	this.load (this.standardVertShaderFile);
	this.load (this.standardFragShaderFile);
	this.load (this.meshVertShaderFile);
	this.load (this.meshFragShaderFile);
	this.load (this.spriteVertShaderFile);
	this.load (this.spriteFragShaderFile);
	
	this.onPreload ();
	
	$.when.apply ($, this.loadingObjs).done (this.preloadDone.bind (this));
	
	this.loadingObjs = [];
}

Game.prototype.preloadDone = function ()
{
	var self = this;
	
	this.add.program ("std-prog", [
		this.standardVertShaderFile,
		this.standardFragShaderFile,
	]);
	
	this.add.program ("mesh-prog", [
		this.meshVertShaderFile,
		this.meshFragShaderFile,
	]);
	
	this.add.program ("sprite-prog", [
		this.spriteVertShaderFile,
		this.spriteFragShaderFile,
	]);
	
	this.add.camera ("std-cam");
	this.add.screenCamera ("screen-cam");
	
	this.setProgram ();
	this.setCamera ();
	
	this.onPreloadDone ();
	
	document.addEventListener ("mousemove", function (eventObject) {
		self.mouseX = eventObject.clientX;
		self.mouseY = eventObject.clientY;
		self.mouseRelX = eventObject.movementX;
		self.mouseRelY = eventObject.movementY;
		self.onMouseMove ();
	});
	
	document.addEventListener ("mousedown", function (eventObject) {
		self.mouseX = eventObject.clientX;
		self.mouseY = eventObject.clientY;
		self.mouseRelX = eventObject.movementX;
		self.mouseRelY = eventObject.movementY;
		self.onMouseDown ();
		eventObject.preventDefault ();
	});
	
	document.addEventListener ("mouseup", function (eventObject) {
		self.mouseX = eventObject.clientX;
		self.mouseY = eventObject.clientY;
		self.mouseRelX = eventObject.movementX;
		self.mouseRelY = eventObject.movementY;
		self.onMouseUp ();
	});
	
	document.addEventListener ("wheel", function (eventObject) {
		self.mouseX = eventObject.clientX;
		self.mouseY = eventObject.clientY;
		self.mouseRelX = eventObject.movementX;
		self.mouseRelY = eventObject.movementY;
		if (eventObject.deltaY > 0) {
			self.onMouseWheelDown ();
		}
		else {
			self.onMouseWheelUp ();
		}
	});
	
	document.addEventListener ("touchmove", function (eventObject) {
		self.touchRelX = eventObject.touches[0].clientX - self.touchX;
		self.touchRelY = eventObject.touches[0].clientY - self.touchY;
		self.touchX = eventObject.touches[0].clientX;
		self.touchY = eventObject.touches[0].clientY;
		self.onTouchMove (eventObject);
	});
	
	document.addEventListener ("touchstart", function (eventObject) {
		self.touchX = eventObject.touches[0].clientX;
		self.touchY = eventObject.touches[0].clientY;
		self.onTouchStart (eventObject);
	});
	
	document.addEventListener ("keydown", function (eventObject) {
		self.onKeyDown (eventObject);
	});
	
	document.addEventListener ("keyup", function (eventObject) {
		self.onKeyUp (eventObject);
	});
	
	setInterval (this.updateLoop.bind (this), this.updateInterval);
	requestAnimationFrame (this.renderLoop.bind (this));
}

Game.prototype.updateLoop = function ()
{
	var now = performance.now ();
	this.lastTimeStamp = this.lastTimeStamp || now;
	var dt = now - this.lastTimeStamp;
	this.lastTimeStamp = now;
	
	this.onUpdate (dt);
}

Game.prototype.renderLoop = function ()
{
	this.gl.clear (this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	this.onRender ();
	requestAnimationFrame (this.renderLoop.bind (this));
}

Game.prototype.setBgColor = function (bgColor)
{
	this.bgColor = bgColor || this.bgColor;
	this.gl.clearColor (
		this.bgColor [0],
		this.bgColor [1],
		this.bgColor [2],
		this.bgColor [3]
	);
}

Game.prototype.setProgram = function (program)
{
	this.program = program || this.stdProgram;
	
	if (this.program) {
		this.program.use ();
	}
	
	if (this.camera) {
		this.camera.update ();
		this.camera.enable ();
	}
}

Game.prototype.setCamera = function (camera)
{
	this.camera = camera || this.stdCamera;
	
	if (this.camera) {
		this.camera.update ();
		this.camera.enable ();
	}
}

Game.prototype.resize = function (size)
{
	this.size = size || this.size;
	this.canvas.width = this.size [0];
	this.canvas.height = this.size [1];
	this.gl.viewport (
		0,
		0,
		this.size [0],
		this.size [1]
	);
	
	if (this.camera) {
		this.camera.update ();
	}
}

Game.prototype.load = function (url)
{
	var self = this;
	
	if (fileExt (url) == "png") {
		var loadingObj = loadImage (url, function (img) {
			self.textures [url] = self.create.texture (img);
		});
	}
	else if (fileExt (url) == "ogg") {
		var loadingObj = loadSound (url, function (sound) {
			self.sounds [url] = sound;
		});
	}
	else if (fileExt (url) == "vert" || fileExt (url) == "frag") {
		var loadingObj = loadText (url, function (text) {
			self.shaders [url] = self.create.shader (url, text);
		});
	}
	else if (fileExt (url) == "json") {
		var loadingObj = loadJson (url, function (json) {
			if (json.jsonType == "mesh") {
				self.meshes [url] = new Mesh (self, json);
			}
			else {
				self.jsons [url] = json;
			}
		});
	}
	else {
		var loadingObj = loadText (url, function (text) {
			self.texts [url] = text;
		});
	}
	
	this.loadingObjs.push (loadingObj);
}

Game.prototype.drawTriangles = function (count)
{
	this.gl.drawArrays (this.gl.TRIANGLES, 0, count * 3);
}

Game.prototype.drawTrianglesIndexed = function (count, indexBuf)
{
	indexBuf.bind ();
	
	if (indexBuf.type == "ushort") {
		this.gl.drawElements (this.gl.TRIANGLES, count * 3, this.gl.UNSIGNED_SHORT, 0);
	}
}

Game.prototype.lockPointer = function ()
{
	this.canvas.requestPointerLock ();
}

Game.prototype.releasePointer = function ()
{
	document.exitPointerLock ();
}

