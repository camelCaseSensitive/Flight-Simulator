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
}

function setup() {
    createCanvas(1920, 1080, WEBGL);
    perspective(PI / 3.0, width / height, 10, 50000);
}

let longitude = 0;
let latitude = 0;

function draw() {
    background(151, 203, 242);
    // orbitControl()
    drawCoordinates(3, 100)
    // pointLight(255, 255, 255, 200, -1000, 200)
    // pointLight(255, 255, 255, 200, -500000, 100)
    let brightness = 0.6;
    pointLight(255 * brightness, 255 * brightness, 255 * brightness, 200, -500000, 100)

    // pointLight(255, 255, 255, 200, -50000, 100)
    push()
        translate( 200, -50000, 100)
        texture(earthTexture)
        sphere(300)
    pop()
    // pointLight(255, 255, 255, -900, -1000, 200)
    // camera(-300, -200, -350, 0, 0, 0, 0, -1, 0)

    rotateX(PI/2)
    rotateZ(PI)
    scale(-1, 1, 1)

    camera(0, -400, mouseX*100, 0, 0, 0, 0, -1, 0)
    // camera(1000, mouseX-width/2, mouseY-height/2, 0, 0, 0, 0, 0, -1)
    // camera(mouseX * 1000 + 100, 0, 10000 + mouseX * 1000, 0, 0, 0, 0, 0, -1)
    
    // drawCoordinates(3, 100)
    noStroke()
    lights()
    texture(planeShellTexture)
    model(planeShell)

    // Ailerons
    push()  
        translate(-14.8127 * 50, -3.82249 * 50, 3.74676 * 50)
        rotateZ(-8.5705 * PI / 180)
        rotateX(sin(frameCount/10)/2) // Left Flap rotation
        fill(255)
        model(planeAileron)
    pop()
    push()  
        translate(14.8127 * 50, -3.82249 * 50, 3.74676 * 50)
        rotateZ(8.5705 * PI / 180)
        rotateX(-sin(frameCount/10)/2) // Left Flap rotation
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
        fill(255)
        // scale(-1, 1, 1)
        model(planeElevator)
    pop()
    push()  
        translate(5.77041 * 50, -16.1935 * 50, -0.206385 * 50)
        rotateX(sin(frameCount/30)/2) // Left Elevator rotation
        fill(255)
        scale(-1, 1, 1)
        model(planeElevator)
    pop()

    // Rudder
    push()  
        translate(0, -18.288 * 50, 3.20054 * 50)
        rotateX(21.9022 * PI/180)
        rotateZ(sin(frameCount/40) / 2) // Plane rudder rotation
        model(planeRudder)
    pop()

    fill(200)
    model(planeGear)

    // Propeller
    push()
        translate(0, 8.28285 * 50, 0.03311 * 50) 
        rotateY(-frameCount/2.1)
        model(planePropCone)
        texture(planePropTexture)
        model(planeProp)
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

    
    // rotateX(mouseX/2000 * PI)
    // rotateY(mouseY/2000 * PI)
    let earthScale = 80000;
    // translate(0, 0, -800)
    // rotateZ(PI)
    // texture(earthTexture)
    // plane(8192 * earthScale, 4096 * earthScale)

    push()
        texture(earthTexture)
        translate(0, 0, -earthScale * 1.05)
        rotateX(60)
        rotateX(PI/2)
        rotateX(frameCount/1000)
        sphere(earthScale, 100, 100)
    pop()

    // sphere(2000000 - 300, 100, 100)
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