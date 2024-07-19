import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
	'/models/scene.gltf',
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
	// called while loading is progressing
	function(xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	},
	// called when loading has errors
	function(error) {
		console.error(error);
	}
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
