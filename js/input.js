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

var shift    = false
var wKey     = false
var aKey     = false
var sKey     = false
var dKey     = false
var upKey    = false
var downKey  = false
var leftKey  = false
var rightKey = false

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

// example: https://github.com/luser/gamepadtest

var gamepads = {};

function handleGamepad (event, connecting) {
    var gamepad = event.gamepad;
    
    if (connecting) {
        gamepads[gamepad.index] = gamepad;
    } else {
        delete gamepad[gamepad.index];
    }
}

function pollGamepads () {
    var controller = gamepads[0];
    
    if (typeof(controller) == "object") {
        console.log("button pressed");
    }
}

// listeners
window.addEventListener("gamepadconnected", function (e) {
    console.log("gamepad connected");
    handleGamepad(e, true);
}, false);

window.addEventListener("gamepaddisconnected", function (e) {
    console.log("gamepad disconnected");
    handleGamepad(e, false);
}, false);

/* * * * * * * * * * * * * * * *
 * Handle Input Events
 * * * * * * * * * * * * * * * */
function updateMouseMovement (event) {    
    mouseMovementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
    mouseMovementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0
}

function updateKeyDown (event) {
    switch (event.keyCode) {
        case 16: shift    = true; break
        case 37: leftKey  = true; break
        case 38: upKey    = true; break
        case 39: rightKey = true; break
        case 40: downKey  = true; break
        case 87: wKey     = true; break
        case 65: aKey     = true; break
        case 83: sKey     = true; break
        case 68: dKey     = true; break
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
        case 16: shift    = false; break
        case 37: leftKey  = false; break
        case 38: upKey    = false; break
        case 39: rightKey = false; break
        case 40: downKey  = false; break
        case 87: wKey     = false; break
        case 65: aKey     = false; break
        case 83: sKey     = false; break
        case 68: dKey     = false; break
        case 27: break
    } 
}

function updateInput () {
    pollGamepads();
    
    if (wKey || upKey) camera.translateZ(-4)
    if (aKey || leftKey) camera.translateX(-4)
    if (sKey || downKey) camera.translateZ(4) 
    if (dKey || rightKey) camera.translateX(4)

    // crouch
    if (shift) camera.position.y = -16; else camera.position.y = 0;

    // look
    var velocity = mouseMovementX * 0.002
    if (mouseMovementX > 0) {camera.rotation.y -= velocity}
    if (mouseMovementX < 0) {camera.rotation.y -= velocity}
}