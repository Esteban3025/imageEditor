import { WebGL2Utils } from './utils/WebGLUtils.js';
import { Shapes } from './utils/Shapes.js';
import { UI } from './utils/setupUI.js';
import { Elements } from './utils/Elements.js';
import { UtilMath } from './utils/Math.js';

const utils = new WebGL2Utils();
const shapes = new Shapes();
const ui = new UI();  
const elements = new Elements();
const glm =  new UtilMath()

let filterColor = [255, 255, 255];
let backgroundColor = [30, 23, 23];
let opacity = 0.0;
let keys = {
  key: 0
};

let then = 0;

let rotationInRadians = 0;

// Setup UI
let filterInput = ui.textRgb("filterInput", "filterText", "Filter Color");

filterInput.addEventListener("change", (e) => {
    filterColor = utils.hexToRgb(e.target.value);
}); 

let backgroundInput = ui.textRgb("backgroundColorInput", "backgroundColorText", "Background Color");

backgroundInput.addEventListener("change", (e) => {
  const data = utils.hexToRgb(e.target.value);
  backgroundColor = utils.normalizeArray(data);
  // console.log(backgroundColor);
});


let dimensionsInput = ui.scaleInputs("dimensionInput", "dimensionInput2", "dimensionText", "Width - Height");

dimensionsInput[0].addEventListener("change", (e) => {
  // utils.normalizeFloat(e.target.value)
  console.log(e.target.value);
  const data = e.target.value;
  dimensions[0] = data;
});

dimensionsInput[1].addEventListener("change", (e) => {
  // utils.normalizeFloat(e.target.value)
  console.log(e.target.value);
  const data = e.target.value;
  dimensions[1] = data;
});

let Mixrange = ui.textRange("mixrange", "mixtext", "Mix images");

Mixrange.addEventListener("change", (e) => {
  const data = utils.normalizeFloat(e.target.value);
  opacity = data; 
});


// load textures images
let image = await utils.loadImage("/images/descarga.jpg");
let image2 = await utils.loadImage("/images/awesomeface.png");

function uploadImage1() {
  const loadButton = elements.InputTypeFile('loadButton1', 'labelUpload1', 'a1', 'Upload Image 1');

  loadButton.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => { 
      const img = new Image();
      img.onload = () => {
        image = img;
        render();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function uploadImage2() {
  const loadButton = elements.InputTypeFile('loadButton2', 'labelUpload2', 'a2', 'Upload Image 2');

  loadButton.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => { 
      const img = new Image();
      img.onload = () => {
        image2 = img;
        render();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

uploadImage1();
uploadImage2();

async function render() {
  const canvas = document.getElementById("c");
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }


  let properties = {
    position: {
      x: gl.canvas.clientWidth / 2,
      y: gl.canvas.clientHeight / 2,
      defaultx: gl.canvas.clientWidth / 2,
      defaulty: gl.canvas.clientHeight / 2
    },
    
    scale: {
      x: 1,
      y: 1,
      default: 1,
    },

    dimensions: [500, 500]
  }

  // process all the inputs
  utils.processInput(keys);
  console.log(keys);

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
  const opacityImages = gl.getUniformLocation(mainProgram, "u_opacity");

  const matrixLocation = gl.getUniformLocation(mainProgram, "u_matrix");

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

  // bind textures
  gl.activeTexture(gl.TEXTURE0);
  utils.createTexture(gl, image);
  
  gl.activeTexture(gl.TEXTURE1);
  utils.createTexture(gl, image2);

  

  requestAnimationFrame(drawScene);
  function drawScene(now) {
    utils.a(properties, keys);
    now *= 0.001;
    let deltaTime = now - then;

    utils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(mainProgram);

    gl.bindVertexArray(vao);

    gl.uniform1f(opacityImages, opacity);
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform3fv(colorUniform, filterColor);

    const moveOriginMatrix = glm.translation(0, 0);
    const translationMatrix = glm.translation(properties.position.x, properties.position.y);
    const rotationMatrix = glm.rotation(rotationInRadians);
    const scaleMatrix = glm.scaling(properties.scale.x, properties.scale.y);
    // Multiply the matrices.
    let matrix = glm.multiply(translationMatrix, rotationMatrix);
    matrix = glm.multiply(matrix, scaleMatrix);
    matrix = glm.multiply(matrix, moveOriginMatrix);

    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(imageLocation, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.uniform1i(imageLocationSecond, 1);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    shapes.setRectangle(gl, properties.dimensions[0], properties.dimensions[1]);

    // Draw the rectangle.
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 6;
    gl.drawArrays(primitiveType, offset, count);

    requestAnimationFrame(drawScene);
    then = now;
  }
}

render();
