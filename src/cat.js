
import * as THREE from 'three';
// import { Loader } from 'three';
import { MeshStandardMaterial } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import Cat from '../src/assets/cat.obj';
import Texture from '../src/assets/texture.png';



let container;
let camera, scene, renderer;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

camera.position.z = 7;
camera.lookAt( scene.position );

// scene
scene.background = new THREE.Color('black');

const light = new THREE.PointLight()
light.position.set(2, 8, 50)
scene.add(light)
const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.7);
scene.add( ambientLight );

scene.add( camera );

// manager
const loadingManager = new THREE.LoadingManager();
//OBJECT LOADER
const objloader = new OBJLoader(loadingManager);
objloader.load(Cat, ( obj ) => {

    const object = obj;
    object.rotation.x += Math.PI/100;

    //texture

    const textureLoader = new THREE.TextureLoader(loadingManager);
    const texture = textureLoader.load(Texture);
    object.traverse(function (child) {   // aka setTexture
        if (child instanceof THREE.Mesh) {
            child.material.map = texture;
        }
    });
    //add object to scene
    scene.add(object);
});

//RENDERER
renderer = new THREE.WebGLRenderer();
container = renderer.domElement;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( container );
function render() {
    
    renderer.render( scene, camera );
} 
var angle = 90;
// var radius = 100; 

function animate() {

    requestAnimationFrame( animate );
    camera.position.x = Math.cos( angle );  
    camera.position.y = Math.sin( angle );
    angle += 0.001;
    render();

}
animate();
export default animate;