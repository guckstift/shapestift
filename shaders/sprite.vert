
attribute vec2 aVert;
attribute vec2 aTexCoord;

uniform mat4 uView;
uniform mat4 uProj;
uniform vec2 uPos;
uniform vec2 uScale;

varying vec2 vTexCoord;

void main ()
{
	vTexCoord = aTexCoord;
	gl_Position = uProj * uView * vec4 (aVert + uPos, 0.0, 1.0);
}

