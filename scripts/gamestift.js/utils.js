
function loadText (url, callback)
{
	return $.get (url, {}, callback, "text");
}

function loadJson (url, callback)
{
	return $.getJSON (url, callback);
}

function loadImage (url, callback)
{
	return $.Deferred (function (deferred) {
		var $img = $("<img>")
		$img.load (function (eventObj) {
			callback (eventObj.target);
			deferred.resolve ();
		})
		$img.attr ("src", url);
	});
}

function loadSound (url, callback)
{
	return $.Deferred (function (deferred) {
		var sound = new Sound (url, function (sound) {
			callback (sound);
			deferred.resolve ();
		});
	});
}

function fileExt (filename)
{
	return filename.split (".").pop ();
}

function subclass (newclass, baseclass)
{
	newclass.prototype = Object.create (baseclass.prototype, {constructor: newclass});
}

