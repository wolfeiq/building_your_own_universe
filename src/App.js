import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function MetallicTerrain() {
  const mountRef = useRef(null);
  const controlsRef = useRef({
    isDragging: false,
    previousMouse: { x: 0, y: 0 },
    cameraAngle: 0.5,
    cameraHeight: 150,
    cameraDistance: 600
  });

  useEffect(() => {
    if (!mountRef.current) return;

    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    scene.fog = new THREE.Fog(0x1a1a1a, 500, 2000);

    
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );
    camera.position.set(0, 150, 600);
    camera.lookAt(0, 0, 0);


    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);


    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(100, 200, 100);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    
    const rimLight = new THREE.DirectionalLight(0x6699ff, 0.5);
    rimLight.position.set(-100, 50, -100);
    scene.add(rimLight);

    
    const createHeightMap = () => {
      const canvas = document.createElement('canvas');
      const width = 512;
      const height = 256; // Rectangular ratio
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, width, height);
      
      
      const leftGradient = ctx.createLinearGradient(0, 0, width * 0.4, 0);
      leftGradient.addColorStop(0, '#ffffff'); // Very high
      leftGradient.addColorStop(0.7, '#cccccc');
      leftGradient.addColorStop(1, '#808080'); // Medium
      ctx.fillStyle = leftGradient;
      ctx.fillRect(0, 0, width * 0.4, height);
      
     
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * width * 0.35;
        const y = Math.random() * height;
        const size = 30 + Math.random() * 60;
        const brightness = 200 + Math.random() * 55;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, `rgb(${brightness}, ${brightness}, ${brightness})`);
        gradient.addColorStop(1, 'rgba(128, 128, 128, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width * 0.4, height);
      }
      
     
      const fieldsGradient = ctx.createLinearGradient(width * 0.4, 0, width * 0.7, 0);
      fieldsGradient.addColorStop(0, '#808080');
      fieldsGradient.addColorStop(0.3, '#555555'); // Low fields
      fieldsGradient.addColorStop(0.7, '#555555'); // Low fields
      fieldsGradient.addColorStop(1, '#707070'); // Start rising
      ctx.fillStyle = fieldsGradient;
      ctx.fillRect(width * 0.4, 0, width * 0.3, height);
      
     
      const rightGradient = ctx.createLinearGradient(width * 0.7, 0, width, 0);
      rightGradient.addColorStop(0, '#707070');
      rightGradient.addColorStop(0.5, '#999999'); // Medium elevation
      rightGradient.addColorStop(1, '#aaaaaa');
      ctx.fillStyle = rightGradient;
      ctx.fillRect(width * 0.7, 0, width * 0.3, height);
      
     
      const frontGradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
      frontGradient.addColorStop(0, 'rgba(128, 128, 128, 0)');
      frontGradient.addColorStop(1, 'rgba(50, 50, 50, 0.7)'); // Dark = low
      ctx.fillStyle = frontGradient;
      ctx.fillRect(0, height * 0.7, width, height * 0.3);
      
      return new THREE.CanvasTexture(canvas);
    };

    const heightMap = createHeightMap();

  
    const material = new THREE.MeshPhongMaterial({
      color: 0x888888,
      displacementMap: heightMap,
      displacementScale: 100,
      bumpMap: heightMap,
      bumpScale: 3,
      shininess: 15,
      flatShading: false
    });

   
    const geometry = new THREE.PlaneGeometry(1000, 500, 200, 100);
    geometry.rotateX(-Math.PI / 2);
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    
    const gridHelper = new THREE.GridHelper(1000, 20, 0x444444, 0x222222);
    gridHelper.position.y = -1;
    scene.add(gridHelper);

    
    const updateCameraPosition = () => {
      const controls = controlsRef.current;
      camera.position.x = Math.sin(controls.cameraAngle) * controls.cameraDistance;
      camera.position.z = Math.cos(controls.cameraAngle) * controls.cameraDistance;
      camera.position.y = controls.cameraHeight;
      camera.lookAt(0, 0, 0);
    };

   
    const handleMouseDown = (e) => {
      controlsRef.current.isDragging = true;
      controlsRef.current.previousMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (controlsRef.current.isDragging) {
        const deltaX = e.clientX - controlsRef.current.previousMouse.x;
        const deltaY = e.clientY - controlsRef.current.previousMouse.y;
        
        controlsRef.current.cameraAngle += deltaX * 0.01;
        controlsRef.current.cameraHeight -= deltaY * 0.5;
        controlsRef.current.cameraHeight = Math.max(50, Math.min(400, controlsRef.current.cameraHeight));
        
        updateCameraPosition();
        controlsRef.current.previousMouse = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      controlsRef.current.isDragging = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      controlsRef.current.cameraDistance += e.deltaY * 0.5;
      controlsRef.current.cameraDistance = Math.max(200, Math.min(1200, controlsRef.current.cameraDistance));
      updateCameraPosition();
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: false });

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);


    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      geometry.dispose();
      material.dispose();
      heightMap.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      margin: 0, 
      padding: 0,
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        background: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '14px',
        pointerEvents: 'none'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Draft Terrain</h3>
        
      </div>
    </div>
  );
}
