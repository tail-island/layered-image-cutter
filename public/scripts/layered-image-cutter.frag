precision mediump float;

uniform vec2 resolution;
uniform sampler2D texture;
uniform float z;

void main(void){
  vec2 imagePosition = vec2(1.0 / 32.0, 1.0 / 16.0) * vec2(mod(z, 32.0), floor(z / 32.0));
  vec2 positionInImage = gl_FragCoord.xy / resolution / vec2(32.0, 16.0);
  
  gl_FragColor = texture2D(texture, imagePosition + positionInImage);
}
