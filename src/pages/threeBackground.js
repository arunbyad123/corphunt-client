import * as THREE from "three";

export default function initThreeBackground() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("three-bg").appendChild(renderer.domElement);

  // Geometry + Material
  const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00bcd4,
    wireframe: true,
  });

  const torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);

  // Light
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(25, 25, 25);
  scene.add(pointLight);

  camera.position.z = 50;

  function animate() {
    requestAnimationFrame(animate);
    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();

  //Handle resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
