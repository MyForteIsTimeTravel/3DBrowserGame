/* * * * * * * * * * * * * * * *
 * Window info
 * * * * * * * * * * * * * * * */
const WIDTH     = window.innerWidth;
const HEIGHT    = window.innerHeight;
const container = document.querySelector('#cont');

/* * * * * * * * * * * * * * * *
 * Setup WebGL stuff
 * * * * * * * * * * * * * * * */
const VIEW_ANGLE = 45;
const ASPECT     = WIDTH / HEIGHT;
const NEAR       = 0.1;
const FAR        = 10000;

const renderer = new THREE.WebGLRenderer();
const camera   = new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR
);

const scene      = new THREE.Scene();
scene.background = new THREE.Color( 0x202020 );
scene.add(camera);

// start rendering
renderer.setSize(WIDTH, HEIGHT);

// attach to container
container.appendChild(renderer.domElement);

/* * * * * * * * * * * * * * * *
 * Lighting Stuff
 * * * * * * * * * * * * * * * */
const pointLight = new THREE.PointLight(0xFFFFFF);

pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

scene.add(pointLight);

/* * * * * * * * * * * * * * * *
 * Sphere Object
 * * * * * * * * * * * * * * * */
const RADIUS    = 50;
const SEGMENTS  = 16;
const RINGS     = 16;

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS),  // Mesh
    new THREE.MeshLambertMaterial({color: 0xA52A2A})    // shader
);

sphere.position.z = -300;
sphere.position.y = 24;
scene.add(sphere);

/* * * * * * * * * * * * * * * *
 * ON UPDATE
 * * * * * * * * * * * * * * * */
function update () {
    // timer
    var date = new Date();
    var tick = date.getMilliseconds();
    
    // animate the light source
    pointLight.position.x += 40 * Math.sin(Math.sin(tick));
    console.log(pointLight.x);
    
    // Draw the scene
    renderer.render(scene, camera); 

    // see you again soon
    requestAnimationFrame(update);
}

// Entry Point
requestAnimationFrame(update);