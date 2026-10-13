import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

const canvas = document.querySelector('#hero-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x070914, 0.045);
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 0, 8.4);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

scene.add(new THREE.AmbientLight(0x8296ff, 1.15));
const cyanLight = new THREE.PointLight(0x5effef, 38, 20); cyanLight.position.set(3, 2, 4); scene.add(cyanLight);
const violetLight = new THREE.PointLight(0x7760ff, 36, 20); violetLight.position.set(-3, -1, 3); scene.add(violetLight);
const whiteLight = new THREE.PointLight(0xffffff, 15, 16); whiteLight.position.set(0, 4, -2); scene.add(whiteLight);

const sculpture = new THREE.Group(); scene.add(sculpture);
const coreGeo = new THREE.IcosahedronGeometry(1.04, 5);
const coreMat = new THREE.MeshPhysicalMaterial({ color: 0x7a9fff, metalness: .68, roughness: .17, transmission: .22, thickness: 1.4, clearcoat: 1, clearcoatRoughness: .1, emissive: 0x111b66, emissiveIntensity: .7 });
const core = new THREE.Mesh(coreGeo, coreMat); sculpture.add(core);
const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.11, 2), new THREE.MeshBasicMaterial({ color: 0x87fff3, wireframe: true, transparent: true, opacity: .34 })); sculpture.add(wire);

const torusA = new THREE.Mesh(new THREE.TorusGeometry(1.65, .018, 8, 180), new THREE.MeshStandardMaterial({ color: 0x7efff1, metalness: .7, roughness: .22, emissive: 0x2d938e, emissiveIntensity: .65 })); torusA.rotation.set(.8, .25, -.4); sculpture.add(torusA);
const torusB = new THREE.Mesh(new THREE.TorusGeometry(2.0, .009, 6, 200), new THREE.MeshBasicMaterial({ color: 0xb19aff, transparent: true, opacity: .8 })); torusB.rotation.set(1.45, .2, .35); sculpture.add(torusB);
const torusC = new THREE.Mesh(new THREE.TorusGeometry(1.35, .012, 6, 160), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .4 })); torusC.rotation.set(.2, 1.15, .7); sculpture.add(torusC);

// Fine orbital particles give the sculpture depth without heavy assets.
const particleCount = 1500;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  const radius = 2.15 + Math.random() * 3.8;
  const theta = Math.random() * Math.PI * 2;
  const u = Math.random() * 2 - 1;
  const spread = Math.sqrt(1 - u * u);
  positions[i * 3] = radius * spread * Math.cos(theta);
  positions[i * 3 + 1] = radius * u;
  positions[i * 3 + 2] = radius * spread * Math.sin(theta);
  const t = Math.random(); colors[i * 3] = .28 + .55 * t; colors[i * 3 + 1] = .6 + .4 * t; colors[i * 3 + 2] = .8 + .2 * Math.random();
}
const particleGeo = new THREE.BufferGeometry(); particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3)); particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ size: .018, vertexColors: true, transparent: true, opacity: .86, sizeAttenuation: true })); scene.add(particles);

// Thin orbit markers and a floating wireframe satellite.
const satellite = new THREE.Group();
const satBody = new THREE.Mesh(new THREE.BoxGeometry(.19, .19, .19), new THREE.MeshStandardMaterial({ color: 0xe5f9ff, metalness: .7, roughness: .22, emissive: 0x2a6471, emissiveIntensity: .5 })); satellite.add(satBody);
const panelMat = new THREE.MeshStandardMaterial({ color: 0x7565d9, metalness: .4, roughness: .3, emissive: 0x312777, emissiveIntensity: .5 });
for (const side of [-1, 1]) { const panel = new THREE.Mesh(new THREE.BoxGeometry(.42, .025, .2), panelMat); panel.position.x = side * .31; satellite.add(panel); }
satellite.position.set(2.15, 1.2, .25); scene.add(satellite);

let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0, isDragging = false, previousX = 0, previousY = 0;
canvas.addEventListener('pointerdown', e => { isDragging = true; previousX = e.clientX; previousY = e.clientY; canvas.setPointerCapture?.(e.pointerId); });
canvas.addEventListener('pointermove', e => {
  const rect = canvas.getBoundingClientRect(); pointerX = ((e.clientX - rect.left) / rect.width - .5) * 2; pointerY = ((e.clientY - rect.top) / rect.height - .5) * 2;
  if (isDragging) { targetY += (e.clientX - previousX) * .006; targetX += (e.clientY - previousY) * .004; previousX = e.clientX; previousY = e.clientY; }
});
const endDrag = () => { isDragging = false; };
canvas.addEventListener('pointerup', endDrag); canvas.addEventListener('pointercancel', endDrag); canvas.addEventListener('pointerleave', endDrag);

function resize() { const rect = canvas.getBoundingClientRect(); if (!rect.width || !rect.height) return; camera.aspect = rect.width / rect.height; camera.position.z = window.innerWidth < 680 ? 9.4 : 8.4; camera.updateProjectionMatrix(); renderer.setSize(rect.width, rect.height, false); }
window.addEventListener('resize', resize); resize();
const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();
  sculpture.rotation.y += .0025; sculpture.rotation.x += (targetX * .22 - sculpture.rotation.x) * .035; sculpture.rotation.y += (targetY * .22 - sculpture.rotation.y) * .035;
  core.rotation.y = t * .13; core.rotation.x = Math.sin(t * .23) * .12;
  wire.rotation.y = -t * .08; wire.rotation.z = t * .045;
  torusA.rotation.z = -.4 + t * .09; torusB.rotation.x = 1.45 + Math.sin(t * .16) * .15; torusC.rotation.y = 1.15 + t * .07;
  particles.rotation.y = t * .012; particles.rotation.x = Math.sin(t * .09) * .025;
  satellite.position.y = 1.2 + Math.sin(t * .8) * .13; satellite.rotation.x = t * .2; satellite.rotation.y = t * .27;
  camera.position.x += (pointerX * .28 - camera.position.x) * .018; camera.position.y += (-pointerY * .2 - camera.position.y) * .018; camera.lookAt(0, 0, 0);
  renderer.render(scene, camera); requestAnimationFrame(animate);
}
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) animate(); else renderer.render(scene, camera);

// Navigation on small screens.
const menuButton = document.querySelector('.menu-toggle'); const nav = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); menuButton.textContent = open ? '×' : '☰'; });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.textContent = '☰'; }));

// Scroll reveals and subtle count-up.
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const themes = {
  robotics: { label: 'ROBOTICS', core: 0x7a9fff, emissive: 0x111b66, ring: 0x7efff1, light: 0x5effef },
  space: { label: 'SPACE TECH', core: 0xa18aff, emissive: 0x29115f, ring: 0xc5a3ff, light: 0x9273ff },
  ai: { label: 'ARTIFICIAL INTELLIGENCE', core: 0xffb58d, emissive: 0x5c1c3b, ring: 0xffc1a3, light: 0xff9c7b },
  energy: { label: 'FUTURE ENERGY', core: 0xc8ff8c, emissive: 0x234d23, ring: 0xc5ff7c, light: 0xb6ff70 }
};
document.querySelectorAll('.frontier-card').forEach(card => card.addEventListener('click', () => {
  document.querySelectorAll('.frontier-card').forEach(item => item.classList.remove('active')); card.classList.add('active');
  const theme = themes[card.dataset.theme]; document.querySelector('#theme-status').textContent = `CURRENT TRAJECTORY: ${theme.label}`;
  coreMat.color.setHex(theme.core); coreMat.emissive.setHex(theme.emissive); torusA.material.color.setHex(theme.ring); cyanLight.color.setHex(theme.light); violetLight.color.setHex(theme.core);
  document.querySelector('.scene-wrap').animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.45)' }, { filter: 'brightness(1)' }], { duration: 600, easing: 'ease-out' });
}));
