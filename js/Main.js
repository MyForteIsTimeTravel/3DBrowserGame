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

const sphereOne = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS),  // Mesh
    new THREE.MeshLambertMaterial({color: 0xA52A2A})    // shader
);

const sphereTwo = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS),  // Mesh
    new THREE.MeshLambertMaterial({color: 0xA52A2A})    // shader
);

const sphereThree = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS),  // Mesh
    new THREE.MeshLambertMaterial({color: 0xA52A2A})    // shader
);

sphereOne.position.y = 24;
sphereOne.position.z = -300;
scene.add(sphereOne);

sphereTwo.position.x -= 200;
sphereTwo.position.y = 18;
sphereTwo.position.z = -500;
scene.add(sphereTwo);

sphereThree.position.x += 200;
sphereThree.position.y = 18;
sphereThree.position.z = -500;
scene.add(sphereThree);


/* * * * * * * * * * * * * * * *
 * ON UPDATE
 * * * * * * * * * * * * * * * */
function update () {
    // timer
    var date = new Date();
    var tick = date.getSeconds();
    
    // animate the light source
    pointLight.position.x += 10 * Math.cos(tick);
    console.log(pointLight.x);
    
    // Draw the scene
    renderer.render(scene, camera); 

    // see you again soon
    requestAnimationFrame(update);
}

// Entry Point
requestAnimationFrame(update);