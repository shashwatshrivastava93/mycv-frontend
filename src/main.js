import './style.css';

const canvas = document.getElementById('antigravity-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = {
  x: null,
  y: null,
  radius: 120
};

// Resize canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Mouse tracking
window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener('click', () => {
  // Explosion burst
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(mouse.x, mouse.y));
  }
});

class Particle {
  constructor(x, y) {
    this.x = x || Math.random() * canvas.width;
    this.y = y || Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.dx = (Math.random() - 0.5) * 1.5;
    this.dy = (Math.random() - 0.5) * 1.5;
    this.color = 'rgba(0,255,255,0.8)';
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    // Wrap edges
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;

    // Mouse repulsion
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < mouse.radius) {
      this.x -= dx / 10;
      this.y -= dy / 10;
    }

    this.draw();
  }
}

// Connect particles
function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let distance = dx * dx + dy * dy;

      if (distance < 10000) {
        ctx.strokeStyle = 'rgba(0,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

// Init
function init() {
  particles = [];
  for (let i = 0; i < 120; i++) {
    particles.push(new Particle());
  }
}

// Animate
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => p.update());
  connectParticles();
  requestAnimationFrame(animate);
}

init();
animate();