import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 });
const debugObject = {};
const settings = {
    isBoxVisible: false,
    isFogVisible: false
}


// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Fog
 */
// Geometry
const fogGeometry = new THREE.BoxGeometry(2,2,2)

// Material
const fogMaterial = new THREE.ShaderMaterial({
  //Nothing right now
})
// Fog mesh
const fog = new THREE.Mesh(fogGeometry, fogMaterial)





/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(3, 3, 512, 512);
// const waterGeometry = new THREE.SphereGeometry(1,30,30)
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

//Color
debugObject.depthColor = "#186691";
debugObject.surfaceColor = "#9bd8ff";

/**
 * MATERIALS
 */
// Water materials
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 1.0 },
    // big waves
    uBigWavesSpeed: { value: 0.75 },
    uBigWaveElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },

    // small waves
    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3.0 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4.0 },
    //colors
    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5 },
  },
});

console.log(waterMaterial);

// Box materials
const boxMaterial = new THREE.MeshBasicMaterial({
  color: "blue",
});

gui
  .add(waterMaterial.uniforms.uBigWaveElevation, "value")
  .step(0.001)
  .min(0)
  .max(1.0)
  .name("uBigWaveElevation");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
  .step(0.001)
  .min(0)
  .max(10.0)
  .name("uBigWavesFrequencyX");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
  .step(0.001)
  .min(0)
  .max(10.0)
  .name("uBigWavesFrequencyZ");
gui
  .add(waterMaterial.uniforms.uBigWavesSpeed, "value")
  .step(0.001)
  .min(0)
  .max(4)
  .name("uBigWavesSpeed");
gui
  .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
  .step(0.001)
  .min(0)
  .max(4)
  .name("uSmallWavesElevation");
gui
  .add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
  .step(0.001)
  .min(0)
  .max(10)
  .name("uSmallWavesFrequency");
gui
  .add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
  .step(0.001)
  .min(0)
  .max(3)
  .name("uSmallWavesSpeed");
gui
  .add(waterMaterial.uniforms.uSmallWavesIterations, "value")
  .step(1)
  .min(0)
  .max(30)
  .name("uSmallWavesIterations");

gui
  .addColor(debugObject, "depthColor")
  .name("depthColor")
  .onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
  });

gui
  .addColor(debugObject, "surfaceColor")
  .name("surfaceColor")
  .onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
  });
gui
  .add(waterMaterial.uniforms.uColorOffset, "value")
  .step(0.001)
  .min(0)
  .max(1.0)
  .name("uColorOfset");
gui
  .add(waterMaterial.uniforms.uColorMultiplier, "value")
  .step(0.001)
  .min(0)
  .max(10.0)
  .name("uColorMultiplier");


// Meshes

const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);


// Box
const box = new THREE.Mesh(cubeGeometry, boxMaterial);

gui.add(settings, 'isBoxVisible').onChange((val)=>{
    if (val) {
        // Show the cube
        scene.add(box);
      } else {
        // Hide the cube
        scene.remove(box);
      }

})
gui.add(settings, 'isFogVisible').onChange((val)=>{
    if (val) {
        // Show the cube
       scene.add(fog);
      } else {
        // Hide the cube
        scene.remove(fog);
      }

})



/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //update water uTime
  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
