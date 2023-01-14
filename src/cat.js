
import * as THREE from 'three';
// import { Loader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import BlackCat from '../src/assets/blackcat.glb';
import OrangeCat from '../src/assets/orangecat.glb';
import Madi from '../src/assets/madi.glb';
import Ivy from '../src/assets/ivy.glb';
// import Texture from '../src/assets/texture.png';
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import BgImg from '../src/assets/sky.png';

// take a reference to the canvas in case we want to listen to clicks or touches on the canvas
const canvas = document.querySelector('#canvas');

let renderer;
let wasInitCalled = false;  // A bug in the React code causes the init() function to be called twice. Ingore calls after the first


//SCENE
const scene = new THREE.Scene();
let objBlackCat  = null;
let objOrangeCat = null;
let objMadi      = null;
let objIvy       = null;

//CAMERA
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth/ window.innerHeight, 0.1, 1000 );
camera.position.set(-1, 1, 5);
camera.lookAt( scene.position );



//LIGHTING
const light = new THREE.PointLight(0xFFFFFF, 1, Infinity)
light.position.set(-1, 0.5, 4)
scene.add(light)
const ambientLight = new THREE.AmbientLight( 0xCCCCC0, 0.6);
scene.add( ambientLight );
scene.add( camera );

//AXIS HELPER
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
//RESIZE
function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight);
}
//PROMISE
const loader = new GLTFLoader();
const loadAsync = url => {
    return new Promise(resolve => {
      loader.load(url, gltf => {
        resolve(gltf)
      })
    })
  }
const BgLoader = new THREE.TextureLoader();
const bgTexture = BgLoader.load(BgImg);
BgLoader.crossOrigin = "";
scene.background = bgTexture;


//LOADS THIS FIRST TO AVOID ERRORS
function init(){

    if (wasInitCalled)
    {
        // ignore calls after the first
        return;
    }

    wasInitCalled = true;

    Promise.all([loadAsync(BlackCat), loadAsync(OrangeCat), loadAsync(Madi), loadAsync(Ivy)]).then(models => {
        //LOAD BLACK CAT
        objBlackCat = models[0].scene.children[0];
        objBlackCat.position.set(0.5,1,1);
        scene.add(objBlackCat); 
        
        //LOAD ORANGE CAT
        objOrangeCat = models[1].scene.children[0];
        objOrangeCat.position.set(-0.5,1,1);
        scene.add(objOrangeCat);

        //LOAD madi
        objMadi = models[2].scene.children[0];
        objMadi.position.set(0.2,0.5,0);
        objMadi.rotation.y += 1;
        scene.add(objMadi);

        //LOAD IVY MODEL
        objIvy = models[3].scene.children[0];
        objIvy.position.set(-0.2,0.5,0);
        objIvy.rotation.y -= 1;
        scene.add(objIvy);

        //RESIZES WINDOW
        window.addEventListener('resize', onWindowResize, false);

        // before requesting the first animation frame, update the canvas and camera properties based on the window properties
        onWindowResize();
        
        // Delay rendering until all models are loaded
        requestAnimationFrame(animate);
    });
}


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
renderer = new THREE.WebGLRenderer({
    c:         canvas,
    stencil:   false,  // No stencil effects in use, so no need for a stencil buffer
    alpha:     false,    // The canvas is not being blended with objects behind it, so no need to clear the canvas to a transparent state
    antialias: false,
});

// renderer.setClearColor( 0xffffff, 1);
document.body.appendChild( renderer.domElement );

//Bouncing PARAMETERS AND CALC
let acceleration = 9.8;
let bounce_distance = 1;
let bottom_position_y = 0;
let time_step = 0.09;
let time_counter = Math.sqrt(bounce_distance * 2 / acceleration);
let initial_speed = acceleration * time_counter;

function updatePhysics()
{
    objBlackCat.rotation.x += 0.01;
    objBlackCat.rotation.y += 0.01;
    objBlackCat.rotation.y += 0.01;

    objOrangeCat.rotation.x -= 0.01;
    objOrangeCat.rotation.y -= 0.01;
    objOrangeCat.rotation.y -= 0.01;
}

//STATS
const stats = Stats();
document.body.appendChild(stats.dom);

//CONTROLS
const controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents( window ); // optional

//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 5;

controls.maxPolarAngle = Math.PI / 2;

//ANIMATE FUNCTION
function animate()
{
    stats.update()
    updatePhysics();
    renderer.render( scene, camera );

    // request another frame render as soon as the previous one finishes
    requestAnimationFrame( animate );
}

//BOUNCE MODELS
export function onBounceButtonClick()
{
    // while(time_counter > 0)
    // {
    //     if (objBlackCat.position.y < bottom_position_y && objOrangeCat.position.y < bottom_position_y) {
    //         time_counter = 0;
    //     }
    //         // s2 = s1 + ut + (1/2)gt*t formula
    //     //UNIFORMLY ACCELERATED MOTION for BOUNCE
    //     let bounce = bottom_position_y + initial_speed * time_counter - 0.4 * acceleration * time_counter * time_counter;
        
    //     objBlackCat.position.y = bounce;
    //     objOrangeCat.position.y = bounce;
    //     time_counter += time_step;
    // } 
}
//ADD TORUS
export function addDonut(){
    const geometry = new THREE.TorusGeometry(3,1,5,40,7);
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const torus = new THREE.Mesh( geometry, material );
    torus.scale.set(0.01,0.01,0.01);
    torus.position.set(Math.random(50), Math.random(20), Math.random(50));
    scene.add( torus );
    // torus.position.y = bounce;
}

export default init;