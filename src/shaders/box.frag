varying vec2 vUv;
varying vec3 vPos;

void main() {
  float light = dot(vPos, vec3(5., 7., -10.)) * -0.05;
  vec3 color = vec3(1. * light * 1.2);
  gl_FragColor = vec4(color, 1.);
}