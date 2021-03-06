
var game;

$(main);

function main ()
{
	game = new MyGame ();
	game.launch ();
}

function MyGame ()
{
	this.keymap = {};
	
	Game.call (this, {
		bgColor: [0, 0.25, 0.5, 1],
		updateInterval: 4,
		mode: "static",
		size: [1024, 768],
		updateInterval: 10,
	});
}

subclass (MyGame, Game);

MyGame.prototype.onPreload = function ()
{
	this.load ("images/sky.jpg");
	this.load ("images/soil.png");
	this.load ("images/food.png");
	this.load ("images/tiles.png");
	this.load ("images/cat.png");
	this.load ("images/fatcat.png");
	
	this.load ("levels/level.txt");
	
	//this.load ("sounds/haken.ogg");
}

MyGame.prototype.onPreloadDone = function ()
{
	this.camera = this.create.screenCamera ();
	
	this.sky = this.create.sprite ({
		texture: "images/sky.jpg",
		origin: [0.5, 0.5],
	});
	
	this.level = _.map (this.texts ["levels/level.txt"].trim().split ("\n"), function (line) {
		return _.map (line, function (block) {
			return block;
		})
	});
	
	this.world = new World (this, this.level);

	this.cat = new Cat (this);
	this.cat.pos = [64*5, 64*2];
}

MyGame.prototype.onRender = function ()
{
	this.sky.draw ();
	this.world.draw ();
	this.cat.draw ();
}

MyGame.prototype.onUpdate = function (dt)
{
	this.cat.update ();
	this.sky.pos = this.cat.pos;
	this.camera.pos = this.cat.pos;
	this.camera.update ();
}

MyGame.prototype.onKeyDown = function (e)
{
	this.keymap [e.keyCode] = true;
}

MyGame.prototype.onKeyUp = function (e)
{
	this.keymap [e.keyCode] = false;
}

function boxCollision (boxa, boxb)
{
	return
		boxa[2] < boxb[0] ||
		boxa[0] > boxb[2] ||
		boxa[3] < boxb[1] ||
		boxa[1] > boxb[3] ;
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


