var utilities = (function() {
  var exports = {};

  exports.createVbo = function(data) {
    var vbo = gl.createBuffer();
        
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    
    return vbo;
  };

  exports.createIbo = function(data) {
    var ibo = gl.createBuffer();
        
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
    
    return ibo;
  };

  exports.createTexture = function(imageElement) {
    var texture = gl.createTexture();
    
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageElement);
    
    return texture;
  };

  exports.createShader = function(shaderElement) {
    var shader = gl.createShader((function() {
      switch (shaderElement.type) {
      case 'x-shader/x-vertex':
        return gl.VERTEX_SHADER;
      case 'x-shader/x-fragment':
        return gl.FRAGMENT_SHADER;
      }
    })());

    gl.shaderSource(shader, shaderElement.text);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader));
    }

    return shader;
  };

  exports.createProgram = function(vert, frag) {
    var program = gl.createProgram();
    
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
    }

    return program;
  };
  
  exports.clearScreen = function() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };
  
  return exports;
})();
