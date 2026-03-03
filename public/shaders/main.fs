#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// our texture
uniform sampler2D u_image;
uniform sampler2D u_image2;
uniform vec3 u_color;
uniform float u_opacity;

// the texCoords passed in from the vertex shader.
in vec2 v_texCoord;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  vec3 color = u_color;
  vec3 colorNormalizado = color / 255.0;

  vec4 texture1 = texture(u_image, v_texCoord);
  vec4 texture2 = texture(u_image2, v_texCoord);

  vec4 mixedTex = mix(texture1, texture2, u_opacity);
  vec4 result = mixedTex * vec4(colorNormalizado, 1.0) ;

  outColor = result;
} 