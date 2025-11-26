import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Pane } from "tweakpane";

const appContainer = document.querySelector("#app");

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
appContainer.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0d12);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 25, 55);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;

const towerGroup = new THREE.Group();
scene.add(towerGroup);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
dirLight.position.set(25, 35, 15);
scene.add(dirLight);

const fillLight = new THREE.HemisphereLight(0xffffff, 0x1d2030, 0.7);
scene.add(fillLight);

const grid = new THREE.GridHelper(120, 30, 0x2c2f38, 0x13151b);
scene.add(grid);

const params = {
  floors: 32,
  floorHeight: 1.8,
  scaleMin: 4,
  scaleMax: 12,
  twistMin: -45,
  twistMax: 180,
  rotation: 0,
  colorBottom: "#2680ff",
  colorTop: "#fca311",
};

const pane = new Pane({ title: "Tower Controls", expanded: true });

function bindInput(key, config) {
  const binding = pane.addBinding(params, key, config);
  binding.on("change", (ev) => {
    if (ev.last) {
      rebuildTower();
    }
  });
}

bindInput("floors", { min: 5, max: 80, step: 1, label: "Floor Count" });
bindInput("floorHeight", { min: 0.8, max: 4, step: 0.1, label: "Floor Height" });
pane.addSeparator();
bindInput("scaleMin", { min: 1, max: 15, step: 0.1, label: "Scale Min" });
bindInput("scaleMax", { min: 1, max: 20, step: 0.1, label: "Scale Max" });
pane.addSeparator();
bindInput("twistMin", { min: -180, max: 0, step: 1, label: "Twist Min" });
bindInput("twistMax", { min: 0, max: 360, step: 1, label: "Twist Max" });
bindInput("rotation", { min: -180, max: 180, step: 1, label: "Tower Rotation" });
pane.addSeparator();
bindInput("colorBottom", { view: "color", label: "Color Bottom" });
bindInput("colorTop", { view: "color", label: "Color Top" });

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function rebuildTower() {
  while (towerGroup.children.length) {
    const child = towerGroup.children.pop();
    child.geometry.dispose();
    child.material.dispose();
  }

  const floors = Math.max(1, Math.floor(params.floors));
  const height = Math.max(0.1, params.floorHeight);
  const scaleMin = Math.max(0.2, Math.min(params.scaleMin, params.scaleMax));
  const scaleMax = Math.max(scaleMin, params.scaleMax);
  const twistMin = THREE.MathUtils.degToRad(params.twistMin);
  const twistMax = THREE.MathUtils.degToRad(params.twistMax);
  const rotation = THREE.MathUtils.degToRad(params.rotation);
  const bottomColor = new THREE.Color(params.colorBottom);
  const topColor = new THREE.Color(params.colorTop);

  const denom = Math.max(1, floors - 1);

  for (let i = 0; i < floors; i += 1) {
    const t = i / denom;
    const radius = lerp(scaleMin, scaleMax, t);
    const twist = lerp(twistMin, twistMax, t);
    const color = bottomColor.clone().lerp(topColor, t);

    const geometry = new THREE.CylinderGeometry(1, 1, 1, 64, 1, false);
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.45,
      metalness: 0.15,
    });
    const slab = new THREE.Mesh(geometry, material);

    slab.scale.set(radius, height, radius);
    slab.rotation.y = twist;
    slab.position.y = i * height + height * 0.5;

    towerGroup.add(slab);
  }

  towerGroup.rotation.y = rotation;
}

rebuildTower();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
