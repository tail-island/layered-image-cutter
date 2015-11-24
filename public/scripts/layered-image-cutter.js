var gl;

(function() {
  // キャンバス全体に画像を表示するために、全体を覆う板ポリゴンを使用します。
  var vertexes = [+1.0, +1.0, 0.0,
                  -1.0, +1.0, 0.0,
                  -1.0, -1.0, 0.0,
                  +1.0, -1.0, 0.0];
  var polygons = [0, 2, 1,
                  0, 3, 2];
  
  window.addEventListener('load', function() {
    var canvas = document.getElementById('canvas');
    gl = canvas.getContext('webgl');
    
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

      // 手のひらの位置を取得し、積層画像に対応する座標が-1.0〜+1.0になるように正規化します。
      var palmPosition = frame.hands[0].palmPosition;
      vec3.add(palmPosition, palmPosition, vec3.fromValues(0.0, -200.0, 0.0));
      vec3.divide(palmPosition, palmPosition, vec3.fromValues(100.0, 100.0, 100.0));
      vec3.negate(palmPosition, palmPosition);  // 「視点をどれだけ移動させるか」で表現したいので、反転します。

      // 手のひらが積層画像の中にない場合は、何もしません。
      for (var i = 0; i < 3; ++i) {
        if (palmPosition[i] < -1.0 || 1.0 < palmPosition[i]) {
          return;
        }
      }

      // 手のひらの法線と指先方向を取得します。
      var palmNormal = frame.hands[0].palmNormal;
      var palmDirection = frame.hands[0].direction;

      // 手のひらの位置と向きを表現する行列を作成します。
      var palmMatrix = mat4.create();
      mat4.lookAt(palmMatrix, vec3.fromValues(0.0, 0.0, 0.0), palmNormal, palmDirection);  // 指先方向を上において、手のひらの法線方向を見ます。
      mat4.translate(palmMatrix, palmMatrix, palmPosition);  // 手のひらの位置まで視点を移動します。
      mat4.invert(palmMatrix, palmMatrix);  // 今回は画面の座標をモデルの座標に変換するので、逆行列にしておきます。

      gl.uniformMatrix4fv(gl.getUniformLocation(program, 'palmMatrix'), false, palmMatrix);
      gl.uniform2fv(gl.getUniformLocation(program, 'resolution'), [canvas.width, canvas.height]);
      gl.uniform1i(gl.getUniformLocation(program, 'layeredImage'), 0);

      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      gl.flush();
    });
  });
})();
