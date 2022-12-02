
import * as THREE from 'three';
// import { Loader } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import Cat from '../src/assets/cat.obj';
import Texture from '../src/assets/texture.png';
import Stats from 'three/examples/jsm/libs/stats.module'



let container;
let camera, scene, renderer;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth/ window.innerHeight, 1, 1000 );
//CAMERA
camera.position.z = 10;
camera.lookAt( scene.position );

// scene
scene.background = new THREE.Color('black');
//LIGHTING
const light = new THREE.PointLight()
light.position.set(2, 8, 50)
scene.add(light)
const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.7);
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
const objloader = new OBJLoader(loadingManager);
objloader.load(Cat, ( obj ) => {

    const object = obj;
    object.rotation.x += Math.PI/100;
    object.position.y += Math.PI/100;

    //TEXTURE LOADER

    const textureLoader = new THREE.TextureLoader(loadingManager);
    const texture = textureLoader.load(Texture);
    object.traverse(function (child) {   // aka setTexture
        if (child instanceof THREE.Mesh) {
            child.material.map = texture;
        }
    });
    //add CAT object to scene
    scene.add(object);
});

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
var angle = 90;
// var radius = 100; 

function animate() {

    requestAnimationFrame( animate );
    camera.position.x = Math.cos( angle );  
    camera.position.y = Math.sin( angle );
    angle += 0.001;

    stats.update()
    render();

}
animate();
export default animate;