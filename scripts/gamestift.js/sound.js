
function Sound (src, onLoadCallback)
{
	var self = this;
	
	this.howl = new Howl ({
		urls: [src],
		onload: function () {
			onLoadCallback (self);
		},
	});
}

Sound.prototype.play = function (looped)
{
	looped = looped || false;
	
	this.howl.loop (looped);
	this.howl.play ();
}

Sound.prototype.stop = function ()
{
	this.howl.stop ();
}

