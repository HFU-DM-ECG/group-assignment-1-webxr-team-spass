import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {ARButton} from './ARButton.js';

// camera configuration
const FOV = 75;
const near_plane = 0.1;
const far_plane = 1000;

// scene
const scene = new THREE.Scene();
scene.position.z = -3;
scene.scale.divideScalar(3);
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, near_plane, far_plane);

// time
var time = Date.now() / 1000;

// light
/// light from the sky
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemisphereLight.color.setHSL(0.6, 1, 1);
hemisphereLight.groundColor.setHSL(0.095, 1, 0.75);
hemisphereLight.position.set(0, 10, 0);
scene.add(hemisphereLight)
const hemiLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 1);
hemiLightHelper.visible = false;
scene.add(hemiLightHelper);

/// light from the sun
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.color.setHSL(0.9, 1, 0.9);
directionalLight.position.set(-2.5, 10, -2.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 2048
scene.add(directionalLight);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
directionalLightHelper.visible = false;
scene.add(directionalLightHelper);

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
var dom = renderer.domElement;
renderer.xr.enabled = true;
document.body.appendChild(dom);
document.body.appendChild(ARButton.createButton(renderer));


// object loading
const island1 = new THREE.Object3D();
const island2 = new THREE.Object3D();
const island3 = new THREE.Object3D();
const airship = new THREE.Object3D();
const loader = new GLTFLoader();

var flightMode = false;

// loading in the 3D models, saving them into usable variables and adding them to the scene.
loader.load('models/insel.glb', function (gltf) {
    // its always children[0] because the child gets removed from gltf.scene once you add it to the actual scene
    island1.add(gltf.scene.children[0]); 
    island1.children[0].children[0].castShadow = true;
    island1.children[0].children[0].receiveShadow = true;
    island1.name = "island1";
    scene.add(island1);

    island2.add(gltf.scene.children[0]);
    island2.children[0].children[0].castShadow = true;
    island2.children[0].children[0].receiveShadow = true;
    island2.name = "island2";
    scene.add(island2);

    island3.add(gltf.scene.children[0]);
    island3.children[0].children[0].castShadow = true;
    island3.children[0].children[0].receiveShadow = true;
    island3.name = "island3";
    scene.add(island3);
    island1.scale.set(3, 3, 3);
    island2.scale.set(3, 3, 3);
    island3.scale.set(3, 3, 3);

}, undefined, function (error) {
    console.error(error);
});

loader.load('models/airship.glb', function (gltf) {
    airship.add(gltf.scene.children[0]);
    airship.name = "airship";
    airship.children[0].children[0].castShadow = true;
    airship.children[0].children[0].receiveShadow = true;
    scene.add(airship);
    airship.scale.set(2, 2, 2);
    airship.rotateY(-1.49);
}, undefined, function (error) {
    console.error(error);
});

// object floating up and down
function floating(object, floatingFrequency, amplitude, currentTime) { 
    const scalingFactor = 1 / 1000;
    var midPosition = object.position.y;
    object.position.y = midPosition + (Math.sin(currentTime * floatingFrequency) * scalingFactor * amplitude);
}

// sun cycling around the islands
function sunCycle(object, floatingFrequency, amplitude, currentTime) {
    // rotating the light around
    const scalingFactor = 1 / 750;
    var positionX = object.position.x;
    var positionY = object.position.y;
    var positionZ = object.position.z;
    object.position.x = positionX + (Math.sin(currentTime * floatingFrequency) * scalingFactor * amplitude);
    object.position.y = positionY + (Math.sin(currentTime * floatingFrequency) * scalingFactor * amplitude);
    object.position.z = positionZ + (Math.cos(currentTime * floatingFrequency) * scalingFactor * amplitude);

    // change light intensity based on sun position
    var hemisphereLightValue = positionY * amplitude * scalingFactor;
    hemisphereLight.color.setHSL(0.6, 1, hemisphereLightValue);
    hemisphereLight.groundColor.setHSL(0.1, 1, hemisphereLightValue);
}

// flying around with an object tied to the camera
function fly(object) {
    // offset relative to camera
    const offsetVector = new THREE.Vector3(-0.25, -1.3, -0.25); 
    offsetVector.applyQuaternion(camera.quaternion);
    object.position.x = camera.position.x + offsetVector.x;
    object.position.y = camera.position.y + offsetVector.y;
    object.position.z = camera.position.z + offsetVector.z;
    //object.quaternion.y = camera.quaternion.y;
    object.setRotationFromQuaternion(camera.quaternion);
}

// objectswitching between flying in circles and staying at one position for equal times
function flyLoop(object, midPosition, currentTime, timescale, x_amp, y_amp, z_amp) { 
    if (Math.sin(currentTime * timescale / 2) > 0) {
        const oldPosition = new THREE.Vector3(object.position.x, object.position.y, object.position.z);

        object.position.x = midPosition.x + Math.sin(currentTime * timescale) * x_amp;
        object.position.y = midPosition.y + Math.cos(currentTime * timescale) * y_amp;
        object.position.z = midPosition.z + Math.cos(currentTime * timescale) * z_amp - z_amp;

        object.lookAt(oldPosition);
    } else {
        object.position.x = midPosition.x + Math.sin(0) * x_amp;
        object.position.y = midPosition.y + Math.cos(0) * y_amp;
        object.position.z = midPosition.z + Math.cos(0) * z_amp - z_amp;
    }
}

function animate() {
    // time management
    /// scaling to seconds
    const currentTime = Date.now() / 1000; 
    time = currentTime;

    // animation: islands floating up and down in different intervals
    floating(island1, 1, 1, time);
    floating(island2, 1.5, 1, time);
    floating(island3, 2.2, 2, time);

    // animation: sun moving in the sky to create shadows on the objects
    //sunCycle(directionalLight, 0.75, 45, time);

    // toggle mode : toggle between flying around with the airship yourself and watching it fly in circles around the islands
    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        if (keyCode == 32) {
            flightMode = !flightMode;
        }
    }
    if (flightMode) {
        // flight-mode
        fly(airship);
    } else {
        // loop animation
        flyLoop(airship, new THREE.Vector3(-4.15, 1, 4.7), time, .5, 6, .5, 5);
    }

    // rendering
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
}
renderer.setAnimationLoop( function () {
    renderer.render(scene, camera);
})

/*
// listener to toggle visibility of the lights on keypress
document.addEventListener("keypress", (e) => {
    if (e.code == "KeyL") {
        directionalLightHelper.visible = !directionalLightHelper.visible;
        hemiLightHelper.visible = !hemiLightHelper.visible;
    }
});
*/

animate();