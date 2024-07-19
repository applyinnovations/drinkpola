import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

// Instantiate a loader
const loader = new GLTFLoader();

const newMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

let model;
// Load a glTF resource
loader.load(
	// resource URL
	'/models/modifiers.glb',
	// called when the resource is loaded
	function(gltf) {
		gltf.scene.traverse((child) => {
			if (child.isMesh) {
				child.material = newMaterial;
			}
		});
		model = gltf.scene;
		scene.add(model);
		console.log(gltf.cameras.length);
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

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

camera.position.z = 0.5;

const animate = function() {
	requestAnimationFrame(animate);
	if (model) {
		// model.rotation.x += 0.01; // Rotate around X axis
		model.rotation.y += 0.01; // Rotate around Y axis
		//	model.rotation.z += 0.01; // Rotate around Z axis
	}
	renderer.render(scene, camera);
};

animate();
