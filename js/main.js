/* * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  main.js
 *
 *  An attempt at a 3D game engine in JavaScript
 *  using WebGL and Three.js
 *
 *  Ryan Needham
 * * * * * * * * * * * * * * * * * * * * * * * * * * */

const WIDTH     = window.innerWidth
const HEIGHT    = window.innerHeight
const container = document.querySelector('#cont')

/* * * * * * * * * * * * * *
 * Setup WebGL Rendering
 * * * * * * * * * * * * * */
const VIEW_ANGLE = 45
const ASPECT     = WIDTH / HEIGHT
const NEAR       = 0.1
const FAR        = 10000

const renderer = new THREE.WebGLRenderer({antialias: true})
const camera   = new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR
)

const scene      = new THREE.Scene()
scene.background = new THREE.Color(0x202020)
scene.add(camera)

camera.rotation.y = -10 * (Math.PI / 180)
camera.position.z = 360

renderer.setSize(WIDTH, HEIGHT)
renderer.shadowMap.enabled = true
renderer.shadowMap.type    = THREE.PCFSoftShadowMap

// Attach canvas renderer
container.appendChild(renderer.domElement)

/* * * * * * * * * * * * * *
 * Lighting
 * * * * * * * * * * * * * */
const pointLight = new THREE.PointLight(0xFFFFFF)

pointLight.position.x = 10
pointLight.position.y = 300
pointLight.position.z = 145
pointLight.rotation   = 20 * (Math.PI / 180)
pointLight.castShadow = true

scene.add(pointLight)

/* * * * * * * * * * * * * * * *
 * World Objects
 * * * * * * * * * * * * * * * */
const RADIUS    = 50;
const SEGMENTS  = 16;
const RINGS     = 16;

const object_1 = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS),  // Vertex Shader
    new THREE.MeshLambertMaterial({color: 0xFF9800})    // Fragment Shader
);

object_1.castShadow     = true
object_1.receiveShadow  = true
object_1.position.y     = 46
object_1.position.z     = -100
scene.add(object_1);

const object_2 = new THREE.Mesh(
    new THREE.CubeGeometry(48, 48, 48),                 // Vertex Shader
    new THREE.MeshLambertMaterial({color: 0x111111})    // Fragment Shader
);

object_2.castShadow     = true
object_2.receiveShadow  = true
object_2.position.x    -= 200
object_2.position.y     = 40
object_2.position.z     = -200
scene.add(object_2)

const object_3 = new THREE.Mesh(
    new THREE.CubeGeometry(48, 48, 48),                 // Vertex Shader
    new THREE.MeshLambertMaterial({color: 0x111111})    // Fragment Shader
)

object_3.castShadow     = true
object_3.receiveShadow  = true
object_3.position.x    += 200
object_3.position.y     = 40
object_3.position.z     = -200
scene.add(object_3);

const object_4 = new THREE.Mesh (
    new THREE.TorusGeometry( 20, 6, 32, 200 ),          // Vertex Shader
    new THREE.MeshLambertMaterial({color: 0x111111})    // Fragment Shader
)

object_4.castShadow = true
object_4.receiveShadow = true
object_4.position.x += 300 
object_4.position.y = 60
object_4.position.z = -40
scene.add(object_4)

const floor = new THREE.Mesh ( 
    new THREE.PlaneGeometry(1500, 1500, 50, 50),          // Vertex Shader
    new THREE.MeshLambertMaterial( {                      // Fragment Shader
        color: 0x4E342E, side: THREE.DoubleSide
    })
)

floor.receiveShadow = true
floor.position.y    = -20
floor.rotation.x    = 90 * (Math.PI / 180)
scene.add(floor)

/* * * * * * * * * * * * * * * *
 * ON UPDATE
 * * * * * * * * * * * * * * * */
var paused = false
var tick = 0

function update () {
    if (!paused) {
        updateTick()
        updateInput()
        
        // animate objects
        object_1.position.y += Math.cos(tick / 10)
        object_2.rotation.y += 0.005
        object_3.rotation.y -= 0.005
        object_4.rotation.y += 0.05

        // Draw the scene
        renderer.render(scene, camera)
    }
    
    // see you again soon
    requestAnimationFrame(update)
}

// guard against unsafe integer values
function updateTick () {
    switch (tick == Number.MAX_SAFE_INTEGER) {
        case true:  tick = 0; break
        case false: tick++;   break
    }
}

// Entry Point
requestAnimationFrame(update);
