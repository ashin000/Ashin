import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Particle network component that handles physics and rendering
function ParticleNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { mouse } = useThree();

  const particleCount = 45;
  const maxDistance = 2.4;

  // Initialize particles with positions and velocities
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Spread nodes in 3D space
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 2;

      // Small velocities
      vel[i * 3] = (Math.random() - 0.5) * 0.006;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.006;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.006;
    }
    return [pos, vel];
  }, [particleCount]);

  // Buffer attributes for connections (lines)
  const [linePositions, lineColors] = useMemo(() => {
    // Max lines = N * (N - 1) / 2. We allocate space for a reasonable subset
    const maxLines = 120;
    const pos = new Float32Array(maxLines * 2 * 3); // 2 points per line, 3 coords per point
    const col = new Float32Array(maxLines * 2 * 3); // RGB colors for gradient fade
    return [pos, col];
  }, []);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    const pointsGeom = pointsRef.current.geometry;
    const linesGeom = linesRef.current.geometry;

    const posArray = pointsGeom.attributes.position.array as Float32Array;
    const linePosArray = linesGeom.attributes.position.array as Float32Array;
    const lineColorArray = linesGeom.attributes.color.array as Float32Array;

    let lineIndex = 0;
    const maxLinesLimit = 250;

    // Convert normalized mouse coordinates (-1 to 1) to three.js coordinates
    // Based on average viewport size
    const mouseX = mouse.x * 5;
    const mouseY = mouse.y * 3;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;

      // Move particle
      posArray[idx] += velocities[idx];
      posArray[idx + 1] += velocities[idx + 1];
      posArray[idx + 2] += velocities[idx + 2];

      // Boundary check & wrap around
      if (Math.abs(posArray[idx]) > 6) velocities[idx] *= -1;
      if (Math.abs(posArray[idx + 1]) > 4) velocities[idx + 1] *= -1;
      if (posArray[idx + 2] > 1 || posArray[idx + 2] < -6) velocities[idx + 2] *= -1;

      // Mouse interaction: push particles away slightly if close
      const dx = posArray[idx] - mouseX;
      const dy = posArray[idx + 1] - mouseY;
      const distToMouse = Math.sqrt(dx * dx + dy * dy);
      if (distToMouse < 1.8) {
        posArray[idx] += dx * 0.01;
        posArray[idx + 1] += dy * 0.01;
      }

      // Check connections with other particles
      for (let j = i + 1; j < particleCount; j++) {
        const jdx = j * 3;
        const dist = Math.sqrt(
          Math.pow(posArray[idx] - posArray[jdx], 2) +
            Math.pow(posArray[idx + 1] - posArray[jdx + 1], 2) +
            Math.pow(posArray[idx + 2] - posArray[jdx + 2], 2)
        );

        if (dist < maxDistance && lineIndex < maxLinesLimit) {
          const lIdx = lineIndex * 6;

          // Line Start Node
          linePosArray[lIdx] = posArray[idx];
          linePosArray[lIdx + 1] = posArray[idx + 1];
          linePosArray[lIdx + 2] = posArray[idx + 2];

          // Line End Node
          linePosArray[lIdx + 3] = posArray[jdx];
          linePosArray[lIdx + 4] = posArray[jdx + 1];
          linePosArray[lIdx + 5] = posArray[jdx + 2];

          // Fade lines out based on distance
          const alpha = 1.0 - dist / maxDistance;
          
          // Restrained steel-blue accent for the navy theme.
          const r = 0.37 * alpha;
          const g = 0.49 * alpha;
          const b = 0.66 * alpha;

          // Color for start node
          lineColorArray[lIdx] = r;
          lineColorArray[lIdx + 1] = g;
          lineColorArray[lIdx + 2] = b;

          // Color for end node
          lineColorArray[lIdx + 3] = r;
          lineColorArray[lIdx + 4] = g;
          lineColorArray[lIdx + 5] = b;

          lineIndex++;
        }
      }
    }

    // Fill remaining lines buffer with zeroes to hide them
    for (let k = lineIndex; k < maxLinesLimit; k++) {
      const lIdx = k * 6;
      linePosArray[lIdx] = 0;
      linePosArray[lIdx + 1] = 0;
      linePosArray[lIdx + 2] = 0;
      linePosArray[lIdx + 3] = 0;
      linePosArray[lIdx + 4] = 0;
      linePosArray[lIdx + 5] = 0;
    }

    // Mark attributes as needing updates
    pointsGeom.attributes.position.needsUpdate = true;
    linesGeom.attributes.position.needsUpdate = true;
    linesGeom.attributes.color.needsUpdate = true;
  });

  return (
    <>
      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#94AFD0"
          size={0.07}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.6}
          depthWrite={false}
        />
      </points>

      {/* Network Connection Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors={true}
          transparent={true}
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}

// Background wrapper container
export default function Background3D() {
  const [enableCanvas, setEnableCanvas] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setEnableCanvas(!mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-white pointer-events-none noise-bg grid-bg">
      {enableCanvas && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.5} />
          <ParticleNetwork />
        </Canvas>
      )}
      {/* Cinematic subtle glow circles */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
    </div>
  );
}
