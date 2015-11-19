var gl = document.getElementById('canvas').getContext('webgl');

(function() {
  var vertexes = [+1.0, +1.0, 0.0,
                  -1.0, +1.0, 0.0,
                  -1.0, -1.0, 0.0,
                  +1.0, -1.0, 0.0];
  
  var polygons = [0, 2, 1,
                  0, 3, 2];
  
  window.addEventListener('load', function() {
    var vbo = utilities.createVbo(vertexes);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    var ibo = utilities.createIbo(polygons);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

    var texture = utilities.createTexture(document.getElementById('texture'));
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    var program = utilities.createProgram(utilities.createShader(document.getElementById('vert')), utilities.createShader(document.getElementById('frag')));
    gl.useProgram(program);
    
    var positionAttribLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);

    (function(z) {
      gl.uniform2fv(gl.getUniformLocation(program, 'resolution'), [512, 512]);
      gl.uniform1i(gl.getUniformLocation(program, 'texture'), 0);
      gl.uniform1f(gl.getUniformLocation(program, 'z'), z);

      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      gl.flush();

      setTimeout(arguments.callee, 1000.0 / 60.0, (z + 1) % 512);
    })(0);
  });
})();
