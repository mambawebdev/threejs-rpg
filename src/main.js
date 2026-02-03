import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Terrain } from './terrain';

const gui = new GUI();
const stats = new Stats();
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);

const terrain = new Terrain(10, 5);
scene.add(terrain);

const sun = new THREE.DirectionalLight();
sun.intensity = 3;
sun.position.set(1, 2, -1);
scene.add(sun);

const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 0.2;
scene.add(ambientLight);

// Better camera positioning
camera.position.set(15, 10, 15); 
// Look at center of terrain
controls.target.set(0, 0, 0); 
// Prevent getting too close
controls.minDistance = 5; 
// Prevent going too far
controls.maxDistance = 50; 
// Prevent going below ground
controls.maxPolarAngle = Math.PI / 2 - 0.1; 
// Smooth camera movement
controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.update();

function animate() {
  controls.update();
  stats.update();
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const terrainFolder = gui.addFolder("Terrain");
terrainFolder.add(terrain, 'width', 1, 20, 1).name('Width');
terrainFolder.add(terrain, 'height', 1, 20, 1).name('Height');

terrainFolder.addColor(terrain.terrainMaterial, 'color').name('Color');
terrainFolder.onChange(() => {
    terrain.createTerrain();
});