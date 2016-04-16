
precision highp float;

uniform sampler2D uTex;
uniform float uAlpha;

varying vec2 vTexCoord;

void main ()
{
	gl_FragColor = texture2D (uTex, vTexCoord);
	//gl_FragColor = vec4 (1,1,1,0.25);
	gl_FragColor.a *= uAlpha;
}

