
// 2D Ray Casting

class Boundary {
    constructor(...args) {
      // Handle both cases: with p5 instance or without (browser/global mode)
      let visible = true; // Default to visible
      
      if (args.length === 4 && typeof args[0] === 'number') {
        // Called as Boundary(x1, y1, x2, y2) - browser/global mode
        this.p = null;
        const [x1, y1, x2, y2] = args;
        this.a = createVector(x1, y1);
        this.b = createVector(x2, y2);
      } else if (args.length >= 5 && typeof args[0] === 'object' && args[0].createVector) {
        // Called as Boundary(p, x1, y1, x2, y2, visible?) - p5 instance mode
        const [p, x1, y1, x2, y2, vis] = args;
        this.p = p;
        this.a = this.p.createVector(x1, y1);
        this.b = this.p.createVector(x2, y2);
        visible = vis !== undefined ? vis : true;
      } else {
        // Fallback - assume browser mode
        this.p = null;
        const [x1, y1, x2, y2] = args.slice(-4);
        this.a = createVector(x1, y1);
        this.b = createVector(x2, y2);
      }
      this.visible = visible;
    }
  
    show() {
      // Only draw if visible
      if (!this.visible) return;
      
      if (this.p) {
        // p5 instance mode - thinner and softer
        this.p.strokeWeight(1);
        this.p.stroke(0); // Pure black
        this.p.line(this.a.x, this.a.y, this.b.x, this.b.y);
      } else {
        // Global mode (browser)
        strokeWeight(1);
        stroke(0); // Pure black
        line(this.a.x, this.a.y, this.b.x, this.b.y);
      }
    }
  }

// Export for Node.js, keep global for browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Boundary;
}
  