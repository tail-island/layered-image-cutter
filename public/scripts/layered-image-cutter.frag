precision mediump float;

uniform mat4 palmMatrix;
uniform vec2 resolution;
uniform sampler2D layeredImage;

void main(void) {
  vec4 vertexPosition = (palmMatrix * vec4((gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y), 0.0, 1.0) + vec4(1.0)) * 0.5;
  if (0.0 < vertexPosition.x && vertexPosition.x < 1.0 &&
      0.0 < vertexPosition.y && vertexPosition.y < 1.0 &&
      0.0 < vertexPosition.z && vertexPosition.z < 1.0)
  {
    float imageIndex = floor(vertexPosition.z * 512.0);
    vec2 imagePosition = vec2(mod(imageIndex, 32.0), floor(imageIndex / 32.0)) * vec2(1.0 / 32.0, 1.0 / 16.0);

    vec2 positionInImage = vertexPosition.xy / vec2(32.0, 16.0);
  
    gl_FragColor = texture2D(layeredImage, imagePosition + positionInImage);
    
  } else {
    gl_FragColor = vec4(0.2, 0.0, 0.0, 1.0);
  }
}
