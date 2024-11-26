import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Configuración de la escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

// Luces
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Fondo y Tierra
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

const earthTexture = new THREE.TextureLoader().load('earth.jpg');
const normalTexture = new THREE.TextureLoader().load('earthnormal.jpg');
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(10,64,64),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: normalTexture,
  })
);
scene.add(earth);
earth.position.x = 20;

const placasTexture = new THREE.TextureLoader().load('tectonic.jpg');
const placas = new THREE.Mesh(
  new THREE.SphereGeometry(5, 64, 64),
  new THREE.MeshStandardMaterial({
    map: placasTexture,
  })
);
scene.add(placas);
placas.visible = false;

// Carga de modelos (Colombia y Monserrate)
const loader = new GLTFLoader();
let colombiaModel, monserrateModel;

// Cargar Colombia
loader.load('colombia.glb', (gltf) => {
  colombiaModel = gltf.scene;
  colombiaModel.scale.set(1, 1, 1);
  colombiaModel.visible = false;
  scene.add(colombiaModel);
});

// Cargar Monserrate
const monserrateDirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
monserrateDirectionalLight.position.set(-25, 0, 10); // Coloca la luz en una dirección específica
scene.add(monserrateDirectionalLight);

loader.load('Monserrate.glb', (gltf) => {
  monserrateModel = gltf.scene;
  monserrateModel.scale.set(0.1, 0.1, 0.1);
  monserrateModel.visible = false;

  // Cambiar el color del material
  monserrateModel.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(0xaba196); // Cambia el color a rojo
      child.material.needsUpdate = true; // Asegúrate de que se actualice el material
      child.material.metalness = 0.5; // Aumenta la reflectividad metálica
      child.material.roughness = 0.2; // Disminuye la rugosidad para hacer la superficie más brillante
      child.material.needsUpdate = true; // Asegura que se actualice
    }
  });

  scene.add(monserrateModel);
});




// Scroll-triggered animations
ScrollTrigger.create({
  trigger: '.cordilleras',
  start: 'top center',
  onEnter: () => {
    gsap.to(earth.position, {
      x: 30,  // Mueve la Tierra hacia la derecha
      z: 30,  // Acerca la Tierra hacia la cámara
      duration: 1, // Tiempo de animación
      ease: 'power2.inOut',
      onComplete: () => {
        // Animación de Colombia después de que la Tierra termina
        earth.visible = false;
        if (colombiaModel) {
          colombiaModel.visible = true;
          gsap.to(colombiaModel.rotation, {
            x: Math.PI * 3 / 2, // Inclina hacia adelante
            y: Math.PI,     // Rota hacia la cámara
            z: Math.PI,     // Rota hacia la cámara
            duration: 1,
          });
          gsap.to(colombiaModel.scale, {
            x: 3, 
            y: 3, 
            z: 3,    
            duration: 1,
          });
          gsap.to(colombiaModel.position, {
            x: 25,   
            duration: 1,
          });
        }
      },
    });
    
  },
  onLeaveBack: () => {
    if (colombiaModel) {
      gsap.to(colombiaModel.rotation, {
        x: 0, // Inclina hacia adelante
        y: 0,     // Rota hacia la cámara
        z: 0,     // Rota hacia la cámara
        duration: 1,
      });
      gsap.to(colombiaModel.scale, {
        x: 1, 
        y: 1, 
        z: 1,    
        duration: 1,
      });
      gsap.to(colombiaModel.position, {
        x: 0,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          // Luego, devolver la Tierra a su posición inicial
          gsap.to(earth.position, {
            x: 20,
            z: 0,
            duration: 1,
            ease: 'power2.inOut',
          });
          earth.visible = true;
          colombiaModel.visible = false;
        },
      });
    }
  },
});

ScrollTrigger.create({
  trigger: '.placas',
  start: 'top center',
  onEnter: () => {
    gsap.to(colombiaModel.position, {
      x: 30,  // Mueve la Tierra hacia la derecha
      z: 30,  // Acerca la Tierra hacia la cámara
      duration: 1, // Tiempo de animación
      ease: 'power2.inOut',
      onComplete: () => {
        // Animación de Colombia después de que la Tierra termina
        colombiaModel.visible = false;
        placas.visible = true;
        gsap.to(placas.rotation, {
          y: 3.7,
          duration: 1,
        });
        gsap.to(placas.scale, {
          x: 3, 
          y: 3, 
          z: 3,    
          duration: 1,
        });
        gsap.to(placas.position, {
          x: 25,   
          duration: 1,
        });
      },
    });
    
  },
  onLeaveBack: () => {
    gsap.to(placas.rotation, {
      x: 0, // Inclina hacia adelante
      y: 0,     // Rota hacia la cámara
      z: 0,     // Rota hacia la cámara
      duration: 1,
    });
    gsap.to(placas.scale, {
      x: 1, 
      y: 1, 
      z: 1,    
      duration: 1,
    });
    gsap.to(placas.position, {
      x: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        // Luego, devolver la Tierra a su posición inicial
        gsap.to(colombiaModel.position, {
          x: 20,
          z: 0,
          duration: 1,
          ease: 'power2.inOut',
        });
        colombiaModel.visible = true;
        placas.visible = false;
      },
    });
  },
});

ScrollTrigger.create({
  trigger: '.left',
  start: 'top center',
  onEnter: () => {
    gsap.to(placas.position, {
      x: 30,  // Mueve la Tierra hacia la derecha
      z: 30,  // Acerca la Tierra hacia la cámara
      duration: 1, // Tiempo de animación
      ease: 'power2.inOut',
      onComplete: () => {
        // Animación de Colombia después de que la Tierra termina
        placas.visible = false;
        monserrateModel.visible = true;
        gsap.to(monserrateModel.position, {
          x: -30,
          y: -10,   
          z: 10,
          duration: 1,
        });
        gsap.to(monserrateModel.rotation, {
          x: Math.PI * 3 / 2, // Inclina hacia adelante
          y: Math.PI,     // Rota hacia la cámara
          z: Math.PI,     // Rota hacia la cámara
          duration: 1,
        });
      },
    });
    
  },
  onLeaveBack: () => {
    gsap.to(monserrateModel.rotation, {
      x: 0, // Inclina hacia adelante
      y: 0,     // Rota hacia la cámara
      z: 0,     // Rota hacia la cámara
      duration: 1,
    });
    gsap.to(monserrateModel.rotation, {
      x: 0, 
      y: 0,     
      z: 0,     
      duration: 1,
    });
    gsap.to(monserrateModel.position, {
      x: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        // Luego, devolver la Tierra a su posición inicial
        gsap.to(placas.position, {
          x: 20,
          z: 0,
          duration: 1,
          ease: 'power2.inOut',
        });
        placas.visible = true;
        monserrateModel.visible = false;
      },
    });
  },
});

function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.005; // Rotar la Tierra
  renderer.render(scene, camera);
}
animate();
