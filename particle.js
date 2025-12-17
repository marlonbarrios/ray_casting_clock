// Import Ray if available via require
let RayClass;
try {
  if (typeof require !== 'undefined') {
    RayClass = require('./ray.js');
  }
} catch (e) {
  // Ray will be available globally or passed as parameter
}

class Particle {
    constructor(...args) {
      // Handle both cases: with p5 instance or without (browser/global mode)
      let p, width, height;
      let localRayClass;
      
      if (args.length === 0 || (args.length > 0 && typeof args[0] !== 'object')) {
        // Called as Particle() or Particle(width, height) - browser/global mode
        this.p = null;
        this.width = args[1] || window.width;
        this.height = args[2] || window.height;
        localRayClass = args[3];
      } else if (args.length >= 1 && typeof args[0] === 'object' && args[0].createVector) {
        // Called as Particle(p, width, height, Ray) - p5 instance mode
        [p, width, height, localRayClass] = args;
        this.p = p;
        this.width = width || this.p.width;
        this.height = height || this.p.height;
      } else {
        // Fallback
        this.p = null;
        this.width = window.width;
        this.height = window.height;
        localRayClass = args[args.length - 1];
      }
      
      // Get Ray class from various sources if not passed
      const FinalRayClass = localRayClass || RayClass || 
                   (typeof Ray !== 'undefined' ? Ray : 
                   (typeof require !== 'undefined' ? require('./ray.js') : 
                   (typeof window !== 'undefined' && window.Ray ? window.Ray : null)));
      
      if (!FinalRayClass) {
        throw new Error('Ray class not found. Make sure ray.js is loaded or pass Ray as parameter.');
      }
      
      let createVectorFn, radiansFn;
      if (this.p && this.p.createVector) {
        createVectorFn = this.p.createVector.bind(this.p);
        radiansFn = this.p.radians.bind(this.p);
      } else {
        createVectorFn = createVector;
        radiansFn = radians;
      }
      
      this.pos = createVectorFn(this.width / 2, this.height / 2);
      this.rays = [];
      
      // Cast rays in ALL directions with higher resolution (0.5 degree increments = 720 rays)
      for (let a = 0; a < 360; a += 0.5) {
        this.rays.push(new FinalRayClass(this.p, this.pos, radiansFn(a)));
      }
    }
  
    update(x, y) {
      this.pos.set(x, y);
    }
  
    look(walls) {
      // Get p5 module for Vector class
      let p5Module;
      try {
        p5Module = require('p5');
      } catch (e) {
        // p5 not available as module
      }
      
      let Vector;
      if (p5Module && p5Module.Vector) {
        Vector = p5Module.Vector;
      } else if (typeof p5 !== 'undefined' && p5.Vector) {
        Vector = p5.Vector;
      } else {
        Vector = p5.Vector;
      }
      
      for (let i = 0; i < this.rays.length; i++) {
        const ray = this.rays[i];
        let closest = null;
        let record = Infinity;
        for (let wall of walls) {
          const pt = ray.cast(wall);
          if (pt) {
            const d = Vector.dist(this.pos, pt);
            if (d < record) {
              record = d;
              closest = pt;
            }
          }
        }
        if (closest) {
          if (this.p) {
            // p5 instance mode - pure black
            this.p.stroke(0, 100); // Pure black with full opacity
            this.p.line(this.pos.x, this.pos.y, closest.x, closest.y);
          } else {
            // Global mode (browser)
            stroke(0, 100); // Pure black with full opacity
            line(this.pos.x, this.pos.y, closest.x, closest.y);
          }
        }
      }
    }
  
    show() {
      if (this.p) {
        // p5 instance mode
        this.p.fill(0);
        this.p.ellipse(this.pos.x, this.pos.y, 4);
      } else {
        // Global mode (browser)
        fill(0);
        ellipse(this.pos.x, this.pos.y, 4);
      }
      for (let ray of this.rays) {
        ray.show();
      }
    }
  }

// Export for Node.js, keep global for browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Particle;
}
  