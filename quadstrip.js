function setup() {
    createCanvas(400, 400, WEBGL);
  }
  
  function draw() {
    background(220);
    fill(255)
    beginShape(QUAD_STRIP);
      vertex(30, 20 + 5);
      vertex(30, 75);
      vertex(50, 20);
      vertex(50, 75);
      vertex(65, 20);
      vertex(65, 75);
      vertex(85, 20);
      vertex(85, 75);
    endShape();
  }