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

    Leap.loop(function(frame) {
      if (frame.hands.length == 0) {
        return;
      }

      var palmPosition = frame.hands[0].palmPosition;
      vec3.add(palmPosition, palmPosition, vec3.fromValues(0.0, -200.0, 0.0));
      vec3.divide(palmPosition, palmPosition, vec3.fromValues(100.0, 100.0, 100.0));

      for (var i = 0; i < 3; ++i) {
        if (palmPosition[i] < -1.0 || 1.0 < palmPosition[i]) {
          return;
        }
      }

      vec3.negate(palmPosition, palmPosition);
      
      var palmNormal = frame.hands[0].palmNormal;
      var palmDirection = frame.hands[0].direction;

      var palmMatrix = mat4.create();
      mat4.lookAt(palmMatrix, vec3.fromValues(0.0, 0.0, 0.0), palmNormal, palmDirection);
      mat4.translate(palmMatrix, palmMatrix, palmPosition);
      mat4.invert(palmMatrix, palmMatrix);

      gl.uniformMatrix4fv(gl.getUniformLocation(program, 'palmMatrix'), false, palmMatrix);
      gl.uniform2fv(gl.getUniformLocation(program, 'resolution'), [512, 512]);
      gl.uniform1i(gl.getUniformLocation(program, 'layeredImage'), 0);

      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      gl.flush();
    });
  });
})();
