/* * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  Main.js
 *
 *  An attempt at a 3D game engine in JavaScript
 *  using WebGL and Three.js
 *
 *  Ryan Needham
 * * * * * * * * * * * * * * * * * * * * * * * * * * */
// Window Properties
const WIDTH     = window.innerWidth
const HEIGHT    = window.innerHeight
const centralX  = WIDTH / 2
const centralY  = HEIGHT / 2
const container = document.querySelector('#cont')

/* * * * * * * * * * * * * *
 * Input Handling
 * * * * * * * * * * * * * */
var lockable = 
    'pointerLockElement'       in document || 
    'mozPointerLockElement'    in document || 
    'webkitPointerLockElement' in document

function captureMouse() {
    if (lockable) {
        console.log("Mouse Lock available")

        // DEFINE CALLBACKS
        function changeCallback () {
            var moveCallback = updateMouseMovement;
            if (document.pointerLockElement       === container ||
                document.mozPointerLockElement    === container ||
                document.webkitPointerLockElement === container) {
                // Enable the mousemove listener
                document.addEventListener("mousemove", moveCallback, false)
                document.getElementById("heading").innerHTML=""
                document.getElementById("playing").innerHTML="playing..."
                container.style.filter = "blur(0px)"
                
                // unpause game
                paused = false
                
            } else {
                // Disable the mousemove listener
                document.removeEventListener("mousemove", moveCallback, false)
                document.getElementById("playing").innerHTML="click to resume"
                container.style.filter = "blur(16px)"
                                
                // stop drift
                mouseMovementX = 0
                mouseMovementY = 0
                
                // pause game
                paused = true
            }
        }

        var errorCallback = function (event) {console.log("nope :(")}
        
        // Mouse Lock Status Change Listeners
        document.addEventListener('pointerlockchange',       changeCallback, false)
        document.addEventListener('mozpointerlockchange',    changeCallback, false)
        document.addEventListener('webkitpointerlockchange', changeCallback, false)

        // Mouse Lock Error Change Listeners
        document.addEventListener('pointerlockerror',       errorCallback, false)
        document.addEventListener('mozpointerlockerror',    errorCallback, false)
        document.addEventListener('webkitpointerlockerror', errorCallback, false)

        // Ask the browser to lock the pointer
        container.requestPointerLock = 
            container.requestPointerLock ||
            container.mozRequestPointerLock ||
            container.webkitRequestPointerLock

        container.requestPointerLock()
    }
    
    else {
        
        document.getElementById("heading").innerHTML="Sorry..."
        document.getElementById("playing").innerHTML="required APIs aren't supported by your browser"
    }
}

var mouseMovementX
var mouseMovementY

// Keyboard Input Parameters
var shift = false
var wDown = false
var aDown = false
var sDown = false
var dDown = false

/* * * * * * * * * * * * * *
 * Setup WebGL stuff
 * * * * * * * * * * * * * */
const VIEW_ANGLE = 45
const ASPECT     = WIDTH / HEIGHT
const NEAR       = 0.1
const FAR        = 10000
var lookVelocity = new THREE.Vector3(0, 0, -1)

const renderer = new THREE.WebGLRenderer()
const camera   = new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR
)

const scene      = new THREE.Scene()
scene.background = new THREE.Color(0x202020)
scene.add(camera)
camera.position.z = 100
camera.lookAt(lookVelocity)

// start rendering
renderer.setSize(WIDTH, HEIGHT)
renderer.shadowMap.enabled = true
renderer.shadowMap.type    = THREE.PCFSoftShadowMap

// attach to container
container.appendChild(renderer.domElement)

/**
 * Lighting Stuff
 */
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
    new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS),  // Mesh
    new THREE.MeshLambertMaterial({color: 0xFF9800})    // shader
);

object_1.castShadow     = true
object_1.receiveShadow  = true
object_1.position.y     = 46
object_1.position.z     = -200
scene.add(object_1);

const object_2 = new THREE.Mesh(
    new THREE.CubeGeometry(48, 48, 48),                 // Mesh
    new THREE.MeshLambertMaterial({color: 0x111111})    // shader
);

object_2.castShadow     = true
object_2.receiveShadow  = true
object_2.position.x    -= 200
object_2.position.y     = 40
object_2.position.z     = -400
scene.add(object_2)

const object_3 = new THREE.Mesh(
    new THREE.CubeGeometry(48, 48, 48),                 // Mesh
    new THREE.MeshLambertMaterial({color: 0x111111})    // shader
)

object_3.castShadow     = true
object_3.receiveShadow  = true
object_3.position.x    += 200
object_3.position.y     = 40
object_3.position.z     = -400
scene.add(object_3);

const floor = new THREE.Mesh ( 
    new THREE.PlaneGeometry(WIDTH * 2, WIDTH * 2, 50, 50), 
    new THREE.MeshLambertMaterial( { color: 0x4E342E, side: THREE.DoubleSide})
)

floor.receiveShadow = true
floor.position.y    = -20
floor.rotation.x    = 90 * (Math.PI / 180)
scene.add(floor)

/* * * * * * * * * * * * * * * *
 * Handle Input
 * * * * * * * * * * * * * * * */
function updateMouseMovement (event) {    
    mouseMovementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
    mouseMovementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0
}

function updateKeyDown (event) {
    switch (event.keyCode) {
        case 16: shift = true; break
        case 87: wDown = true; break
        case 65: aDown = true; break
        case 83: sDown = true; break
        case 68: dDown = true; break
    }
    
    if (event.keyCode == 27) {
        // Ask the browser to release the pointer
        document.exitPointerLock = 
            document.exitPointerLock ||
            document.mozExitPointerLock ||
            document.webkitExitPointerLock
        
        document.exitPointerLock()
    }
    
    console.log(event.keyCode)
}

function updateKeyUp (event) {
    switch (event.keyCode) {
        case 16: shift = false; break
        case 87: wDown = false; break
        case 65: aDown = false; break
        case 83: sDown = false; break
        case 68: dDown = false; break
    } 
}

/* * * * * * * * * * * * * * * *
 * ON UPDATE
 * * * * * * * * * * * * * * * */
var paused = false
var tick = 0

function update () {
    if (!paused) {
        nextTick();
    
        // movement
        if (wDown) camera.translateZ(-4)
        if (aDown) camera.translateX(-4)
        if (sDown) camera.translateZ(4) 
        if (dDown) camera.translateX(4)
        
        // crouch
        if (shift) camera.position.y = -16; else camera.position.y = 0;

        // look
        var velocity = mouseMovementX * 0.002
        if (mouseMovementX > 0) {camera.rotation.y -= velocity}
        if (mouseMovementX < 0) {camera.rotation.y -= velocity}
        
        // animate objects
        object_1.position.y += Math.cos(tick / 10)
        object_2.rotation.y += 0.005
        object_3.rotation.y -= 0.005

        // Draw the scene
        renderer.render(scene, camera)
    }
    
    // see you again soon
    requestAnimationFrame(update)
}

function nextTick () {
    switch (tick == Number.MAX_SAFE_INTEGER) {
        case true:  tick = 0; break
        case false: tick++;   break
    }
}

// Entry Point
requestAnimationFrame(update);