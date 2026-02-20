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

  getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  processInput(gl, key, position) {
    // console.log("Key Pressed: ", key);
    let speed = 20;
    switch (key) {
      case "w":
        position.y -= speed;
        break
      case "s":
        position.y += speed;
        break
      case "d":
        position.x += speed;
        break
      case "a":
        position.x -= speed;
        break
      case "t":
        position.x = 0;
        position.y = 0;
        break
    }
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

}