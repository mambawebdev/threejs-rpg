import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module'
import {GUI} from "three/addons/libs/lil-gui.module.min.js"
import { Terrain } from './terrain'

const gui = new GUI();


const stats = new Stats();
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const controls = new OrbitControls( camera, renderer.domElement );

const terrain = new Terrain(10, 5);
scene.add(terrain);



const sun = new THREE.DirectionalLight();
sun.position.set(1, 2, -1);
scene.add(sun);

const ambientLight = new THREE.AmbientLight();
// No direction. All geometry gets lit up uniformly
ambientLight.intensity = 0.2;
scene.add(ambientLight);
controls.update();



camera.position.z = 5;

function animate() {
  controls.update();
  stats.update();
  renderer.render( scene, camera );
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

const terrainFolder = gui.addFolder("Terrain");
terrainFolder.add(terrain, 'width', 1, 20, 1).name('Width');
terrainFolder.add(terrain, 'height', 1, 20, 1).name('Height');
terrainFolder.addColor(terrain.material, 'color').name('Color');
terrainFolder.onChange(() => {
    terrain.createGeometry();
})