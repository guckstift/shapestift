
var game;

$(main);

function main ()
{
	game = new MyGame ();
	game.launch ();
}

function MyGame ()
{
	Game.call (this, {
		bgColor: [0, 0.25, 0.5, 1],
		updateInterval: 4,
		mode: "fullsize",
	});
}

subclass (MyGame, Game);

MyGame.prototype.onPreload = function ()
{
	this.load ("images/sky.jpg");
	this.load ("images/soil.png");
	this.load ("images/cat.png");
	
	//this.load ("sounds/haken.ogg");
}

MyGame.prototype.onPreloadDone = function ()
{
	this.camera = this.create.screenCamera ();
	
	this.sky = this.create.sprite ({
		texture: "images/sky.jpg",
		//origin: [0.5, 0.5],
	});
	
	this.world = new World (this);

	this.cat = new Cat (this);
}

MyGame.prototype.onRender = function ()
{
	this.sky.draw ();
	this.world.draw ();
	this.cat.draw ();
}

MyGame.prototype.onUpdate = function (dt)
{
	this.cat.update (dt);
	this.camera.pos = this.cat.pos;
	this.camera.update ();
}

MyGame.prototype.onKeyDown = function (e)
{
	if (e.keyCode == this.ARROWLEFT) {
		this.cat.startRunLeft ();
	}
	else if (e.keyCode == this.ARROWUP) {
	}
	else if (e.keyCode == this.ARROWRIGHT) {
		this.cat.startRunRight ();
	}
	else if (e.keyCode == this.ARROWDOWN) {
	}
	else if (e.keyCode == this.SPACE) {
		this.cat.jump ();
	}
	
	//this.sounds ["sounds/haken.ogg"].play ();
}

MyGame.prototype.onKeyUp = function (e)
{
	if (e.keyCode == this.ARROWLEFT || e.keyCode == this.ARROWRIGHT) {
		this.cat.stopRun ();
	}
	else if (e.keyCode == this.ARROWUP || e.keyCode == this.ARROWDOWN) {
	}
}

/*
function onCreate ()
{
	/*
	this.mapProg = this.create.program (["shaders/map.vert", "shaders/map.frag"]);
	this.mapCam = new MapCamera (this);
	this.map = new Map (this, 180);
	//this.map = new Map (this, 64);
	this.mapCam.x = this.map.size / 2;
	this.mapCam.y = this.map.size / 2;
	this.sun = vec3.fromValues (0, 0, -1);
	
	var sunTransform = mat4.create ();
	mat4.rotateZ (sunTransform, sunTransform, radians (30));
	mat4.rotateX (sunTransform, sunTransform, radians (-45));
	vec3.transformMat4 (this.sun, this.sun, sunTransform);
	* /
}

function onUpdate ()
{
}

function onRender ()
{
	/*
	this.setProgram (this.mapProg);
	this.setCamera (this.mapCam);
	this.map.draw ();
	* /
}

function onMouseDown ()
{
	this.lockPointer ();
	this.moving = true;
}

function onMouseUp ()
{
	this.releasePointer ();
	this.moving = false;
}

function onMouseMove ()
{
	if (this.moving) {
		this.moveCamera (this.mouseRelX, this.mouseRelY);
	}
}

ProtoGame.prototype.onMouseWheelUp = function ()
{
	this.zoomInCamera ();
}

ProtoGame.prototype.onMouseWheelDown = function ()
{
	this.zoomOutCamera ();
}

ProtoGame.prototype.onTouchMove = function (e)
{
	if (e.touches.length == 1) {
		this.moveCamera (this.touchRelX, this.touchRelY);
	}
	else if (e.touches.length == 2) {
		var newTwoTouchDist = Math.sqrt (
			Math.pow (e.touches[1].clientX - e.touches[0].clientX, 2) +
			Math.pow (e.touches[1].clientY - e.touches[0].clientY, 2)
		);
		this.zoomCamera (newTwoTouchDist - this.twoTouchDist);
		this.twoTouchDist = newTwoTouchDist;
	}
}

ProtoGame.prototype.onTouchStart = function (e)
{
	if (e.touches.length == 2) {
		this.twoTouchDist = Math.sqrt (
			Math.pow (e.touches[1].clientX - e.touches[0].clientX, 2) +
			Math.pow (e.touches[1].clientY - e.touches[0].clientY, 2)
		);
	}
}

ProtoGame.prototype.moveCamera = function (relX, relY)
{
	this.camera.x += relX / this.camera.zoom;
	this.camera.y += relY / this.camera.zoom;
}

ProtoGame.prototype.zoomInCamera = function ()
{
	this.camera.setZoom (this.camera.zoom * 1.25);
}

ProtoGame.prototype.zoomOutCamera = function ()
{
	this.camera.setZoom (this.camera.zoom / 1.25);
}

ProtoGame.prototype.zoomCamera = function (dist)
{
	this.camera.setZoom (this.camera.zoom + dist);
}
*/


