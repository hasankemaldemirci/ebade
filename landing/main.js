let scene, camera, renderer, cloud;
const PARTICLE_COUNT = 1500;
const CONNECT_DISTANCE = 2.5;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 10;

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById("canvas-container").appendChild(renderer.domElement);

  // Create Plus Sign Texture (+)
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#4f46e5";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(32, 10);
  ctx.lineTo(32, 54);
  ctx.moveTo(10, 32);
  ctx.lineTo(54, 32);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);

  // Stabilized Particle Data
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const originalPositions = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
    const val = (Math.random() - 0.5) * 40;
    positions[i] = val;
    originalPositions[i] = val;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    map: texture,
    size: 0.2, // Slightly larger for visibility
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    alphaTest: 0.05,
  });

  cloud = new THREE.Points(geometry, material);
  cloud.userData.originalPositions = originalPositions;
  scene.add(cloud);

  animate();
}

let mouseX = 0,
  mouseY = 0;
document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animate() {
  requestAnimationFrame(animate);

  const posAttr = cloud.geometry.attributes.position;
  const positions = posAttr.array;
  const originals = cloud.userData.originalPositions;
  const time = Date.now() * 0.0005;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;

    // Fluid, non-shaking drift
    // We calculate offset FROM original position to avoid feedback jitters
    const driftX = Math.sin(time + originals[i3 + 1] * 0.5) * 0.5;
    const driftY = Math.cos(time + originals[i3] * 0.5) * 0.5;

    // Mouse Interaction (Smoother Repulsion)
    const worldMouseX = mouseX * 15;
    const worldMouseY = -mouseY * 15;

    const dx = originals[i3] - worldMouseX;
    const dy = originals[i3 + 1] - worldMouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let forceX = 0,
      forceY = 0;
    if (dist < 5) {
      const power = (5 - dist) / 5;
      forceX = dx * power * 0.5;
      forceY = dy * power * 0.5;
    }

    positions[i3] = originals[i3] + driftX + forceX;
    positions[i3 + 1] = originals[i3 + 1] + driftY + forceY;
  }

  posAttr.needsUpdate = true;
  cloud.rotation.y += 0.0005;

  // Cinematic Camera
  camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
  camera.position.y += (-mouseY * 3 - camera.position.y) * 0.02;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Scroll Reveal Logic
document.addEventListener("DOMContentLoaded", () => {
  init();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll("section, .code-card, .stat").forEach((el) => {
    el.classList.add("reveal-on-scroll");
    observer.observe(el);
  });
});
