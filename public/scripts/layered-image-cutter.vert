attribute vec3 position;

void main(void) {
  // 今回は処理をフラグメント・シェーダーで実施しますので、バーテックス・シェーダーでは何もしません。
  gl_Position = vec4(position, 1.0);
}
