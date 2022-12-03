
import * as THREE from 'three';
// import { Loader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Cat from '../src/assets/blackcat.glb';
// import Texture from '../src/assets/texture.png';
import Stats from 'three/examples/jsm/libs/stats.module'



let container;
let camera, scene, renderer, objCat;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth/ window.innerHeight, 1, 1000 );
//CAMERA
camera.position.z = 3;
camera.lookAt( scene.position );

// scene
scene.background = new THREE.Color(0x900C3F);
//LIGHTING
const light = new THREE.PointLight()
light.position.set(2, 8, 50)
scene.add(light)
const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.07);
scene.add( ambientLight );

scene.add( camera );
//X - PLANE
const geometry = new THREE.PlaneGeometry( 10, 0.1 );
const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
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
    animate();
    
});

//FOG
 scene.fog = new THREE.Fog( 0x23272a, 0.5, 1700, 4000 );

//RENDERER
renderer = new THREE.WebGLRenderer();
container = renderer.domElement;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight - 100);
document.body.appendChild( container );
function render() {
    
    renderer.render( scene, camera );
} 
//STATS
const stats = Stats();
document.body.appendChild(stats.dom);
// var angle = 90;
// var radius = 100; 

function animate() {

    requestAnimationFrame( animate );
    objCat.rotation.x += 0.001;
	objCat.rotation.y += 0.001;
    
    //handles speed
    //angle += 0.001;

    stats.update()
    render();

}


export default animate;