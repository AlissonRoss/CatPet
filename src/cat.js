
import * as THREE from 'three';
// import { Loader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Cat from '../src/assets/blackcat.glb';
// import Texture from '../src/assets/texture.png';
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


let container;
let camera, scene, renderer, controls;
let objCat = Cat;
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

//AXIS HELPER
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// manager
const loadingManager = new THREE.LoadingManager();

//OBJECT LOADER
//LOADS THIS FIRST TO AVOID ERRORS
function init(){
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
        objCat.position.set(0.5,1,1);
        scene.add(objCat);  
        animate();
    });
}

//DONUT
const geometry = new THREE.TorusGeometry(3,1,5,40,7);
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const torus = new THREE.Mesh( geometry, material );
torus.scale.set(0.01,0.01,0.01);
// torus.position.set(
//     Math.random()*8 - 4
//   );
scene.add( torus );
//FOG
 scene.fog = new THREE.Fog( 0x23272a, 0.5, 1700, 4000 );

 //PLANE
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry( 40, 40 ),
    new THREE.MeshPhongMaterial( { color: 0x097969, specular: 0x101010 } )
);
plane.rotation.x = - Math.PI / 2;
plane.position.y = - 0.3;
scene.add( plane );

plane.receiveShadow = true;


//RENDERER
renderer = new THREE.WebGLRenderer();
container = renderer.domElement;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight - 100);
// renderer.setClearColor( 0xffffff, 1);
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

//Bouncing PARAMETERS AND CALC
let acceleration = 9.8;
let bounce_distance = 2;
let bottom_position_y = -0.4;
let time_step = 0.009;
let time_counter = Math.sqrt(bounce_distance * 2 / acceleration);
let initial_speed = acceleration * time_counter;

function animate() {
    
    setTimeout( () => {
        requestAnimationFrame( animate );
    }, 1000 / 60 );
    if(objCat && torus){
        if (torus.position.y < bottom_position_y && objCat.position.y < bottom_position_y) {
            time_counter = 0;
        }
        // s2 = s1 + ut + (1/2)gt*t formula
        //UNIFORMLY ACCELERATED MOTION for BOUNCE
        let bounce = bottom_position_y + initial_speed * time_counter - 0.4 * acceleration * time_counter * time_counter;
        torus.position.y = bounce;
        objCat.position.y = bounce;
        
        objCat.rotation.x += 0.01;
        objCat.rotation.y += 0.01;
        objCat.rotation.y += 0.01;
    
        time_counter += time_step;
    }  
   

    stats.update()
    render();

}

export default init;