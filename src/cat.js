
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
let prevRenderTimeStamp = 0;  // store the time that the last frame was rendered so we can calculate elapsed time between frames

// multiple instances of this module will be used, so only store it once in memory
const torusGeometry = new THREE.TorusGeometry(3,1,5,40,7);

//SCENE
const scene = new THREE.Scene();
let objBlackCat  = null;
let objOrangeCat = null;
let objMadi      = null;
let objIvy       = null;
let objCatList   = [];    // also store all cats to a list so any common logic can happen in a loop
let objTorusList = [];    // also store all cats to a list so any common logic can happen in a loop

//CAMERA
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth/ window.innerHeight, 0.1, 1000 );
camera.position.set(-1, 1, 5);
camera.lookAt( scene.position );
scene.add( camera );

//LIGHTING
// bounds of shadow-casting. plane and objects must be contained inside because the shadow map is scaled to this size.
// Any portions of the scene outside of this region will be full bright.
// If you get an object who's shadow is disappearing, then you may need to extend these two values.
const shadowMapWidth  = 3;
const shadowMapHeight = 3;
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(0, 5, 0); // set position of sun just above the top-most object in scene
light.castShadow            = true;
light.shadow.mapSize.width  = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.bias           = -0.02;


// bound the shadow camera such that it fits the whole scene
light.shadow.camera = new THREE.OrthographicCamera(
    -shadowMapWidth / 2,
    shadowMapWidth / 2,
    shadowMapHeight / 2,
    -shadowMapHeight / 2,
    0.5,                    // shadow map includes objects below light.position.y - 0.5
    light.position.y + 0.5, // shadow map includes objects above -0.5
);
scene.add(light)

//Create a helper for the shadow camera (optional). This visualizes the bounds where shadows are cast. Use this when choosing shadowMapWidth and shadowMapHeight
const shadowCameraHelper = new THREE.CameraHelper( light.shadow.camera );
shadowCameraHelper.visible = false; // invisible by default
scene.add( shadowCameraHelper );

const ambientLight = new THREE.AmbientLight( 0xCCCCC0, 0.6);
scene.add( ambientLight );

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

        // If a loaded file is mistakenly a scene instead of a model or is otherwise nested, then return the root 3D mesh.
        // This is needed for correct shadow casting and model rotation behavior.
        models = models.map(obj => {
            if ("scene" in obj)
            {
                obj = obj.scene;
            }

            // The scene contains "Object 3D" objects that aren't directly meshes, and as such applies an internal model offset that stacks on obj.rotation values.
            // Without this loop, setting obj.castShadow = true would not cause the 3D mesh inside to cast shadows.
            while (!obj.isMesh && (obj.children.length > 0))
            {
                obj = obj.children[0];
            }

            return obj;
        });

        //LOAD BLACK CAT
        objBlackCat = models[0];
        objBlackCat.position.set(0.5,1,1);
        objCatList.push(objBlackCat);
        
        //LOAD ORANGE CAT
        objOrangeCat = models[1];
        objOrangeCat.position.set(-0.5,1,1);
        objCatList.push(objOrangeCat);

        //LOAD madi
        objMadi = models[2];
        objMadi.position.set(0.2, 0.5, 0);
        objMadi.rotation.y = -2;
        objCatList.push(objMadi);

        //LOAD IVY MODEL
        objIvy = models[3];
        objIvy.position.set(0.2, 1.5, 0);
        // objIvy.rotation.y = 1;
        objCatList.push(objIvy);
        
        for (let cat of objCatList)
        {
            cat.castShadow    = true;  // allow cats to cast shadows on the plane
            cat.receiveShadow = true;  // allow cats to cast shadows on each other
            scene.add(cat);
        }

        //RESIZES WINDOW
        window.addEventListener('resize', onWindowResize, false);

        // before requesting the first animation frame, update the canvas and camera properties based on the window properties
        onWindowResize();
        
        // Delay rendering until all models are loaded
        prevRenderTimeStamp = performance.now();
        requestAnimationFrame(animate);
    });
}


//FOG
scene.fog = new THREE.Fog( 0x23272a, 0.5, 1700, 4000 );

 //PLANE
 // Note that only shadowMapWidth on the x-axis and shadowMapHeight on the y-axis of this plane will receive shadow. The rest will be full bright.
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry( 40, 40 ),
    new THREE.MeshPhongMaterial( { color: 0x097969, specular: 0x101010 } )
);
plane.rotation.x    = -Math.PI / 2;  // rotate to move y-axis size to be along z-axis
plane.position.y    = -0.25;  // place plane below 0 so that the orbital camera doesn't clip into it
plane.receiveShadow = true;
scene.add( plane );


//RENDERER
renderer = new THREE.WebGLRenderer({
    c:         canvas,
    stencil:   false,  // No stencil effects in use, so no need for a stencil buffer
    alpha:     false,    // The canvas is not being blended with objects behind it, so no need to clear the canvas to a transparent state
    antialias: false,
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
// renderer.setClearColor( 0xffffff, 1);
document.body.appendChild( renderer.domElement );

//Bouncing PARAMETERS AND CALC
let acceleration = 9.8;
let bounce_distance = 1;
let bottom_position_y = 0;
let time_step = 0.09;
let time_counter = Math.sqrt(bounce_distance * 2 / acceleration);
let initial_speed = acceleration * time_counter;

function updatePhysics(currentTimeInMs, deltaTimeInMs)
{
    objBlackCat.rotation.x += 0.01;
    objBlackCat.rotation.y += 0.01;
    objBlackCat.rotation.y += 0.01;

    objOrangeCat.rotation.x -= 0.01;
    objOrangeCat.rotation.y -= 0.01;
    objOrangeCat.rotation.y -= 0.01;

    // Make Ivy and Madi orbit around each other to cast shadows on each other
    const angle  = currentTimeInMs / 1000;
    const radius = 0.5;
    objIvy.position.x = Math.cos(angle) * radius;
    objIvy.position.y = Math.sin(angle) * radius + radius;
    objMadi.position.x = -objIvy.position.x;
    objMadi.position.y = 2 * radius - objIvy.position.y;

    for (const torus of objTorusList)
    {
        torus.rotation.x += 0.02;
        torus.rotation.y += 0.01;
        torus.rotation.z += 0.05;
    }
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
function animate(currentTimeInMs)
{
    let deltaTimeInMs = currentTimeInMs - prevRenderTimeStamp;
    prevRenderTimeStamp = currentTimeInMs;

    // Account for users leaving the tab then coming back. Cap the time delta to as if the tab is running at 30 FPS
    deltaTimeInMs = Math.min(deltaTimeInMs, 1000 / 30);

    stats.update()
    updatePhysics(currentTimeInMs, deltaTimeInMs);
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
export function addDonut()
{
    // Bias light towards brighter colors. The `|0` casts to an integer
    const red   = ((1 - Math.random()**2) * 255)|0;
    const green = ((1 - Math.random()**2) * 255)|0;
    const blue  = ((1 - Math.random()**2) * 255)|0;
    const color = (red << 16) | (green << 8) | blue;

    const x = Math.random() * 2 - 1;
    const y = Math.random();
    const z = Math.random() * 2 - 1;

    // Note: MeshBasicMaterial does not respond to light. It is always full bright.
    // MeshBasicMaterial can cast shadows but not receive them.
    const material = new THREE.MeshStandardMaterial( { color: color } );
    const torus = new THREE.Mesh( torusGeometry, material );
    torus.scale.set(0.01,0.01,0.01);
    torus.position.set(x, y, z);
    torus.castShadow    = true;
    torus.receiveShadow = true;
    scene.add( torus );
    objTorusList.push(torus);
}

export function onShadowMapToggleButtonClick()
{
    shadowCameraHelper.visible = !shadowCameraHelper.visible;
}

export default init;