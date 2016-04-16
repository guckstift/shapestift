
attribute vec2 aVert;
attribute vec2 aTexCoord;

uniform mat4 uView;
uniform mat4 uProj;
uniform vec2 uPos;
uniform vec2 uSize;
uniform vec2 uScale;
uniform vec2 uOrigin;
uniform vec2 uTiling;
uniform float uFrame;

varying vec2 vTexCoord;

void main ()
{
	vec2 frameCoord = vec2 (
		floor (mod (uFrame, uTiling [0])),
		floor (uFrame / uTiling [0])
	);
	
	vTexCoord = (aTexCoord + frameCoord) / uTiling;

	gl_Position = uProj * uView * vec4 (
		(aVert - uOrigin) * uSize * uScale + uPos,
	0.0, 1.0);
}

