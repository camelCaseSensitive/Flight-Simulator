const vert = `
  attribute vec3 aPosition;
  attribute vec3 aNormal;
  attribute vec2 aTexCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat3 uNormalMatrix;

  varying highp vec2 vVertTexCoord;

  void main(void) {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
    vVertTexCoord = aTexCoord;
  }
`
const frag = `
  precision highp float;

  varying highp vec2 vVertTexCoord;

  uniform sampler2D color;
  uniform sampler2D depth;

  void main() {
    vec2 uv = vVertTexCoord;
    vec4 texColor = texture2D(color, uv);
    vec4 texDepth = texture2D(depth, uv);
    // gl_FragColor = vec4(texColor.r, texColor.g, texColor.b, 1.0);
    float fog = texDepth.r;
    gl_FragColor = vec4(texColor.r * fog, texColor.g * fog, texColor.b * fog, 1.0 - texDepth.r * 0.95);
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0);
  }
`