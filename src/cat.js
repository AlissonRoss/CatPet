
import * as THREE from 'three';
// import { Loader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Cat from '../src/assets/blackcat.glb';
// import Texture from '../src/assets/texture.png';
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


let container;
let camera, scene, renderer, objCat, controls;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 45, window.innerWidth/ window.innerHeight, 0.1, 1000 );
//CAMERA
camera.position.set(-1, 1, 3);
camera.lookAt( scene.position );

// scene
scene.background = new THREE.Color(0x000000);
//LIGHTING
const light = new THREE.PointLight()
light.position.set(-1, 1, 3)
scene.add(light)
const ambientLight = new THREE.AmbientLight( 0xfffff0, 0.2);
scene.add( ambientLight );

scene.add( camera );
//X - PLANE
const geometry = new THREE.PlaneGeometry( 1, 2 );
const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
plane.position.set(1, 0, 0);
scene.add( plane );
//AXIS HELPER
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// manager
const loadingManager = new THREE.LoadingManager();

//OBJECT LOADER
const objloader = new GLTFLoader(loadingManager);
objloader.load(Cat, ( gltf ) => {

    const object = gltf.scene;
    //TEXTURE LOADER

    // const textureLoader = new THREE.TextureLoader(loadingManager);
    // const texture = textureLoader.load(Texture);
    // // object.traverse(function (child) {   // aka setTexture
    // //     if (child instanceof THREE.Mesh) {
    // //         child.material.map = texture;
    // //     }
    // // });
    //add CAT object to scene
    objCat = object;
    scene.add(object);
    
    
});

//FOG
 scene.fog = new THREE.Fog( 0x23272a, 0.5, 1700, 4000 );

 


//RENDERER
renderer = new THREE.WebGLRenderer();
container = renderer.domElement;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight - 100);
renderer.setClearColor( 0xffffff, 1);
document.body.appendChild( container );
function render() {
    
    renderer.render( scene, camera );
} 
//STATS
const stats = Stats();
document.body.appendChild(stats.dom);
// var angle = 90;
// var radius = 100; 

//CONTROLS
 controls = new OrbitControls( camera, renderer.domElement );
 controls.listenToKeyEvents( window ); // optional

 //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

 controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
 controls.dampingFactor = 0.05;

 controls.screenSpacePanning = false;

 controls.minDistance = 1;
 controls.maxDistance = 5;

 controls.maxPolarAngle = Math.PI / 2;





function animate() {

    setTimeout( () => {
        requestAnimationFrame( animate );
    }, 1000 / 60 );
    objCat.rotation.x += 0.01;
	objCat.rotation.y += 0.01;
    
    //handles speed
    //angle += 0.001;

    stats.update()
    render();

}
animate();

export default animate;