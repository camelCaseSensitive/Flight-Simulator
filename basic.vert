varying vec2 vUv;
varying float h;
attribute vec2 aTexCoord;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
attribute vec4 aPosition;
uniform sampler2D elev;
void main() {
  vUv = aTexCoord;
  float z = texture2D(elev,vec2((aPosition.x + 0.5), aPosition.y + 0.5)).r * 10.;
  h = z;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition.x, aPosition.y, aPosition.z + z, aPosition.w);

}