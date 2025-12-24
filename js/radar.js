// Reusable Radar Chart Component
class RadarChart {
  constructor(canvasId, stats, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.stats = stats;
    
    // Options
    this.animate = options.animate !== false;
    this.radius = options.radius || 110;
    this.levels = options.levels || 5;
    this.colors = {
      grid: options.gridColor || '#d1d5db',
      fill: options.fillColor || 'rgba(37,99,235,0.3)',
      stroke: options.strokeColor || '#2563eb',
      text: options.textColor || '#111827'
    };
    
    this.center = this.canvas.width / 2;
    this.progress = 0;
    this.labels = Object.keys(this.stats);
    this.values = Object.values(this.stats);
  }

  // Calculate point on circle
  point(angle, r) {
    return {
      x: this.center + r * Math.cos(angle),
      y: this.center + r * Math.sin(angle)
    };
  }

  // Draw the chart
  draw(animatedValues = null) {
    const values = animatedValues || this.values;
    const count = this.labels.length;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid levels
    this.ctx.strokeStyle = this.colors.grid;
    this.ctx.lineWidth = 1;
    
    for (let l = 1; l <= this.levels; l++) {
      this.ctx.beginPath();
      this.labels.forEach((_, i) => {
        const angle = (2 * Math.PI / count) * i - Math.PI / 2;
        const p = this.point(angle, (this.radius / this.levels) * l);
        i === 0 ? this.ctx.moveTo(p.x, p.y) : this.ctx.lineTo(p.x, p.y);
      });
      this.ctx.closePath();
      this.ctx.stroke();
    }

    // Draw axes
    this.ctx.strokeStyle = this.colors.grid;
    this.labels.forEach((_, i) => {
      const angle = (2 * Math.PI / count) * i - Math.PI / 2;
      const p = this.point(angle, this.radius);
      this.ctx.beginPath();
      this.ctx.moveTo(this.center, this.center);
      this.ctx.lineTo(p.x, p.y);
      this.ctx.stroke();
    });

    // Draw data polygon
    this.ctx.beginPath();
    values.forEach((v, i) => {
      const angle = (2 * Math.PI / count) * i - Math.PI / 2;
      const p = this.point(angle, (v / 100) * this.radius);
      i === 0 ? this.ctx.moveTo(p.x, p.y) : this.ctx.lineTo(p.x, p.y);
    });
    this.ctx.closePath();
    
    // Fill
    this.ctx.fillStyle = this.colors.fill;
    this.ctx.fill();
    
    // Stroke
    this.ctx.strokeStyle = this.colors.stroke;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Draw labels
    this.ctx.fillStyle = this.colors.text;
    this.ctx.font = '12px system-ui';
    
    this.labels.forEach((label, i) => {
      const angle = (2 * Math.PI / count) * i - Math.PI / 2;
      const p = this.point(angle, this.radius + 14);
      
      // Text alignment based on position
      this.ctx.textAlign = p.x < this.center ? 'right' : 
                          p.x > this.center ? 'left' : 'center';
      this.ctx.textBaseline = p.y < this.center ? 'bottom' : 
                             p.y > this.center ? 'top' : 'middle';
      
      this.ctx.fillText(label, p.x, p.y);
    });
  }

  // Animation loop
  animateDraw() {
    this.progress += 0.03;
    const animatedValues = this.values.map(v => v * Math.min(this.progress, 1));
    this.draw(animatedValues);
    
    if (this.progress < 1) {
      requestAnimationFrame(() => this.animateDraw());
    }
  }

  // Update stats and redraw
  updateStats(newStats) {
    this.stats = newStats;
    this.labels = Object.keys(newStats);
    this.values = Object.values(newStats);
    this.draw();
  }

  // Render the chart
  render() {
    if (this.animate) {
      this.progress = 0;
      this.animateDraw();
    } else {
      this.draw();
    }
  }
}
