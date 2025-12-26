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

    
    const directionalLight = new THREE.DirectionalLight(0xffaa66, 0.8);
    directionalLight.position.set(-200, 150, 200);
    scene.add(directionalLight);


    const createHeightMap = () => {
      const canvas = document.createElement('canvas');
      const width = 512;
      const height = 256;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, width, height);
      
    
      const leftGradient = ctx.createLinearGradient(0, 0, width * 0.4, 0);
      leftGradient.addColorStop(0, '#ffffff');
      leftGradient.addColorStop(0.7, '#cccccc');
      leftGradient.addColorStop(1, '#808080'); 
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
      fieldsGradient.addColorStop(0.3, '#555555'); 
      fieldsGradient.addColorStop(0.7, '#555555');
      fieldsGradient.addColorStop(1, '#707070'); 
      ctx.fillStyle = fieldsGradient;
      ctx.fillRect(width * 0.4, 0, width * 0.3, height);
      
      
      const rightGradient = ctx.createLinearGradient(width * 0.7, 0, width, 0);
      rightGradient.addColorStop(0, '#707070');
      rightGradient.addColorStop(0.5, '#999999'); 
      rightGradient.addColorStop(1, '#aaaaaa');
      ctx.fillStyle = rightGradient;
      ctx.fillRect(width * 0.7, 0, width * 0.3, height);
      
     
      const frontGradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
      frontGradient.addColorStop(0, 'rgba(128, 128, 128, 0)');
      frontGradient.addColorStop(1, 'rgba(50, 50, 50, 0.7)');
      ctx.fillStyle = frontGradient;
      ctx.fillRect(0, height * 0.7, width, height * 0.3);
      
      return new THREE.CanvasTexture(canvas);
    };

    const heightMap = createHeightMap();

    
    const createColorMap = () => {
      const canvas = document.createElement('canvas');
      const width = 512;
      const height = 256;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      
      const leftGradient = ctx.createLinearGradient(0, 0, width * 0.4, 0);
      leftGradient.addColorStop(0, '#2a2a2a'); 
      leftGradient.addColorStop(0.7, '#505050');
      leftGradient.addColorStop(1, '#707070'); 
      ctx.fillStyle = leftGradient;
      ctx.fillRect(0, 0, width * 0.4, height);
      
     
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * width * 0.35;
        const y = Math.random() * height;
        const size = 30 + Math.random() * 60;
        const darkness = 30 + Math.random() * 40;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, `rgb(${darkness}, ${darkness}, ${darkness})`);
        gradient.addColorStop(1, 'rgba(112, 112, 112, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width * 0.4, height);
      }
      
    
      const fieldsGradient = ctx.createLinearGradient(width * 0.4, 0, width * 0.7, 0);
      fieldsGradient.addColorStop(0, '#707070');
      fieldsGradient.addColorStop(0.3, '#a0a0a0'); 
      fieldsGradient.addColorStop(0.7, '#a0a0a0'); 
      fieldsGradient.addColorStop(1, '#808080'); 
      ctx.fillStyle = fieldsGradient;
      ctx.fillRect(width * 0.4, 0, width * 0.3, height);
      
    
      const rightGradient = ctx.createLinearGradient(width * 0.7, 0, width, 0);
      rightGradient.addColorStop(0, '#808080');
      rightGradient.addColorStop(0.5, '#606060'); 
      rightGradient.addColorStop(1, '#555555');
      ctx.fillStyle = rightGradient;
      ctx.fillRect(width * 0.7, 0, width * 0.3, height);
      
      
      const frontGradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
      frontGradient.addColorStop(0, 'rgba(128, 128, 128, 0)');
      frontGradient.addColorStop(1, 'rgba(180, 180, 180, 0.7)'); 
      ctx.fillStyle = frontGradient;
      ctx.fillRect(0, height * 0.7, width, height * 0.3);
      
      return new THREE.CanvasTexture(canvas);
    };

    const colorMap = createColorMap();

  
    const createAlphaMap = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      
     
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
     
      const fadeDistance = 1; 
      
     
      const leftGradient = ctx.createLinearGradient(0, 0, fadeDistance, 0);
      leftGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      leftGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
      ctx.fillStyle = leftGradient;
      ctx.fillRect(0, 0, fadeDistance, canvas.height);
      
      
      const rightGradient = ctx.createLinearGradient(canvas.width - fadeDistance, 0, canvas.width, 0);
      rightGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      rightGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = rightGradient;
      ctx.fillRect(canvas.width - fadeDistance, 0, fadeDistance, canvas.height);
      
    
      const topGradient = ctx.createLinearGradient(0, 0, 0, fadeDistance);
      topGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      topGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = topGradient;
      ctx.fillRect(0, 0, canvas.width, fadeDistance);
      
     
      const bottomGradient = ctx.createLinearGradient(0, canvas.height - fadeDistance, 0, canvas.height);
      bottomGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      bottomGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = bottomGradient;
      ctx.fillRect(0, canvas.height - fadeDistance, canvas.width, fadeDistance);
      
      return new THREE.CanvasTexture(canvas);
    };

    const alphaMap = createAlphaMap();

    
    const material = new THREE.MeshPhongMaterial({
      map: colorMap,
      displacementMap: heightMap,
      displacementScale: 100,
      shininess: 80,
      specular: 0x444444,
      flatShading: false,
      alphaMap: alphaMap,
      transparent: true,
      side: THREE.DoubleSide
    });

 
    const geometry = new THREE.PlaneGeometry(1000, 500, 200, 100);
    geometry.rotateX(-Math.PI / 2);
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    
    const bottomGeometry = new THREE.PlaneGeometry(1000, 500, 200, 100);
    bottomGeometry.rotateX(-Math.PI / 2);
    
   
    const bottomMaterial = new THREE.MeshPhongMaterial({
      color: 0x666666,
      displacementMap: heightMap,
      displacementScale: -30, 
      shininess: 60,
      specular: 0x333333,
      flatShading: false,
      alphaMap: alphaMap,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const bottomMesh = new THREE.Mesh(bottomGeometry, bottomMaterial);
    bottomMesh.position.y = -30; 
    scene.add(bottomMesh);

  
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
      colorMap.dispose();
      alphaMap.dispose();
      bottomGeometry.dispose();
      bottomMaterial.dispose();
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