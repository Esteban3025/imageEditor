import { WebGL2Utils } from './utils/WebGLUtils.js';
import { Shapes } from './utils/Shapes.js';
import { UI } from './utils/setupUI.js';

const utils = new WebGL2Utils();
const shapes = new Shapes();
const ui = new UI();

let filterColor = [255, 255, 255];
let backgroundColor = [30, 23, 23];
let opacity = 0.0;

function createTexture(gl, image) {
  // Create a texture.
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we don't need mips and so we're not filtering
  // and we don't repeat at the edges
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  const mipLevel = 0;               // the largest mip
  const internalFormat = gl.RGBA;   // format we want in the texture
  const srcFormat = gl.RGBA;        // format of data we are supplying
  const srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
  gl.texImage2D(gl.TEXTURE_2D,
                mipLevel,
                internalFormat,
                srcFormat,
                srcType,
                image);
};

async function loadImage(path) {
  const img = new Image();
  img.src = `${path}`; 
  console.log(img);
  return img;
}

const image = new Image();
  image.src = "/images/descarga.jpg"; 
  image.onload = function() {
  render(image);
};

async function render(image) {
  const canvas = document.getElementById("c");
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  let translation = [(canvas.clientWidth * 0.5) - canvas.clientWidth * 0.18, (canvas.clientHeight * 0.5) - canvas.clientHeight * 0.3];

  // Setup UI
  const rgbInput = ui.textRgb("rgbInput", "rgbText", "Filter Color");

  rgbInput.addEventListener("change", (e) => {
      filterColor = utils.hexToRgb(e.target.value);
  }); 

  const backgroundInput = ui.textRgb("backgroundColor", "backgroundText", "Background Color");

  backgroundInput.addEventListener("change", (e) => {
      const data = utils.hexToRgb(e.target.value);
      backgroundColor = utils.normalizeArray(data);
      console.log(backgroundColor);
  });

  const range = ui.textRange("range", "rangeText", "Mix");

  range.addEventListener("change", (e) => {
      const data = utils.normalizeFloat(e.target.value);
      opacity = data;
      console.log(data);
  });

  // setup GLSL program
  const mainVS = await utils.createShader(gl, gl.VERTEX_SHADER, "/shaders/main.vs");
  const mainFS = await utils.createShader(gl, gl.FRAGMENT_SHADER, "/shaders/main.fs");

  const mainProgram = utils.createProgram(gl, mainVS, mainFS);

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(mainProgram, "a_position");
  const texCoordAttributeLocation = gl.getAttribLocation(mainProgram, "a_texCoord");

  // lookup uniforms  
  const resolutionLocation = gl.getUniformLocation(mainProgram, "u_resolution");
  const imageLocation = gl.getUniformLocation(mainProgram, "u_image");
  const imageLocationSecond = gl.getUniformLocation(mainProgram, "u_image2");
  const colorUniform = gl.getUniformLocation(mainProgram, "u_color");
  const translationUniform = gl.getUniformLocation(mainProgram, "U_translation");
  const opacityImages = gl.getUniformLocation(mainProgram, "u_opacity");

  // Create a vertex array object (attribute state)
  const vao = gl.createVertexArray();

  // and make it the one we're currently working with
  gl.bindVertexArray(vao);

  // Create a buffer and put a single pixel space rectangle in
  const positionBuffer = gl.createBuffer();

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // Main image coordinates
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
  ]), gl.STATIC_DRAW);

  // Turn on the attribute
  gl.enableVertexAttribArray(texCoordAttributeLocation);

  gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // load textures images
  const img = await loadImage("/images/awesomeface.png");

  // bind textures

  gl.activeTexture(gl.TEXTURE0);
  createTexture(gl, image);
  
  gl.activeTexture(gl.TEXTURE1);
  createTexture(gl, img);
  
  requestAnimationFrame(drawScene);
  function drawScene() {
  utils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(mainProgram);

  gl.bindVertexArray(vao);

  gl.uniform1f(opacityImages, opacity);
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform2fv(translationUniform, translation);
  gl.uniform3fv(colorUniform, filterColor);

  gl.activeTexture(gl.TEXTURE0);
  gl.uniform1i(imageLocation, 0);
  gl.activeTexture(gl.TEXTURE1);
  gl.uniform1i(imageLocationSecond, 1);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  shapes.setRectangle(gl, 0, 0, image.width, image.height);

  // Draw the rectangle.
  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 6;
  gl.drawArrays(primitiveType, offset, count);

  requestAnimationFrame(drawScene);
  }
}

