import Matter from 'matter-js';
import './style.css';

// --- Matter.js Aliases ---
const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint,
  Events = Matter.Events,
  Body = Matter.Body;

// --- Setup ---
const engine = Engine.create();
const world = engine.world;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: 'transparent', // Let CSS gradient show through
    pixelRatio: window.devicePixelRatio
  }
});

// --- Settings State ---
const settings = {
  restitution: 0.9,
  frictionAir: 0.01,
  attractMode: false
};

// --- Boundaries ---
const wallThickness = 60;
const createWalls = () => {
  const bodies = Composite.allBodies(world);
  const existingWalls = bodies.filter(b => b.label === 'wall');
  Composite.remove(world, existingWalls);

  const width = window.innerWidth;
  const height = window.innerHeight;

  const walls = [
    Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true, label: 'wall', render: { fillStyle: '#333' } }),
    Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true, label: 'wall', render: { visible: false } }),
    Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, label: 'wall', render: { visible: false } }),
    Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, label: 'wall', render: { visible: false } })
  ];
  Composite.add(world, walls);
};

createWalls();

window.addEventListener('resize', () => {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
  createWalls();
});

// --- Mouse Control ---
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false }
  }
});
Composite.add(world, mouseConstraint);
render.mouse = mouse;

// --- Spawner ---
const neonColors = ['#00f0ff', '#ff0055', '#ccff00', '#aa00ff', '#ffffff'];

const spawnShape = (x: number, y: number) => {
  const size = 20 + Math.random() * 40;
  const color = neonColors[Math.floor(Math.random() * neonColors.length)];
  const type = Math.random();

  let body;
  const commonOptions = {
    render: { fillStyle: color },
    restitution: settings.restitution,
    frictionAir: settings.frictionAir
  };

  if (type < 0.33) {
    body = Bodies.circle(x, y, size / 2, commonOptions);
  } else if (type < 0.66) {
    body = Bodies.rectangle(x, y, size, size, commonOptions);
  } else {
    body = Bodies.polygon(x, y, 3 + Math.floor(Math.random() * 3), size / 2, commonOptions);
  }

  Composite.add(world, body);
};

// Initial Batch
for (let i = 0; i < 15; i++) {
  spawnShape(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight * 0.5
  );
}

// --- Antigravity Logic ---
Events.on(engine, 'beforeUpdate', () => {
  if (!settings.attractMode) return;

  const mousePosition = mouse.position;
  const bodies = Composite.allBodies(world);

  bodies.forEach(body => {
    if (body.isStatic) return;

    const forceMagnitude = 0.00005 * body.mass;
    const vector = {
      x: mousePosition.x - body.position.x,
      y: mousePosition.y - body.position.y
    };

    Body.applyForce(body, body.position, {
      x: vector.x * forceMagnitude,
      y: vector.y * forceMagnitude
    });
  });
});

// --- UI Logic & Controls ---

// 1. World Settings
const gravY = document.getElementById('gravity-y') as HTMLInputElement;
const gravX = document.getElementById('gravity-x') as HTMLInputElement;
const timeScale = document.getElementById('time-scale') as HTMLInputElement;
const zeroGravBtn = document.getElementById('zero-grav-btn') as HTMLButtonElement;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;

// Display Elements
const valGravY = document.getElementById('grav-y-val')!;
const valGravX = document.getElementById('grav-x-val')!;
const valTime = document.getElementById('time-scale-val')!;

gravY.addEventListener('input', (e: any) => {
  const val = parseFloat(e.target.value);
  engine.gravity.y = val;
  valGravY.textContent = val.toFixed(1);
});

gravX.addEventListener('input', (e: any) => {
  const val = parseFloat(e.target.value);
  engine.gravity.x = val;
  valGravX.textContent = val.toFixed(1);
});

timeScale.addEventListener('input', (e: any) => {
  const val = parseFloat(e.target.value);
  engine.timing.timeScale = val;
  valTime.textContent = val.toFixed(1);
});

zeroGravBtn.addEventListener('click', () => {
  engine.gravity.y = 0;
  engine.gravity.x = 0;
  gravY.value = "0";
  gravX.value = "0";
  valGravY.textContent = "0.0";
  valGravX.textContent = "0.0";
});

resetBtn.addEventListener('click', () => {
  Composite.clear(world, false);
  Composite.add(world, mouseConstraint);
  createWalls();
  // Reset params to defaults? Optional.
  for (let i = 0; i < 15; i++) {
    spawnShape(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.5);
  }
});


// 2. Physics Settings
const restitutionSlider = document.getElementById('restitution') as HTMLInputElement;
const frictionSlider = document.getElementById('friction-air') as HTMLInputElement;
const attractBtn = document.getElementById('attract-btn') as HTMLButtonElement;

const valBounce = document.getElementById('bounce-val')!;
const valFriction = document.getElementById('friction-val')!;

restitutionSlider.addEventListener('input', (e: any) => {
  const val = parseFloat(e.target.value);
  settings.restitution = val;
  valBounce.textContent = val.toFixed(1);

  // Update existing bodies
  Composite.allBodies(world).forEach(b => {
    if (!b.isStatic) b.restitution = val;
  });
});

frictionSlider.addEventListener('input', (e: any) => {
  const val = parseFloat(e.target.value);
  settings.frictionAir = val;
  valFriction.textContent = val.toFixed(3);

  Composite.allBodies(world).forEach(b => {
    if (!b.isStatic) b.frictionAir = val;
  });
});

attractBtn.addEventListener('click', () => {
  settings.attractMode = !settings.attractMode;
  attractBtn.classList.toggle('active-toggle');
  attractBtn.textContent = settings.attractMode ? "DISABLE ATTRACTION" : "ENABLE ATTRACTION";
});


// 3. Actions
const spawnBtn = document.getElementById('spawn-btn') as HTMLButtonElement;
const pulseBtn = document.getElementById('pulse-btn') as HTMLButtonElement;

spawnBtn.addEventListener('click', () => {
  for (let i = 0; i < 5; i++) {
    spawnShape(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.2);
  }
});

pulseBtn.addEventListener('click', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const center = { x: width / 2, y: height / 2 };

  Composite.allBodies(world).forEach(body => {
    if (body.isStatic) return;

    // Vector from center to body
    const force = {
      x: body.position.x - center.x,
      y: body.position.y - center.y
    };

    // Normalize
    const len = Math.sqrt(force.x * force.x + force.y * force.y);
    if (len > 0) {
      force.x /= len;
      force.y /= len;
    }

    // Apply strong force
    const strength = 0.05 * body.mass;
    Body.applyForce(body, body.position, {
      x: force.x * strength,
      y: force.y * strength
    });
  });
});


// --- Runner ---
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);
