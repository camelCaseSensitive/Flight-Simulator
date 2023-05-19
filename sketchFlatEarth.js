// Blender export settigs: Scale 50 - y-forward, z-up
function preload(){
    planeShell = loadModel('planeShell.obj')
    planeShellTexture = loadImage("planeShellTexture.jpg")

    planeProp = loadModel('planeProp.obj')
    planePropTexture = loadImage("planePropTexture.jpg")
    planePropCone = loadModel('planePropCone.obj')

    planeLeftTire = loadModel('planeLeftTire.obj')
    planeGear = loadModel('planeGear.obj')

    planeHubcaps = loadModel('planeHubcaps.obj')

    planeFrontTire = loadModel('planeFrontTire.obj')
    planeFrontHubcap = loadModel('planeFrontHubcap.obj')

    planeAileron = loadModel('planeAileron.obj')
    planeFlap = loadModel('planeFlap.obj')
    planeElevator = loadModel('planeElevator.obj')
    planeRudder = loadModel('planeRudder.obj')

    earthTexture = loadImage('earth.jpg')
    // earthTexture = loadImage('earth_at_night.jpg')
    // earthNightTexture = loadImage('earth_at_night.jpg')
}

function setup() {
    createCanvas(1920, 1080, WEBGL);
    perspective(PI / 3.0, width / height, 10, 500000);
    updatePlane()
    // console.log(math.rotationMatrix(math.pi / 2, [1, 0, 0]) )
}

let night = false;

let longitude = 0;
let latitude = 0;

let p = {
    x: 0, y: 0, z: 30000,
    rx: 0, ry: 0, rz: 0,
    thrust: 0, drag: 0, lift: 0, g: 1,
    ailerons: 0, flaps: 0, elevators: 0, rudder: 0,
    R: math.rotationMatrix(0, [0, 0, 1]), H: [], follow: 1000, cam: {x: 0, y:0, z: 0}, up: {x: 0, y:0, z: 0}
}


let cam = "FOLLOW";
// let cam = "TOP DOWN";
// let cam = "Orbit";
let camTh = 0;
let camPhi = -0.5
let cameraPanned = false;
let cameraTilt = false;
let cameraFixed = false;
let camFixedPosition = [0, 0, 0]
let updateCamPos = true;

let v = 100;
let v_init = 100;

let dx = 0;
let followCamPos = {x: 0, y: 0, z: 0}

let keysPressed = [];

function draw() {
    let brightness = 0.6;
    if(night){
        background(0)
        brightness = 0.3
    } else {
        background(151, 203, 242);
    }
    frameCount = 1;
    if(cam == "Orbit" ) orbitControl()
    // drawCoordinates(3, 100)
    // pointLight(255, 255, 255, 200, -1000, 200)
    // pointLight(255, 255, 255, 200, -500000, 100)
    pointLight(255 * brightness, 255 * brightness, 255 * brightness, 200, -500000, 100)

    // pointLight(255, 255, 255, 200, -50000, 100)
    // push()
    //     translate(200, -50000, 100)
    //     texture(earthTexture)
    //     sphere(300)
    // pop()
    // pointLight(255, 255, 255, -900, -1000, 200)
    // camera(-300, -200, -350, 0, 0, 0, 0, -1, 0)

    rotateX(PI/2)
    rotateZ(PI)
    scale(-1, 1, 1)

    // p.y += 10;

    p.ailerons = (mouseX - width/2)/1000;
    p.elevators = (mouseY - height/2)/1000;

    if((mouseY - height/2)/100 < 0){
        v -= (mouseY - height/2)/100
    } else {
        v = v_init + (v - v_init) * 0.995
    }

    // Keyboard flight 
    for(let i = 0; i < keysPressed.length; i++){
        if(keysPressed[i] == 87) {
            p.rx = -0.01
            p.ry = 0;
        }
        if(keysPressed[i] == 83) {
            p.rx = 0.01;
            p.ry = 0;
        } 
        if(keysPressed[i] == 65) {
            p.ry = 0.01
            p.rx = 0;
        }
        if(keysPressed[i] == 68) {
            p.ry = -0.01;
            p.rx = 0
        } 

        if(keysPressed[i] == 69){
            camTh += 0.01;
            if(camTh > PI) camTh -= 2*PI
            cameraPanned = true;
        }
        if(keysPressed[i] == 81){
            camTh -= 0.01;
            if(camTh < -PI) camTh += 2*PI
            cameraPanned = true;
        }
        if(keysPressed[i] == 49){
            cameraPanned = false;
        }

        if(keysPressed[i] == 82){
            camPhi += 0.01;
            if(camPhi > PI/2) camPhi -= 2*PI
            cameraTilt = true;
        }
        if(keysPressed[i] == 70){
            camPhi -= 0.01;
            if(camPhi < -PI) camPhi += 2*PI

            cameraTilt = true;
        }

        if(keysPressed[i] == 50){
            cameraTilt = false;
        }

        if(keysPressed[i] === 51){
            console.log(keysPressed[i])
            if(updateCamPos){
                cameraFixed = true;
                updateCamPos = false;
                // camFixedPosition = [p.x, p.y - 1000, p.z]
                camFixedPosition = [p.x + followCamPos.x, p.y + followCamPos.y, p.z + followCamPos.z]
                followCamPos = {x: p.x + followCamPos.x, y: p.y + followCamPos.y, z: p.z + followCamPos.z}
            }
        } else {
            console.log("HI")
            cameraFixed = false;
            updateCamPos = true;
        }
    }
    if(!cameraPanned){
        camTh *= 0.95
    }
    if(!cameraTilt){
        camPhi *= 0.95
    }

    // Mouse flight controls
    p.ry = min(p.ailerons**2, 0.1) * -math.sign(p.ailerons);
    p.rx = min(p.elevators**2, 0.075) * math.sign(p.elevators);
    // p.rz = p.ailerons / 10;
    // dx += 20*sin(p.ry)

    noStroke()
    lights(0.01)
    updatePlane()
    // p.z -= abs(p.ailerons * 100)

    // Camera: x, -z, -y
    // camera(mouseX, -mouseY, 0, 
    //     0, 0, 0, 
    //     0, 1, 0)

    if(cam == "FOLLOW"){
        let camPos = math.multiply([0, -3000, 0], p.R)
        // let up = math.multiply([0, 0, 1], p.R)
        // camera(p.x + camPos[0],  - (p.z + camPos[2]), -(p.y + camPos[1]), p.x, p.y, p.z, 0, 0, -1)
        // camera(p.x, p.y - 3000, p.z + 1000, p.x, p.y, p.z, 0, 0, -1)
        // camera(p.x + camPos[0], p.y + camPos[1], p.z - camPos[2], p.x, p.y, p.z, 0, 0, -1)

        // True follow cam
        // camera(p.x + camPos[0], p.y + camPos[1], p.z - camPos[2], p.x, p.y, p.z, up[0], up[1], -up[2])
        // camera(p.x + camPos[0], p.y + camPos[1], p.z - camPos[2], p.x, p.y, p.z, 0, 0, -1)

        // let camPosTarget = math.multiply([0, -3000, 0], math.transpose(p.R))
        let camPosTarget = math.multiply([-3000 * sin(camTh) * cos(camPhi), -3000 * cos(camTh) * cos(camPhi), 3000 * sin(camPhi)], math.transpose(p.R))
        let up = math.multiply([0, 0, -1], math.transpose(p.R))

        followCamPos = {x: followCamPos.x + (camPosTarget[0] - followCamPos.x)*0.2,
                        y: followCamPos.y + (camPosTarget[1] - followCamPos.y)*0.75,
                        z: followCamPos.z + (camPosTarget[2] + 1000 - followCamPos.z)*0.2}

        // True Follow cam
        // camera(p.x + camPosTarget[0], p.y + camPosTarget[1], p.z + camPosTarget[2], p.x, p.y, p.z, up[0], up[1], up[2])
        
        // Loose folow cam
        // camera(p.x + followCamPos.x, p.y + followCamPos.y, p.z + followCamPos.z, p.x, p.y, p.z, up[0], up[1], up[2])

        // Z-UP Follow cam
        camera(p.x + followCamPos.x, p.y + followCamPos.y, p.z + followCamPos.z, p.x, p.y, p.z, 0, 0, -1)

        // camera(p.cam.x, p.cam.y, p.cam.z, p.x, p.y, p.z, 0, 0, -1)
        // camera(p.cam.x, p.cam.y, p.cam.z, p.x, p.y, p.z, p.up[0], p.up[1], p.up[2])
    } else if(cam == "TOP DOWN"){
        camera(p.x, p.y , p.z + 3000, p.x, p.y, p.z, 0, -1, 0)
    }

    if(cameraFixed){
        camera(camFixedPosition[0], camFixedPosition[1], camFixedPosition[2], p.x, p.y, p.z, 0, 0, -1)
    }

    // camera(p.x, p.y , p.z + 3000, p.x, p.y, p.z, 0, -1, 0)   // Top down cam
    // camera(p.x, p.y - 3000, p.z, p.x, p.y, p.z, 0, 0, -1)  // Follow cam
    // camera(1000, mouseX-width/2, mouseY-height/2, 0, 0, 0, 0, 0, -1)
    // camera(mouseX * 1000 + 100, 0, 10000 + mouseX * 1000, 0, 0, 0, 0, 0, -1)
    
    drawCoordinates(3, 100)
    

    

    // push()
    //     // translate(dx, 0, 0)
    //     rotateY(-PI/2)
    //     arrow(p, {x: p.x, y: p.y, z: p.z - 1000*sin(p.ry)}, 30, {r:255, g: 0, b: 0})
    //     arrow(p, {x: p.x + 1000 * cos(p.ry), y: p.y, z: p.z }, 30, {r:0, g: 255, b: 0})
    // pop()
    
    // rotateX(mouseX/2000 * PI)
    // rotateY(mouseY/2000 * PI)

    // Draw Earth Surface
    push()
        let earthScale = 80;
        translate(0, 0, -800)
        rotateZ(PI)
        texture(earthTexture)
        plane(8192 * earthScale, 4096 * earthScale)
    pop()

    // Draw Airplane
    push()
        // translate(dx, 0, 0)
        translate(p.x, p.y, p.z)

        let eulers = eulerFromMatrix(p.R)
        // console.log(p.R)
        // rotateY(eulers.ry)
        // rotateX(eulers.rx)
        // rotateZ(eulers.rz)

        // applyMatrix(p.R[0][0], p.R[0][1], p.R[0][2], 0, 
        //             p.R[1][0], p.R[1][1], p.R[1][2], 0,
        //             p.R[2][0], p.R[2][1], p.R[2][2], 0,
        //             0, 0, 0, 1)
        applyMatrix(p.R[0][0], p.R[1][0], p.R[2][0], 0, 
                    p.R[0][1], p.R[1][1], p.R[2][1], 0,
                    p.R[0][2], p.R[1][2], p.R[2][2], 0,
                    0, 0, 0, 1)

        drawCoordinates(8, 700)

        drawPlane()
        // arrow({x: 0, y: 0, z:0}, {x: 0, y: 0, z: 1000}, 30, {r: 0, g: 0, b: 255})
    pop()
}

// function draw() {
//     background(151, 203, 242);
//     frameCount = 1;
//     // if(cam == "Orbit" ) orbitControl()
//     // drawCoordinates(3, 100)
//     // pointLight(255, 255, 255, 200, -1000, 200)
//     // pointLight(255, 255, 255, 200, -500000, 100)
//     let brightness = 0.6;
//     pointLight(255 * brightness, 255 * brightness, 255 * brightness, 200, -500000, 100)

//     // pointLight(255, 255, 255, 200, -50000, 100)
//     // push()
//     //     translate(200, -50000, 100)
//     //     texture(earthTexture)
//     //     sphere(300)
//     // pop()
//     // pointLight(255, 255, 255, -900, -1000, 200)
//     // camera(-300, -200, -350, 0, 0, 0, 0, -1, 0)

//     noStroke()
//     lights()
//     // drawCoordinates(3, 100)

//     rotateX(PI/2)
//     rotateZ(PI)
//     scale(-1, 1, 1)

//     drawCoordinates(2, 300)
    


//     translate(0, 0, mouseY)
//     rotateZ(mouseY/100)
//     box(100)

//     // Camera: x, -z, -y
//     camera(mouseX, -mouseY, 0, 
//         0, 0, 0, 
//         0, 1, 0)
// }

function keyPressed() {
    // if(cam == "FOLLOW"){
    //     cam = "TOP DOWN"
    // } else {
    //     cam = "FOLLOW"
    // }
    // if(keyCode == 87) {
    //     keysPressed.push(87)
    //     // p.rx = -0.01
    //     // p.ry = 0;
    // }
    // else if(keyCode == 83) {
    //     keysPressed.push(83)
    //     // p.rx = 0.01;
    //     // p.ry = 0;
    // } 
    // else if(keyCode == 65) {
    //     keysPressed.push(65)
    //     // p.ry = 0.01
    //     // p.rx = 0;
    // }
    // else if(keyCode == 68) {
    //     keysPressed.push(68)
    //     // p.ry = -0.01;
    //     // p.rx = 0
    // } else if (keyCode == 81){
    //     keysPressed.push(81)
    // } else if (keyCode == 69){
    //     keysPressed.push(69)
    // }
    keysPressed.push(keyCode)
}

function keyReleased() {
    console.log(keyCode)
    let index = keysPressed.indexOf(keyCode);
    keysPressed.splice(index, 1)
    console.log(keysPressed)
}

function updatePlane() {
    let roll = math.rotationMatrix(p.ry, [0, 1, 0]);
    let pitch = math.rotationMatrix(p.rx, [1, 0, 0]);
    let yaw = math.rotationMatrix(p.rz, [0, 0, 1]);
    p.R = math.multiply(p.R, roll)
    p.R = math.multiply(p.R, pitch)
    p.R = math.multiply(p.R, yaw)

    p.H = math.multiply([0, v, 0], math.transpose(p.R));

    // p.H = math.multiply([1000, 1000, 1000], p.R)
    // p.H = math.multiply(p.H, sx)
    // p.H = math.multiply(p.H, math.rotationMatrix(PI/2, [1, 0, 0]))
    // p.H = math.multiply(p.H, math.rotationMatrix(PI/2 + frameCount/100, [0, 0, 1]))

    p.x += p.H[0];
    p.y += p.H[1];
    p.z += p.H[2];
}

function drawPlane(){

    // Fuselage
    texture(planeShellTexture)
    model(planeShell)

    // Ailerons
    push()  
        translate(-14.8127 * 50, -3.82249 * 50, 3.74676 * 50)
        rotateZ(-8.5705 * PI / 180)
        // rotateX(sin(frameCount/10)/2) // Left Aileron rotation
        rotateX(-p.ailerons*10) // Left Aileron rotation
        fill(255)
        model(planeAileron)
    pop()
    push()  
        translate(14.8127 * 50, -3.82249 * 50, 3.74676 * 50)
        rotateZ(8.5705 * PI / 180)
        // rotateX(-sin(frameCount/10)/2) // Left Aileron rotation
        rotateX(p.ailerons*10) // Left Aileron rotation
        fill(255)
        scale(-1, 1, 1)
        model(planeAileron)
    pop()

    // Flaps
    push()  
        translate(-5.77041 * 50, -3.79955 * 50, 3.7425 * 50)
        rotateX(sin(frameCount/30)/2) // Left Flap rotation
        fill(255)
        model(planeFlap)
    pop()
    push()  
        translate(5.77041 * 50, -3.79955 * 50, 3.7425 * 50)
        rotateX(sin(frameCount/30)/2) // Right Flap rotation
        fill(255)
        scale(-1, 1, 1)
        model(planeFlap)
    pop()

    // Elevators
    push()  
        translate(-5.77041 * 50, -16.1935 * 50, -0.206385 * 50)
        rotateX(sin(frameCount/30)/2) // Left Elevator rotation
        rotateX(-p.elevators*5) // Left Elevator rotation
        fill(255)
        // scale(-1, 1, 1)
        model(planeElevator)
    pop()
    push()  
        translate(5.77041 * 50, -16.1935 * 50, -0.206385 * 50)
        rotateX(sin(frameCount/30)/2) // Left Elevator rotation
        rotateX(-p.elevators*5) // Left Elevator rotation
        fill(255)
        scale(-1, 1, 1)
        model(planeElevator)
    pop()

    // Rudder
    push()  
        translate(0, -18.288 * 50, 3.20054 * 50)
        rotateX(21.9022 * PI/180)
        // rotateZ(sin(frameCount/40) / 2) // Plane rudder rotation
        rotateZ(-p.rz * 20) // Plane rudder rotation
        model(planeRudder)
    pop()

    // Landing Gear
    push()
        fill(200)
        model(planeGear)
    pop()

    // Propeller
    push()
        translate(0, 8.28285 * 50, 0.03311 * 50) 
        rotateY(-frameCount/2.1)
        fill(200)
        model(planePropCone)
        // texture(planePropTexture)
        // model(planeProp)
    pop()

    // Back Wheels
    push()  
        translate(-7.27285 * 50, -3.0058 * 50, -4.7323 * 50)
        rotateX(-frameCount/100)
        fill(40)
        model(planeLeftTire)
        fill(200)
        model(planeHubcaps)
    pop()
    push()  
        translate(7.27285 * 50, -3.0058 * 50, -4.7323 * 50)
        rotateX(-frameCount/100)
        fill(40)
        model(planeLeftTire)
        fill(200)
        scale(-1, 1, 1)
        model(planeHubcaps)
    pop()

    // Front Wheel
    push()
        translate(0.006033 * 50, 5.36802 * 50, -4.91657 * 50)
        rotateX(-frameCount/100)
        fill(200)
        model(planeFrontHubcap)
        fill(40)
        model(planeFrontTire)
    pop()

    // Propeller Blur Circle
    push()
        translate(0, 8.28285 * 50, 0.03311 * 50) 
        rotateX(PI/2)
        let n = random(200, 255)
        fill(n, n, n, 100)
        noStroke()
        // circle(0, 0, 550)
        ellipse(0, 0, 550, 550, 50)
    pop()
}

function drawCoordinates(thickness, len) {
    // 3D Coordinates
    push()
        noStroke()
        // X Axis
        push()
            fill(255, 0, 0)
            rotateZ(-Math.PI/2)
            translate(0, len/2, 0)
            cylinder(thickness, len)
            translate(0, len/2, 0)
            cone(5, 10)
        pop()

        // Y axis
        push()
            fill(0, 255, 0)
            translate(0, len/2, 0)
            cylinder(thickness, len)
            translate(0, len/2, 0)
            cone(5, 10)
        pop()

        // Z axis
        push()
            fill(0, 0, 255)
            rotateX(Math.PI/2)
            translate(0, len/2, 0)
            cylinder(thickness, len)
            translate(0, len/2, 0)
            cone(5, 10)
        pop()
    pop()
}

function arrow(base, tip, thickness, col) {
    let x1 = base.x;
    let y1 = base.y;
    let z1 = base.z;
    let x2 = tip.x;
    let y2 = tip.y;
    let z2 = tip.z;
    push()
        fill(col.r, col.g, col.b)
        noStroke()
        // translate(x1, y1, z1)
        translate(x1 + (x2-x1)/2, y1 + (y2-y1)/2, z1 + (z2-z1)/2)
        let phi = Math.atan2(z2-z1, Math.sqrt( (x2-x1)**2 + (y2 - y1)**2))
        let th = Math.atan2((y2 - y1), (x2 - x1))

        // Draw vector line
        push()
        rotateZ(th - Math.PI/2)
        rotateX(phi)
        cylinder(thickness-1, Math.sqrt((x2-x1)**2 + (y2-y1)**2 + (z2-z1)**2))
        pop()

        // Draw vector Arrow head
        translate((x2-x1)/2, (y2-y1)/2, (z2-z1)/2)
        rotateZ(th - Math.PI/2)
        rotateX(phi)
        fill(col.r, col.g, col.b)
        cone(5*thickness/2 , 10 * thickness/2)
    pop()
}

function eulerFromMatrix(m){
    return {
        rx: atan2(m[2][1], m[2][2]),
        ry: atan2(-m[2][0], sqrt(m[2][1]**2 + m[2][2]**2)),
        rz: atan2(m[1][0], m[0][0])
    }
}