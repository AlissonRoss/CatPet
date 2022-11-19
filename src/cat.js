
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import Cat from '../src/assets/cat.obj';


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
const ambientLight = new THREE.AmbientLight( 0xEF8642, 0.7);
scene.add( ambientLight );

scene.add( camera );

// manager
const objloader = new OBJLoader();
objloader.load(Cat, ( obj ) => {

    const object = obj;
    const texture = new THREE.TextureLoader().load('../src/assets/texture.png');
    const material = new THREE.MeshBasicMaterial( { map: texture } );
    objloader.setMaterials(material);
    obj.rotation.x += Math.PI/70;
    scene.add(object);
});


//


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