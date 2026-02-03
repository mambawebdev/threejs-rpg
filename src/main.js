import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { World } from './world';
import { Player } from './player';

const gui = new GUI();
const stats = new Stats();
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);

const world = new World(10, 10);
scene.add(world);

const player = new Player();
scene.add(player);

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

const worldFolder = gui.addFolder("World");
worldFolder.add(world, 'width', 1, 20, 1).name('Width');
worldFolder.add(world, 'height', 1, 20, 1).name('Height');
worldFolder.add(world, 'treeCount', 1, 100, 1).name('Tree Count');
worldFolder.add(world, 'rockCount', 1, 100, 1).name('Rock Count');
worldFolder.add(world, 'bushCount', 1, 100, 1).name('Bush Count');

worldFolder.addColor(world.terrainMaterial, 'color').name('Color');

worldFolder.add(world, 'generate').name('Generate World');