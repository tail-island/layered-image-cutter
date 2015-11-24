precision mediump float;

uniform mat4 palmMatrix;
uniform vec2 resolution;
uniform sampler2D layeredImage;

void main(void) {
  // フラグメントの位置を計算し、積層画像に対応する位置が0.0以上1.0未満になるように正規化します。
  vec3 fragmentPosition = ((palmMatrix * vec4((gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y), 0.0, 1.0) + vec4(1.0)) * 0.5).xyz;

  // フラグメントが積層画像の中にない場合は、背景色を表示します。
  if (fragmentPosition.x < 0.0 || 1.0 <= fragmentPosition.x ||
      fragmentPosition.y < 0.0 || 1.0 <= fragmentPosition.y ||
      fragmentPosition.z < 0.0 || 1.0 <= fragmentPosition.z)
  {
    gl_FragColor = vec4(0.2, 0.0, 0.0, 1.0);
    return;
  }
  
  // 表示すべき画像の位置を、z座標から計算します。
  float index = floor(fragmentPosition.z * 256.0);
  vec2 imagePosition = vec2(mod(index, 16.0), floor(index / 16.0)) / vec2(16.0, 16.0);

  // 表示する画像の中での位置を、x座標とy座標から計算します。
  vec2 positionInImage = fragmentPosition.xy / vec2(16.0, 16.0);

  // 積層画像の対応する位置のピクセルを表示します。
  gl_FragColor = texture2D(layeredImage, imagePosition + positionInImage);
}
