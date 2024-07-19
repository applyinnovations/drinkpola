import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loaderLabel = document.getElementById("loader-label");


THREE.DefaultLoadingManager.onStart = function(url, itemsLoaded, itemsTotal) {
	loaderLabel.innerText = "0%";
	console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

THREE.DefaultLoadingManager.onLoad = function() {
	loaderLabel.innerText = "100%";
	console.log('Loading Complete!');
};

THREE.DefaultLoadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
	loaderLabel.innerText = `${itemsLoaded / itemsTotal}%`;
	console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

THREE.DefaultLoadingManager.onError = function(url) {
	loaderLabel.innerText = "ERROR";
	console.log('There was an error loading ' + url);
};

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Instantiate a loader
const loader = new GLTFLoader();

const clock = new THREE.Clock({ autoStart: false });
let cameras = [], mixer;
// Load a glTF resource
loader.load(
	// resource URL
	'/models/animate.glb',
	// called when the resource is loaded
	function(gltf) {
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
		console.log({ animations: gltf.animations.length });
		mixer = new THREE.AnimationMixer(gltf.scene);
		gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
		console.log({ cameras: gltf.cameras.length });
		cameras = gltf.cameras;
		scene.add(gltf.scene);
	},
);

const animate = function() {
	requestAnimationFrame(animate);
	const camera = cameras[0];
	if (camera) {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		if (!clock.running) clock.start();
		const delta = clock.getDelta();
		if (mixer) mixer.update(delta);
		renderer.render(scene, camera);
	}
};
animate();
