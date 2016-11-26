/* * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  input.js
 *
 *  This code deals with locking the cursor in the
 *  window and managing keyboad / mouse input.
 *
 *  Ryan Needham
 * * * * * * * * * * * * * * * * * * * * * * * * * * */
var lockable = 
    'pointerLockElement'       in document || 
    'mozPointerLockElement'    in document || 
    'webkitPointerLockElement' in document

var mouseMovementX = 0
var mouseMovementY = 0
var shift          = false
var wDown          = false
var aDown          = false
var sDown          = false
var dDown          = false

/** 
 *  changeCallback
 *
 *      To be called when the pointer lock status 
 *      changes (aquired or released)
 */
var changeCallback = function () {
    var moveCallback = updateMouseMovement;
    var locked = 
        document.pointerLockElement       === container ||
        document.mozPointerLockElement    === container ||
        document.webkitPointerLockElement === container
    
    switch (locked) {
        case true:
            // Listen to mouse movement
            document.addEventListener("mousemove", moveCallback, false)
            
            // User feedback
            document.getElementById("heading").innerHTML=""
            document.getElementById("playing").innerHTML="playing..."
            container.style.filter = "blur(0px)"

            // unpause game
            paused = false
            break;
        case false:
            // Stop listening to mouse movement
            document.removeEventListener("mousemove", moveCallback, false)
            
            // User feedback
            document.getElementById("playing").innerHTML="click to resume"
            container.style.filter = "blur(16px)"

            // stop drift
            mouseMovementX = 0
            mouseMovementY = 0

            // pause game
            paused = true
            break;
    }
}

/** 
 *  errorCallback
 *
 *      To be called when the pointer aquisition
 *      fails. Event holds no data and is completely
 *      useless.
 */
var errorCallback = function (event) {
    console.log("nope :(")
}

/** 
 *  captureMouse
 *
 *      Called when the user activates mouse capture
 */
function captureMouse() {
    switch (lockable) {
        case true:
            console.log("Mouse Lock available")
        
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
            break;
        case false:
            // Mouse Lock not available
            document.getElementById("heading").innerHTML="Sorry..."
            document.getElementById("playing").innerHTML="required APIs aren't supported by your browser"
            break;
    }
}

/* * * * * * * * * * * * * * * *
 * Handle Input Events
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
        case 27:
            // Ask the browser to release the pointer
            document.exitPointerLock = 
            document.exitPointerLock ||
            document.mozExitPointerLock ||
            document.webkitExitPointerLock
        
            document.exitPointerLock()
            break
    }
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

function updateInput () {
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
}