// FRONT-END (CLIENT) JAVASCRIPT HERE

import { Howl } from 'https://cdn.jsdelivr.net/npm/howler@2.2.4/+esm';
import Matter from 'https://cdn.jsdelivr.net/npm/matter-js@0.20.0/+esm'

let Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Common = Matter.Common,
        Query = Matter.Query,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies,
        Events = Matter.Events;

let engine
let render
let runner


// MAKE UI TOGGLE THIS
let editBlock
let activeTool = 'select';

let isPlaying = false;
let bpm = 120
let tick = 0


// base hue (0 – 360)
const INSTRUMENT_HUES = {
  0: 40,   
  1: 200,  
  2: 280,  
  3: 120,  
};

// pitch 0 – 36 -> saturation 30% – 95%
function pitchToSaturation(pitch) {
  const p = Math.max(0, Math.min(36, Number(pitch) || 0));
  return 30 + (p / 36) * 65; 
}

function getColorForLabel(label) {
  if (!label || !label.includes('_')) return '#ffce73'; // fallback

  const [instStr, pitchStr] = label.split('_');
  const inst = Number(instStr);
  const pitch = Number(pitchStr);

  const hue = INSTRUMENT_HUES[inst] ?? 40;
  const sat = pitchToSaturation(pitch);
  const light = 65; 

  return `hsl(${hue}, ${sat}%, ${light}%)`;
}


const message = function (what) {
  const json = { message: what }

  fetch('/debug', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(json)
  })
}

// PIANO ID = 0
// NOTE IDs = (C2 = 0, C#2 = 1, D2 = 2, C3 = 12, C4 = 24)
// SOUND FORMATTING IS assets/sounds/InstrumentID_NoteID.wav, so Piano C3 is assets/sounds/0_12.wav
const playNote = function (intrumentID_noteID, volume) {
  let sound = new Howl({
    src: ['assets/sounds/' + intrumentID_noteID + '.wav'],
    autoplay: true,
    volume: volume,
  });
}

const newId = function () {
  return (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '_' + Math.random());
}

const serializeBody = function(body){
  return{
    id: body.serverId,
    shapeType: body.shapeType,
    label: body.label,
    x: body.position.x,
    y: body.position.y,
    angle: body.angle,
    dims: body.dims,
    colorset: body.colorset || { fill: body.render?.fillStyle }
  };
}

const saveBody = function (body, method) {
  const url = method === 'POST' ? '/bodies' : '/bodies/' + body.serverId;
  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serializeBody(body))
  }).catch(function (e) { console.error('saveBody failed', e); });
}

// added for future implementation
const deleteBody = function(body){
  Composite.remove(engine.world, body);
  if (body.serverId) {
    fetch('/bodies/' + body.serverId, { method: 'DELETE' })
       .catch(function (e) { console.error('deleteBody failed', e); });
  }
}

const loadBodies = async function () {
  const res = await fetch('/bodies');
  if (!res.ok) throw new Error('GET /bodies returned ' + res.status);
  const list = await res.json();
 
  for (const body of list) {
    const d = body.dims || {};
    let made = null;
    if (body.shapeType === 'rectangle') made = addBlock(body.x, body.y, d.width, d.height, body.label, body.id, false, body.colorset?.fill || getColorForLabel(body.label));
    else if (body.shapeType === 'circle') made = addBlockCircle(body.x, body.y, d.radius, body.label, body.id, false, body.colorset?.fill || getColorForLabel(body.label));
    else if (body.shapeType === 'triangle') made = addBlockTriangle(body.x, body.y, d.sides, d.radius, body.label, body.id, false, body.colorset?.fill || getColorForLabel(body.label));
    else if (body.shapeType === 'spawner') made = addSpawner(body.x, body.y, d.radius, body.id, false, body.colorset?.fill || '#68d7ae');
    else if (body.shapeType === 'killbox') made = addKillBox(body.x, body.y, d.width, d.height, body.id, false, body.colorset?.fill || '#ff8b95');
    if (made) Matter.Body.setAngle(made, body.angle);
  }
  return list.length;
}




const makePhysics = async function () {
  engine = Engine.create();

  render = Render.create({
    element: document.querySelector('#canvas-stage'),
    engine: engine,
    options: {
      width: 800,
      height: 600,
      wireframes: false,
      background: '#14151f'
    }
  });

  // boxA = Bodies.rectangle(400, 200, 80, 80);
  // boxB = Bodies.rectangle(450, 50, 80, 80);
  //addBlock(400, 500, 80, 80, "0_0")
  //addBlock(450, 450, 80, 80, "0_2")
  //addBlock(200, 500, 80, 80, "0_1")
 //addBlockTriangle(200, 300, 3, 50, "0_1")
  //addBlockCircle(295, 350, 20, "0_0")
  addKillBox(400, 610, 810, 60)
  //addSpawner(300, 100, 20)

  //Render.run(render);
  //runner = Runner.create();
  //Runner.run(runner, engine);  ** Moved to end of the script


  //https://github.com/liabru/matter-js/blob/master/examples/events.js

  Events.on(engine, 'collisionStart', function (event) {
    let pairs = event.pairs;

    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i];
      if (pair.bodyA.label != "spawner" && pair.bodyB.label != "spawner") {
        if (pair.bodyA.label == "kill" && pair.bodyB.label != "kill") {
          Composite.remove(engine.world, pair.bodyB);
        } else if (pair.bodyA.label != "kill" && pair.bodyB.label == "kill") {
          Composite.remove(engine.world, pair.bodyA);
        } else if (pair.bodyA.label == "entity" && pair.bodyB.label == "entity") {
          // make a satisfying clunk or something idk
        } else if (pair.bodyA.label != "entity" || pair.bodyB.label == "entity") {
          playNote(pair.bodyA.label, 1)
        } else if (pair.bodyA.label == "entity" || pair.bodyB.label != "entity") {
          playNote(pair.bodyB.label, 1)
        }
      }
    }
  });

  let mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

  Composite.add(engine.world, mouseConstraint);

  render.mouse = mouse;

  Events.on(mouseConstraint, 'mousedown', function (event) {
    let mousePosition = event.mouse.position;
    console.log('mousedown at ' + mousePosition.x + ' ' + mousePosition.y);

    if (activeTool === 'rectangle') {
      addBlock(mousePosition.x, mousePosition.y, 40, 40, '0_0');
    } else if (activeTool === 'circle') {
      addBlockCircle(mousePosition.x, mousePosition.y, 25, '0_0');
    } else if (activeTool === 'triangle') {
      addBlockTriangle(mousePosition.x, mousePosition.y, 3, 30, '0_0');
    } else if(activeTool === 'spawner'){
      addSpawner(mousePosition.x, mousePosition.y, 20);
    }else if(activeTool === 'killbox'){
      addKillBox(mousePosition.x, mousePosition.y, 80, 40);
    } else if(activeTool === 'select'){
      var bodies = Query.point(Composite.allBodies(engine.world), mousePosition);
      var selected = null;

      for(var i=0; i<bodies.length; i++){
        if (bodies[i].shapeType){
          selected = bodies[i];
          break;
        }
      }
      editBlock = selected;
      updateInspector(selected);
    } else if (activeTool === 'remove') {
      let bodies = Query.point(Composite.allBodies(engine.world), mousePosition);
      let body = bodies.find(function (candidate) { return candidate.shapeType; });
      if (body) {
        deleteBody(body);
        if (editBlock === body) {
          editBlock = null;
          updateInspector(null);
        }
      }
    }
  });

  Events.on(mouseConstraint, 'mouseup', function (event) {
    let mousePosition = event.mouse.position;
    console.log('mouseup at ' + mousePosition.x + ' ' + mousePosition.y);
  });

  Events.on(mouseConstraint, 'startdrag', function (event) {
    console.log('startdrag', event);
  });

  Events.on(mouseConstraint, 'enddrag', function (event) {
    console.log('enddrag', event);
  });


Render.run(render);
runner = Runner.create();
Runner.run(runner, engine);

// error testing
try {
  const count = await loadBodies();
  if (count === 0) addStarterBodies();
} catch (e) {
  console.error('loadBodies failed, using starter bodies instead', e);
  addStarterBodies();
  }
}

const addSpawner = function (x, y, radius, id, save = true, color = '#68d7ae') {
  let block = Bodies.circle(x, y, radius, { 
    label: "spawner", 
    isStatic: true, 
    isSensor: true,
    render: {
      fillStyle: color,          // main color
      strokeStyle: '#222',     // outline 
      lineWidth: 2,              // outline thickness
      opacity: 1                 // 0–1
    }
  })
  block.shapeType = 'spawner';
  block.serverId = id || newId();
  block.dims = { radius };
  block.colorset = { fill: color };
  Composite.add(engine.world, [block]);
  if (save) saveBody(block, 'POST');
  return block;
}

const addEntity = function (x, y, radius, ) {
  // no serverside... I assume these are temp
  let block = Bodies.circle(x, y, radius, { 
    label: "entity", 
    render: {
      fillStyle: '#c6f2f1',          // main color
      strokeStyle: '#222',     // outline 
      lineWidth: 2,              // outline thickness
      opacity: 0.5                 // 0–1
    } 
  })
  Composite.add(engine.world, [block]);
}

const addBlock = function (x, y, width, height, tag, id, save = true, color) {
  color = color || getColorForLabel(tag);

  let block = Bodies.rectangle(x, y, width, height, { 
    label: tag, 
    isStatic: true, 
    render: {
      fillStyle: color,          // main color
      strokeStyle: '#222',     // outline 
      lineWidth: 2,              // outline thickness
      opacity: 1                 // 0–1
    } 
  })
  block.shapeType = 'rectangle';
  block.serverId = id || newId();
  block.dims = { width, height };
  block.colorset = { fill: color };
  block.collisionFilter = { category: 1, mask: 1, group: 0 };
  Composite.add(engine.world, [block]);
  if (save) saveBody(block, 'POST');
  return block;
}

const addBlockCircle = function (x, y, radius, tag, id, save = true, color) {
  color = color || getColorForLabel(tag);

  let block = Bodies.circle(x, y, radius, { 
    label: tag, 
    isStatic: true,
    render: {
      fillStyle: color,          // main color
      strokeStyle: '#222',     // outline 
      lineWidth: 2,              // outline thickness
      opacity: 1                 // 0–1
    }  
  })
  block.shapeType = 'circle';
  block.serverId = id || newId();
  block.dims = { radius };
  block.colorset = { fill: color };
  block.collisionFilter = { category: 1, mask: 1, group: 0 };
  Composite.add(engine.world, [block]);
  if (save) saveBody(block, 'POST');
  return block;
}

const addBlockTriangle = function (x, y, sides, radius, tag, id, save = true, color) {
  color = color || getColorForLabel(tag);

  let block = Bodies.polygon(x, y, sides, radius, { 
    label: tag, 
    isStatic: true, 
    angle: Math.PI / 2,
    render: {
      fillStyle: color,          // main color
      strokeStyle: '#222',     // outline 
      lineWidth: 2,              // outline thickness
      opacity: 1                 // 0–1
    }  
   })
  block.shapeType = 'triangle';
  block.serverId = id || newId();
  block.dims = { sides, radius };
  block.colorset = { fill: color };
  block.collisionFilter = { category: 1, mask: 1, group: 0 };
  Composite.add(engine.world, [block]);
  if (save) saveBody(block, 'POST');
  return block;
}

const addKillBox = function (x, y, width, height, id, save = true, color = '#ff8b95') {
  let block = Bodies.rectangle(x, y, width, height, { 
    label: "kill", 
    isStatic: true,
    render: {
      fillStyle: color,          // main color
      strokeStyle: '#222',     // outline 
      lineWidth: 0,              // outline thickness
      opacity: 0.5                 // 0–1
    }
   })
  block.shapeType = 'killbox';
  block.serverId = id || newId();
  block.dims = { width, height };
  block.colorset = { fill: color };
  Composite.add(engine.world, [block]);
  if (save) saveBody(block, 'POST');
  return block;
}

const editBlockStuff = function (instrumentID, pitchID, angle) {
  editBlock.label = instrumentID + "_" + pitchID
  editBlock.angle = Matter.Body.setAngle(editBlock, angle)
  saveBody(editBlock, 'PUT');
}


// loops before every browser repaint
const loop = function () {
  // temporal recursion, call tthe function in the future
  window.requestAnimationFrame(loop)
  if (!engine || !isPlaying) return;
  tick++
  if (tick > bpm) {
    console.log(tick)
    tick = 0

    let bodies = Composite.allBodies(engine.world);
    for (let i = 0; i < bodies.length; i++) {
      if (bodies[i].label == "spawner") {
        addEntity(bodies[i].position.x, bodies[i].position.y, 25)
      }
    }
  }
}

function updateInspector(body) {
  var instrumentInput = document.querySelector('#instrument-input');
  var pitchInput = document.querySelector('#pitch-input');
  var angleInput = document.querySelector('#angle-input');

  instrumentInput.disabled = true;
  pitchInput.disabled = true;
  angleInput.disabled = true;

  instrumentInput.value = '';
  pitchInput.value = '';
  angleInput.value = '';


  if (body == null) return;

  var degrees = Math.round(body.angle * 180 / Math.PI);
  if (degrees < 0 || degrees > 360) {
    degrees = ((degrees % 360) + 360) % 360;
  }
  angleInput.value = degrees;
  angleInput.disabled = body.shapeType === 'spawner';

  if (body.label.includes('_')) {
    var parts = body.label.split('_');
    instrumentInput.value = parts[0];
    pitchInput.value = parts[1];
    instrumentInput.disabled = false;
    pitchInput.disabled = false;
  }
}

window.onload = function () {
  console.log("Started")
  var buttons = document.querySelectorAll('.shape-panel button');

  for (var i = 0; i < buttons.length; i++){
    buttons[i].addEventListener('click', function (){
      activeTool = this.getAttribute('data-shape') || 'select';

      for (var j=0; j< buttons.length; j++){
        if (buttons[j]===this) {
          buttons[j].setAttribute('aria-pressed', 'true');
        } else {
          buttons[j].setAttribute('aria-pressed', 'false');
        }}
    });
  }

  var instrumentInput = document.querySelector('#instrument-input');
  var pitchInput = document.querySelector('#pitch-input');
  var angleInput = document.querySelector('#angle-input');

  for (var pitch = 0; pitch <= 36; pitch++) {
    var pitchOption = document.createElement('option');
    pitchOption.value = pitch;
    pitchOption.textContent = pitch;
    pitchInput.appendChild(pitchOption);
  }

  for (var angle = 0; angle <= 360; angle++) {
    var angleOption = document.createElement('option');
    angleOption.value = angle;
    angleOption.textContent = angle + '°';
    angleInput.appendChild(angleOption);
  }

  function updateSound() {
    if (editBlock == null) return;
    if (!instrumentInput.checkValidity()) return;
    if (!pitchInput.checkValidity()) return;

    const newLabel = instrumentInput.value + '_' + pitchInput.value;
    editBlock.label = newLabel;

    // update color based on instrument + pitch
    const newColor = getColorForLabel(newLabel);
    editBlock.render.fillStyle = newColor;
    editBlock.colorset = { fill: newColor };

    saveBody(editBlock, 'PUT');
  }
  instrumentInput.addEventListener('change', updateSound);
  pitchInput.addEventListener('change', updateSound);

  angleInput.addEventListener('change', function() {
    if (editBlock == null) return;
    if (!angleInput.checkValidity()) return;

    var radians = Number(angleInput.value) * Math.PI / 180;
    Matter.Body.setAngle(editBlock, radians);
    saveBody(editBlock, 'PUT');
  });



  document.querySelector('#start-button').addEventListener('click', () => {
    document.querySelector('#start-screen').remove();
    tick = bpm;
    isPlaying = true;
  });

  makePhysics()
  loop()


}

