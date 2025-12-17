
// Get p5 module for Vector class
let p5Module;
try {
  p5Module = require('p5');
} catch (e) {
  // p5 not available as module, will use global
}

class Ray {
    constructor(p, pos, angle) {
      this.p = p; // p5 instance
      this.pos = pos;
      // Access p5.Vector - in p5 instance mode, Vector is available on the p5 module
      if (p5Module && p5Module.Vector) {
        this.dir = p5Module.Vector.fromAngle(angle);
      } else if (typeof p5 !== 'undefined' && p5.Vector) {
        this.dir = p5.Vector.fromAngle(angle);
      } else {
        // Fallback - try to use global p5
        this.dir = p5.Vector.fromAngle(angle);
      }
    }
  
    lookAt(x, y) {
      this.dir.x = x - this.pos.x;
      this.dir.y = y - this.pos.y;
      this.dir.normalize();
    }
  
    show() {
      if (this.p) {
        // p5 instance mode
        this.p.stroke(0);
        this.p.push();
        this.p.translate(this.pos.x, this.pos.y);
        this.p.line(0, 0, this.dir.x * 10, this.dir.y * 10);
        this.p.pop();
      } else {
        // Global mode (browser)
        stroke(0);
        push();
        translate(this.pos.x, this.pos.y);
        line(0, 0, this.dir.x * 10, this.dir.y * 10);
        pop();
      }
    }
  
    cast(wall) {
      const x1 = wall.a.x;
      const y1 = wall.a.y;
      const x2 = wall.b.x;
      const y2 = wall.b.y;
  
      const x3 = this.pos.x;
      const y3 = this.pos.y;
      const x4 = this.pos.x + this.dir.x;
      const y4 = this.pos.y + this.dir.y;
  
      const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
      if (den == 0) {
        return;
      }
  
      const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
      const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
      if (t > 0 && t < 1 && u > 0) {
        let pt;
        if (this.p && this.p.createVector) {
          pt = this.p.createVector();
        } else {
          pt = createVector();
        }
        pt.x = x1 + t * (x2 - x1);
        pt.y = y1 + t * (y2 - y1);
        return pt;
      } else {
        return;
      }
    }
  }

// Export for Node.js, keep global for browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Ray;
}
  