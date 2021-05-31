import './styles/index.scss';

import * as THREE from 'three';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const particles = () => {
  let shouldAnimate = true;
  const glContainer = document.getElementById('glContainer');
  const pixelRatio = 1;
  const particleCount = 1000;
  const clock = new THREE.Clock();

  // Test for prefers-reduced-motion

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion)');

  if (prefersReducedMotion.matches) {
    shouldAnimate = false;
  }

  // Setup renderer

  const getSize = () => {
    return {
      w: glContainer?.offsetWidth || 0,
      h: glContainer?.offsetHeight || 0,
    };
  };

  const size = getSize();

  const renderer = new THREE.WebGLRenderer({
    powerPreference: 'high-performance',
    alpha: true,
  });

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setSize(size.w, size.h);
  renderer.setPixelRatio(pixelRatio);
  glContainer?.appendChild(renderer.domElement);

  // Setup Camera

  const zoom = 600;
  const camera = new THREE.PerspectiveCamera(75, size.w / size.h, 0.1, 600);
  camera.position.z = zoom;
  camera.fov = Math.atan(size.h / 2 / zoom) * 2 * (180 / Math.PI);

  // Generate particles

  const generateParticles = () => {
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

    const vertices = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      const z = Math.random() * 2 - 1;
      vertices.set([x, y, z], i * 3);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    return particlemesh;
  };

  const particleMesh = generateParticles();
  particleMesh.position.set(0, 0, 597);

  const scene = new THREE.Scene();
  scene.add(particleMesh, camera);

  // Setup resize

  const resize = () => {
    const s = getSize();
    renderer.setSize(s.w, s.h);
    camera.aspect = s.w / s.h;
    camera.updateProjectionMatrix();
  };

  window.addEventListener('resize', resize);

  const tick = () => {
    particleMesh.material.uniforms.uTime.value = shouldAnimate
      ? clock.getElapsedTime()
      : Math.random() * 9;

    renderer.render(scene, camera);

    if (shouldAnimate) {
      requestAnimationFrame(tick);
    }
  };

  clock.start();

  tick();
};

window.addEventListener('load', particles);
