import './styles/index.scss';

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js';

import boxVert from './shaders/box.vert';
import boxFrag from './shaders/box.frag';

const getSize = () => {
  return {
    w: window.innerWidth * 0.5,
    h: window.innerHeight,
  };
};

const s = getSize();

const clock = new THREE.Clock();

const renderer = new THREE.WebGLRenderer({
  powerPreference: 'high-performance',
  alpha: true,
});

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(s.w, s.h);
renderer.setPixelRatio(1);
document.body.appendChild(renderer.domElement);
renderer.domElement.id = 'gl';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, s.w / s.h, 0.1, 200);
camera.position.z = 2;

const box = new THREE.Mesh(
  new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1),
  new THREE.ShaderMaterial({
    vertexShader: boxVert,
    fragmentShader: boxFrag,
  }),
);

scene.add(box, camera);

const handleResize = () => {
  const s = getSize();
  camera.aspect = s.w / s.h;
  camera.updateProjectionMatrix();
  renderer.setSize(s.w, s.h);
  effectComposer.setSize(s.w, s.h);
};

window.addEventListener('resize', handleResize);

const effectComposer = new EffectComposer(renderer);
effectComposer.setPixelRatio(1);
effectComposer.setSize(s.w, s.h);

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const dotScreenPass = new DotScreenPass();
effectComposer.addPass(dotScreenPass);

const tick = () => {
  box.rotation.y = Math.sin(clock.getElapsedTime() * 0.5);
  box.rotation.z = Math.sin(clock.getElapsedTime() * 0.25);

  effectComposer.render();

  requestAnimationFrame(tick);
};

clock.start();

tick();
