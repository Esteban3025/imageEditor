#version 300 es
precision highp float;

// our texture
uniform sampler2D u_image;
uniform vec3 u_color;

in vec2 v_texCoord;

out vec4 outColor;

void main() {
  vec3 st = v_texCoord
  outColor = texture(u_image, v_texCoord).bgra * sin(u_color);
}