"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 1500;

export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let mouseX = 0;
    let mouseY = 0;
    let animationId: number;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Clear any previous canvas
    if (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    // Create Indigo Plus Sign Texture (+) - Original Color
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(32, 10);
    ctx.lineTo(32, 54);
    ctx.moveTo(10, 32);
    ctx.lineTo(54, 32);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const originals = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      const val = (Math.random() - 0.5) * 40;
      positions[i] = val;
      originals[i] = val;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      map: texture,
      size: 0.2, // Back to original size
      transparent: true,
      opacity: 0.6, // Back to original opacity
      sizeAttenuation: true,
      alphaTest: 0.05,
    });

    const cloud = new THREE.Points(geometry, material);
    scene.add(cloud);

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.0005; // Original timing constant

      const posAttr = geometry.attributes.position;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;

        // Fluid drift logic (Original values from main.js)
        const driftX = Math.sin(time + originals[i3 + 1] * 0.5) * 0.5;
        const driftY = Math.cos(time + originals[i3] * 0.5) * 0.5;

        const mx = mouseX * 15;
        const my = -mouseY * 15;
        const dx = originals[i3] - mx;
        const dy = originals[i3 + 1] - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let fx = 0,
          fy = 0;
        if (dist < 5) {
          // Original distance limit
          const power = (5 - dist) / 5;
          fx = dx * power * 0.5; // Original force power
          fy = dy * power * 0.5;
        }

        posArray[i3] = originals[i3] + driftX + fx;
        posArray[i3 + 1] = originals[i3 + 1] + driftY + fy;
      }

      posAttr.needsUpdate = true;
      cloud.rotation.y += 0.0005; // Original rotation speed

      // Camera Damping
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 3 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div id="canvas-container" ref={containerRef} />;
}
