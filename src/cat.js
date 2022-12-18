
import * as THREE from 'three';
// import { Loader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import BlackCat from '../src/assets/blackcat.glb';
import OrangeCat from '../src/assets/orangecat.glb';
// import Texture from '../src/assets/texture.png';
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


let container;
let camera, scene, renderer, controls;
let objBlackCat = BlackCat;
let objOrangeCat = OrangeCat;
let wasInitCalled = false;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 45, window.innerWidth/ window.innerHeight, 0.1, 1000 );
//CAMERA
camera.position.set(-1, 1, 5);
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
//PROMISE
const loader = new GLTFLoader();
const loadAsync = url => {
    return new Promise(resolve => {
      loader.load(url, gltf => {
        resolve(gltf)
      })
    })
  }
//LOADS THIS FIRST TO AVOID ERRORS
function init(){

    // ignore the 2nd call to init
    if (!wasInitCalled)
    {
        wasInitCalled = true;

        Promise.all([loadAsync(BlackCat), loadAsync(OrangeCat)]).then(models => {
            //LOAD BLACK CAT
            objBlackCat = models[0].scene.children[0];
            objBlackCat.position.set(0.5,1,1);
            scene.add(objBlackCat); 
            
            //LOAD ORANGE CAT
            objOrangeCat = models[1].scene.children[0];
            objOrangeCat.position.set(-0.5,-1,-1);
            scene.add(objOrangeCat);
            animate();
        });

    }
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

//CONTROLS
 controls = new OrbitControls( camera, renderer.domElement );
 controls.listenToKeyEvents( window ); // optional

 //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

 controls.enableDamping = true; 
 controls.dampingFactor = 0.05;
 controls.screenSpacePanning = false;
 controls.minDistance = 1;
 controls.maxDistance = 5;

 controls.maxPolarAngle = Math.PI / 2;

//Bouncing PARAMETERS AND CALC
let acceleration = 9.8;
let bounce_distance = 2;
let bottom_position_y = 0;
let time_step = 0.009;
let time_counter = Math.sqrt(bounce_distance * 2 / acceleration);
let initial_speed = acceleration * time_counter;

function animate()
{    
    if(objBlackCat && torus && objOrangeCat){
        if (torus.position.y < bottom_position_y && objBlackCat.position.y < bottom_position_y && objOrangeCat.position.y < bottom_position_y) {
            time_counter = 0;
        }
        // s2 = s1 + ut + (1/2)gt*t formula
        //UNIFORMLY ACCELERATED MOTION for BOUNCE
        let bounce = bottom_position_y + initial_speed * time_counter - 0.4 * acceleration * time_counter * time_counter;
        torus.position.y = bounce;
        objBlackCat.position.y = bounce;
        objOrangeCat.position.y = bounce;
        
        objBlackCat.rotation.x += 0.01;
        objBlackCat.rotation.y += 0.01;
        objBlackCat.rotation.y += 0.01;

        objOrangeCat.rotation.x -= 0.01;
        objOrangeCat.rotation.y -= 0.01;
        objOrangeCat.rotation.y -= 0.01;
        time_counter += time_step;
    }  
   

    stats.update()
    render();

    // request another frame render as soon as the previous one finishes
    requestAnimationFrame( animate );
}

export default init;