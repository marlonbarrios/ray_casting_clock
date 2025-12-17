const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

// Import classes
const Boundary = require('./boundary.js');
const Particle = require('./particle.js');
const Ray = require('./ray.js');

const settings = {
  dimensions: [ 512, 512 ],
  // Enable export settings
  pixelsPerInch: 300,
  units: 'px',
  // Enable animation
  animate: true,
  // Export settings  
  exportPixelRatio: 2,
  // Playback settings
  fps: 60,
  duration: 'loop',
  // Playback controls
  playbackRate: 'throttle',
  // Title for browser tab
  title: 'Ray Casting Clock - Marlo Barrios Solano'
};

let walls = [];
let particle;
let p5Instance;

const sketch = ({ width, height, canvas }) => {
  // Set document title
  if (typeof document !== 'undefined') {
    document.title = 'Ray Casting Clock - Marlo Barrios Solano';
    
    // Center the canvas
    if (canvas && canvas.parentElement) {
      canvas.parentElement.style.display = 'flex';
      canvas.parentElement.style.justifyContent = 'center';
      canvas.parentElement.style.alignItems = 'center';
      canvas.parentElement.style.minHeight = '100vh';
      canvas.parentElement.style.width = '100%';
    }
    
    // Also style the canvas itself
    if (canvas) {
      canvas.style.display = 'block';
      canvas.style.margin = '0 auto';
    }
  }
  
  // Initialize p5.js in instance mode - don't pass canvas, let p5 create its own
  p5Instance = new p5((p) => {
    p.setup = function() {
      // Create p5 canvas with same dimensions as canvas-sketch
      p.createCanvas(width, height);
      p.noCursor();
      
      // Hide p5 canvas - we'll copy it to canvas-sketch's canvas instead
      if (p.canvas) {
        p.canvas.style.display = 'none'; // Hide p5 canvas, we only want canvas-sketch canvas visible
      }
      
      // Initialize walls
      walls = [];
      
      // Loop that creates the hours as randomly placed obstacles (vertical lines of random sizes)
      for (let i = 0; i < 24; i++) {
        let hoursSize = p.random(100, 200);
        let x1 = i * width / 24;
        let y1 = height / 2 - hoursSize / 2;
        let x2 = i * width / 24;
        let y2 = height / 2 + hoursSize / 2;
        // As boundaries or walls - pass p5 instance
        walls.push(new Boundary(p, x1, y1, x2, y2));
      }
      
      // Walls around the whole canvas - all edges for ray casting
      // Top and left edges are visible, right and bottom are invisible but still block rays
      walls.push(new Boundary(p, -1, -1, width, -1, true)); // Top edge (visible)
      walls.push(new Boundary(p, width, -1, width, height, false)); // Right edge (invisible but functional)
      walls.push(new Boundary(p, width, height, -1, height, false)); // Bottom edge (invisible but functional)
      walls.push(new Boundary(p, -1, height, -1, -1, true)); // Left edge (visible)
      
      // Pass Ray class to Particle by making it available
      particle = new Particle(p, width, height, Ray);
    };
    
    p.draw = function() {
      p.background(255);
      
      p.strokeWeight(0);
      
      for (let wall of walls) {
        wall.show();
      }
      
      const dim = Math.min(width, height);
      
      // Disable fill and set up a stroke - thinner and softer
      p.noFill();
      p.strokeWeight(dim * 0.002); // Thinner
      p.stroke(0); // Pure black
      
      // Get time in milliseconds
      const time = p.millis() / 60000;
      
      // How fast we will spin around
      const speed = 1;
      
      // Scale by 2PI, i.e. a full arc/circle
      const angle = time * p.PI * 2.0 * speed;
      
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
      
      particle.update(px, py);
      particle.show();
      particle.look(walls);
      
      p.fill(255);
      
      let hr = p.hour();
      let mn = p.minute();
      
      let hours = p.map(hr, 0, 24, 0, width);
      let minutes = p.map(mn, 0, 60, 0, height);
      
      p.strokeWeight(1.5); // Thinner
      p.stroke(0); // Pure black
      p.line(width / 2, minutes, px, py);
      
      p.line(hours, height / 2, width / 2, minutes);
      
      p.ellipse(width / 2, minutes, r, r);
      p.stroke(255);
      p.fill(0);
      p.ellipse(hours, height / 2, r * 1.3);
    };
    
    p.keyPressed = function() {
      if (p.key == 'S' || p.key == 's') {
        // canvas-sketch handles export via CLI
        // Use: canvas-sketch sketch-canvas-sketch.js --export
      }
    };
  });
  
  // Return render function - copy p5.js canvas to canvas-sketch canvas each frame
  return ({ context, width, height }) => {
    // Access p5 canvas - it might be in different places depending on p5 version
    let p5Canvas = null;
    if (p5Instance) {
      // Try different ways to access the canvas
      p5Canvas = p5Instance.canvas || 
                 (p5Instance._renderer && p5Instance._renderer.canvas) ||
                 (p5Instance.elt && p5Instance.elt.tagName === 'CANVAS' ? p5Instance.elt : null);
    }
    
    if (p5Canvas) {
      try {
        // Copy p5 canvas content to canvas-sketch canvas
        context.drawImage(p5Canvas, 0, 0, width, height);
      } catch (e) {
        // Canvas might not be ready yet or CORS issue
        console.error('Error copying p5 canvas:', e);
      }
    }
    // Removed test rectangle - no longer needed
  };
};

canvasSketch(sketch, settings);
