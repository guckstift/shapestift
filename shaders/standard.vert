
attribute vec3 aPos;
uniform mat4 uView;
uniform mat4 uProj;

void main ()
{
	gl_Position = uProj * uView * vec4 (aPos, 1);
}

