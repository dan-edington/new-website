import './styles/index.scss';

import * as THREE from 'three';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const getSize = () => {
  return {
    w: window.innerWidth,
    h: window.innerHeight,
  };
};

const pr = 1;

const pcount = 1000;

const s = getSize();

const clock = new THREE.Clock();

const renderer = new THREE.WebGLRenderer({
  powerPreference: 'high-performance',
  alpha: true,
});

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(s.w, s.h);
renderer.setPixelRatio(pr);
document.body.appendChild(renderer.domElement);
renderer.domElement.id = 'gl';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, s.w / s.h, 0.1, 200);
camera.position.z = 2;

const createMesh = () => {
  const geometry = new THREE.BufferGeometry();

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });

  const particlemesh = new THREE.Points(geometry, material);

  const vertices = new Float32Array(pcount * 3);

  for (let i = 0; i < pcount; i++) {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    const z = Math.random() * 2 - 1;
    vertices.set([x, y, z], i * 3);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  return particlemesh;
};

const particlemesh = createMesh();

camera.lookAt(particlemesh.position);

scene.add(particlemesh, camera);

const handleResize = () => {
  const s = getSize();
  camera.aspect = s.w / s.h;
  camera.updateProjectionMatrix();
  renderer.setSize(s.w, s.h);
};

window.addEventListener('resize', handleResize);

const tick = () => {
  particlemesh.material.uniforms.uTime.value = clock.getElapsedTime();

  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

clock.start();

tick();
