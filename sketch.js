let canvas;
let walls = [];
let ray;
let particle;
let curve;

let half;
let hoursSize;
let minutesSize;
let secondsSize;

function setup() {
  //template for canvas while printing and exporting/exhition on web/minimal
  canvas = createCanvas(1024, 1024); // will export as 512x512
  canvas.style("margin", "auto");
  canvas.style("margin-top", "5%");
  canvas.style("display", "flex");
  canvas.style("justify-content", "center");
  canvas.style("align-items", "center");
  canvas.style("border-radius", "10px");
  canvas.style("position", "relative");
  canvas.style("box-shadow", "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)");
  canvas.style("zoom", "0.5");
  canvas.style('dpi', '300');
  canvas.style('bleed', '1/8');



  //loop that created the hours as randomly placed obstacles (vertical lines of remadom sizes)
  for (let i = 0; i < 24; i++) {
    (i % 2 == 0) ? hoursSize = random(100, 200): hoursSize = random(100, 200);
    let x1 = i * width / 24;
    let y1 = height / 2 - hoursSize / 2;


    let x2 = i * width / 24;

    let y2 = height / 2 + hoursSize / 2;
    //as baoundaries or walls
    walls.push(new Boundary(x1, y1, x2, y2));

  }

  //walls around the whole` 
  walls.push(new Boundary(-1, -1, width, -1));
  walls.push(new Boundary(width, -1, width, height));
  walls.push(new Boundary(width, height, -1, height));
  walls.push(new Boundary(-1, height, -1, -1));
  particle = new Particle();

  noCursor();
  rotate(-90)
}


function draw() {
  //clear();
  background(255);

  strokeWeight();


  for (let wall of walls) {
    wall.show();
  }
  let sc = second();
  let mn = minute();
  let hr = hour();
  let milliseconds = millis();








  const dim = Math.min(width, height);

  // Disable fill and set up a stroke
  noFill();
  strokeWeight(dim * 0.005);
  stroke(0);

  // The equation for an arc is like so:
  //(x, y) + (sin(angle), cos(angle)) * radius

  // Get time in seconds
  //const time = second()/60;
  const time = millis() / 60000;

  // How fast we will spin around
  const speed = 1;

  // Scale by 2PI, i.e. a full arc/circle
  const angle = time * PI * 2.0 * speed;

  // The center of the screen
  const cx = width / 2;
  const cy = height / 2;

  // Get the XY position on a unit arc using trigonometry
  const u = Math.cos(angle);

  const v = Math.sin(angle);

  // Choose the size of the arc we will draw
  const radius = dim * 0.40;

  // Get the final position
  const px = cx + u * radius;
  const py = cy + v * radius;


  // This is the radius for the actual shape/ellipse we will draw
  const r = dim * 0.05;

  // Finally draw the circle
  // ellipse(px, py, r, r);

  particle.update(px, py);
  particle.show();
  particle.look(walls);

  fill(255)

  let hours = map(hr, 0, 24, 0, width);
  let minutes = map(mn, 0, 60, 0, height);

  strokeWeight(4);
  stroke(0);
  line(width / 2, minutes, px, py);

  line(hours, height / 2, width / 2, minutes);

  ellipse(width / 2, minutes, r, r);
  stroke(255)
  fill(0)
  ellipse(hours, height / 2, r * 1.3)


}


function keyPressed() {
  if (key == 'S' || key == 's') {
    saveCanvas(canvas, 'time_engine', 'png');
  }
}
