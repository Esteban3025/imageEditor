import { UI } from './SetupUI.js';
import { Elements } from './Elements.js';
const ui = new UI();  
const elements = new Elements();

let keys = {};

export class WebGL2Utils {
    
  async createShader(gl, type, path) {
    const res = await fetch(path);
    const source = await res.text();
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
 
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }


  createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  randomInt(range) {
    return Math.floor(Math.random() * range);
  }

  async loadShader(url) {
    const res = await fetch(url);
    return await res.text();
  }

  async loadImage(path) {
    const img = new Image();
    img.src = `${path}`; 
    console.log(img);
    return img;
  }

  uploadImage(image) {
    const loadButton = elements.button('loadButton');

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

  resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
 
    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
                     canvas.height !== displayHeight;
 
      if (needResize) {
        // Make the canvas the same size
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
      }
    return needResize;
  }

  createTexture(gl, image) {
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

  getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  processInput(gl, position, scale, rotationInRadians, dimensions) {
    let speed = 20;
    let scaled = 0.2;
    document.addEventListener("keydown", (e) => {
      keys = e.key.toLocaleLowerCase();
      console.log("Key Pressed: ", keys);
      switch (keys) {
      case "arrowup":
      case "w":
        position.y -= speed;
        break;
      case "arrowdown":
      case "s":
        position.y += speed;
        break;
      case "arrowright":
      case "d":
        position.x += speed;
        break;
      case "arrowleft":
      case "a":
        position.x -= speed;
        break;
      case "r":
        position.x = gl.canvas.clientWidth / 2;
        position.y = gl.canvas.clientHeight / 2;
        dimensions[0] = 500;
        dimensions[1] = 500;
        break;
      case "+":
        scale.x += scaled;
        scale.y += scaled;
        break;
      case "-":
        scale.x -= scaled;
        scale.y -= scaled;
        break;
      case "e":
        scale.x = -scale.x;
        break;
      case "f":
        scale.y = -scale.y;
        break;
      case "m":
        ui.hideUI();
        elements.hideElements();
        break;
    }
    });
    
    
  }

  hexToRgb(hex) {
    // Remove the '#' character if it exists
    hex = hex.replace(/^#/, '');

    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // Validate hex format (should be 6 digits after potential expansion)
    if (!/^[a-f\d]{6}$/i.test(hex)) {
        return null; // Invalid color
    }

    // Split into red, green, and blue components
    const rgbArr = hex.match(/.{2}/g);

    // Convert each 2-character hex string to a decimal integer using parseInt(string, 16)
    const r = parseInt(rgbArr[0], 16);
    const g = parseInt(rgbArr[1], 16);
    const b = parseInt(rgbArr[2], 16);

    return [r, g, b];
  }

  normalizeArray(Array) {
    return Array.map(v => v / 255.0);
  }

  normalizeFloat(value) {
    return value / 100.00;
  }

  printSineAndCosineForAnAngle(angleInDegrees) {
    const angleInRadians = angleInDegrees * Math.PI / 180;
    const s = Math.sin(angleInRadians);
    const c = Math.cos(angleInRadians);
    console.log("s = " + s + " c = " + c);
  }

}