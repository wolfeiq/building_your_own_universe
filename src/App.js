import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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
    scene.background = new THREE.Color(0x1a0d2e);
    scene.fog = new THREE.Fog(0x4a1f6f, 600, 1800);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );
    camera.position.set(0, 200, 700); 
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);


    const sunLight = new THREE.DirectionalLight(0xff6b35, 2.0);
    sunLight.position.set(300, 150, 200);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x6b4e9b, 0.6);
    scene.add(ambientLight);

    const skyLight = new THREE.HemisphereLight(0xff8c42, 0x4a1f6f, 1.2);
    scene.add(skyLight);

    const rimLight = new THREE.DirectionalLight(0xd946ef, 0.8);
    rimLight.position.set(-200, 100, -200);
    scene.add(rimLight);

    const orangeStreak1 = new THREE.DirectionalLight(0xff4500, 4.0);
    orangeStreak1.position.set(-500, 100, 400);
    scene.add(orangeStreak1);

    const orangeStreak2 = new THREE.DirectionalLight(0xff5500, 3.0); 
    orangeStreak2.position.set(-400, 120, 300);
    scene.add(orangeStreak2);

    const fillLight = new THREE.DirectionalLight(0xffa94d, 0.6);
    fillLight.position.set(100, 200, -100);
    scene.add(fillLight);

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

    const material = new THREE.MeshStandardMaterial({
      map: colorMap,
      displacementMap: heightMap,
      displacementScale: 100,
      roughness: 0.85,
      metalness: 0.15,
      flatShading: false,
      alphaMap: alphaMap,
      transparent: true,
      side: THREE.DoubleSide,
      emissive: 0xff4500,
      emissiveIntensity: 0.3
    });

    const geometry = new THREE.PlaneGeometry(1000, 500, 200, 100);
    geometry.rotateX(-Math.PI / 2);
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true; 
    scene.add(mesh);

    const bottomGeometry = new THREE.PlaneGeometry(1000, 500, 200, 100);
    bottomGeometry.rotateX(-Math.PI / 2);
    
    const bottomMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a2d5c,
      displacementMap: heightMap,
      displacementScale: -30,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: false,
      alphaMap: alphaMap,
      transparent: true,
      side: THREE.DoubleSide,
      emissive: 0x2d1b3d,
      emissiveIntensity: 0.2
    });
    
    const bottomMesh = new THREE.Mesh(bottomGeometry, bottomMaterial);
    bottomMesh.position.y = -30; 
    scene.add(bottomMesh);
    const getTerrainHeight = (x, z) => {
      const u = (x + 500) / 1000;
      const v = (z + 250) / 500;
      
      const clampedU = Math.max(0, Math.min(1, u));
      const clampedV = Math.max(0, Math.min(1, v));
      
      let height = 0;
      
      if (clampedU < 0.4) {
        height = 80 + Math.random() * 15;
      } else if (clampedU < 0.7) {
        height = 20 + Math.random() * 10;
      } else {
        height = 45 + Math.random() * 10;
      }
      
      if (clampedV > 0.7) {
        height -= 15;
      }
      
      return height;
    };

 
    const loader = new GLTFLoader();
    const mixers = [];
    const treeModels = [];
    const treeFiles = [
      '/models/tree.gltf',     
       '/models/tree2.gltf', 
       '/models/tree3.gltf', 
    ];
    
    let modelsLoaded = 0;
    const totalModels = treeFiles.length;
    

    const forceTimeout = setTimeout(() => {
      if (treeModels.length > 0) {
        console.log('timeout');
        placeAllTrees();
      }
    }, 5000); 
    const placeAllTrees = () => {
      if (modelsLoaded < totalModels && treeModels.length === 0) return;
      
      clearTimeout(forceTimeout);
      
      console.log(`Placing mixed forest with ${treeModels.length} tree type(s)...`);
      
      if (treeModels.length === 0) {
        console.error('No tree models loaded successfully!');
        return;
      }
      
   
      for (let i = 0; i < 100; i++) {
        const randomModelIndex = Math.floor(Math.random() * treeModels.length);
        const selectedModel = treeModels[randomModelIndex];
        
        const treeClone = selectedModel.model.clone();
        
  
        const x = -500 + Math.random() * 500;
        const z = -250 + Math.random() * 430;
        const y = getTerrainHeight(x, z);
        
        treeClone.position.set(x, y, z);
        treeClone.rotation.y = Math.random() * Math.PI * 2;
        
        const scale = selectedModel.baseScale * (0.8 + Math.random() * 0.6);
        treeClone.scale.set(scale, scale, scale);
        
   
        treeClone.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
    
            child.material = new THREE.MeshStandardMaterial({
              color: 0x8b5a8e,
              roughness: 0.7,
              metalness: 0.1,
              flatShading: false,
              emissive: 0xff6b35, 
              emissiveIntensity: 0.02
            });
          }
        });
        
        scene.add(treeClone);
        
      }
      
    };
  
    const processTreeModel = (gltf, modelName) => {
      console.log(`${modelName} loaded successfully!`);
      const treeModel = gltf.scene;
      
  
      console.log(`${modelName} animations:`, gltf.animations.length);

      const box = new THREE.Box3().setFromObject(treeModel);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
    
      treeModel.position.sub(center);
      treeModel.position.y += size.y / 2;
      let baseScale = 20 / size.y;
    
      
      treeModels.push({
        model: treeModel,
        animations: gltf.animations,
        baseScale: baseScale,
        name: modelName
      });
      
      modelsLoaded++;
      
      if (modelsLoaded === totalModels || (modelsLoaded > 0 && treeModels.length > 0)) {
        placeAllTrees();
      }
    };
    
    console.log('tree 1 should be there now');
    loader.load(
      '/models/tree.gltf',
      (gltf) => processTreeModel(gltf, 'Tree 1'),
      (progress) => console.log('Tree 1 loading:', Math.round(progress.loaded / progress.total * 100) + '%'),
      (error) => {
        console.error('Error loading Tree 1:', error);
        modelsLoaded++;
      }
    );
    
    treeFiles.forEach((filePath, index) => {
      console.log(`Loading tree ${index + 1} from ${filePath}`);
      loader.load(
        filePath,
        (gltf) => processTreeModel(gltf, `Tree ${index + 1}`),
        (progress) => console.log(`Tree ${index + 1} loading:`, Math.round(progress.loaded / progress.total * 100) + '%'),
        (error) => {
          console.error(`Error loading Tree ${index + 1}:`, error);
          modelsLoaded++;
          if (treeModels.length > 0) placeAllTrees();
        }
      );
    });

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
      
    </div>
  );
}