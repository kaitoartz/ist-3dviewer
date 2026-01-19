// Variables globales
let scene, camera, renderer, controls;
let cube;

// Inicializar la escena
function init() {
    // Ocultar mensaje de carga
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 1000);

    // Crear escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    // Configurar cámara
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Configurar renderer
    const canvas = document.getElementById('canvas3d');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Añadir controles de órbita
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    // Crear geometría de ejemplo (cubo con colores)
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const materials = [
        new THREE.MeshStandardMaterial({ color: 0xff6b6b }),
        new THREE.MeshStandardMaterial({ color: 0x4ecdc4 }),
        new THREE.MeshStandardMaterial({ color: 0xffe66d }),
        new THREE.MeshStandardMaterial({ color: 0x95e1d3 }),
        new THREE.MeshStandardMaterial({ color: 0xf38181 }),
        new THREE.MeshStandardMaterial({ color: 0xaa96da })
    ];
    cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    // Añadir iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    // Manejar resize de ventana
    window.addEventListener('resize', onWindowResize, false);

    // Iniciar animación
    animate();
}

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Rotar el cubo ligeramente
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;

    // Actualizar controles
    controls.update();

    // Renderizar escena
    renderer.render(scene, camera);
}

// Manejar resize de ventana
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Función para cargar modelo 3D personalizado (GLB/GLTF)
function loadCustomModel(modelPath) {
    const loader = new THREE.GLTFLoader();
    
    loader.load(
        modelPath,
        function (gltf) {
            // Remover cubo de ejemplo
            scene.remove(cube);
            
            // Añadir modelo cargado
            const model = gltf.scene;
            scene.add(model);
            
            // Centrar y escalar modelo
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3 / maxDim;
            model.scale.multiplyScalar(scale);
            
            console.log('Modelo cargado exitosamente');
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% cargado');
        },
        function (error) {
            console.error('Error al cargar el modelo:', error);
        }
    );
}

// Iniciar cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', init);

// Para cargar tu modelo 3D, descomenta y ajusta la ruta:
// loadCustomModel('models/tu-modelo.glb');
