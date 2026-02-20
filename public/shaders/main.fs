#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// our texture
uniform sampler2D u_image;
uniform vec3 u_color;

// the texCoords passed in from the vertex shader.
in vec2 v_texCoord;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  vec3 color = u_color;
  vec3 colorNormalizado = color / 255.0;
  vec3 result = texture(u_image, v_texCoord).rgb * colorNormalizado;
  outColor = vec4(result, 1.0);
}