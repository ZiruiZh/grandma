import * as THREE from 'three';

const WHITE = 0xfdfdf9;
const PAPER = 0xf4f4ef;
const INK = 0x171717;
const GREY = 0xbcbcb5;

function outlined(geometry, material, lineColor = INK) {
  const mesh = new THREE.Mesh(geometry, material);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 22),
    new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: .92 }),
  );
  edges.scale.setScalar(1.006);
  mesh.add(edges);
  return mesh;
}

function jitteredLoop(points, z = .02) {
  const values = [];
  points.forEach(([x, y], i) => values.push(x + Math.sin(i * 9.7) * .025, y + Math.cos(i * 7.1) * .025, z));
  values.push(values[0], values[1], z);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(values, 3));
  return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: INK }));
}

function labelStroke(width = 1.7, height = .75) {
  return jitteredLoop([[-width, -height], [width, -height * .96], [width * .98, height], [-width * 1.01, height]]);
}

export class BakeryStage {
  constructor(container, { station = 'counter', order = null, reducedMotion = false } = {}) {
    this.container = container;
    this.station = station;
    this.order = order;
    this.reducedMotion = reducedMotion;
    this.time = 0;
    this.destroyed = false;
    this.scene = new THREE.Scene();
    this.scene.background = null;
    this.camera = new THREE.OrthographicCamera(-6.2, 6.2, 5.2, -5.2, .1, 100);
    this.camera.position.set(8, 7, 12);
    this.camera.lookAt(0, .3, 0);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.domElement.className = 'three-canvas';
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    container.append(this.renderer.domElement);

    this.white = new THREE.MeshToonMaterial({ color: WHITE });
    this.paper = new THREE.MeshToonMaterial({ color: PAPER });
    this.grey = new THREE.MeshToonMaterial({ color: GREY });
    this.ink = new THREE.MeshToonMaterial({ color: INK });
    this.liquid = new THREE.MeshToonMaterial({ color: 0x555550 });
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x999999, 2.8));
    const key = new THREE.DirectionalLight(0xffffff, 3.2); key.position.set(-4, 8, 7); this.scene.add(key);
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    this.build();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
    this.animate = this.animate.bind(this);
    this.frame = requestAnimationFrame(this.animate);
  }

  add(mesh, x = 0, y = 0, z = 0, parent = this.group) {
    mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  }

  box(w, h, d, material = this.white, x = 0, y = 0, z = 0) {
    return this.add(outlined(new THREE.BoxGeometry(w, h, d), material), x, y, z);
  }

  pastry(x, y, z, scale = 1) {
    const family = this.order?.family || 'cookie';
    let mesh;
    if (family === 'cupcake') {
      const group = new THREE.Group();
      const base = outlined(new THREE.CylinderGeometry(.55, .72, .8, 10), this.white); group.add(base);
      const icing = outlined(new THREE.ConeGeometry(.62, .9, 12), this.paper); icing.position.y = .82; group.add(icing);
      mesh = group;
    } else if (family === 'muffin') {
      const group = new THREE.Group();
      group.add(outlined(new THREE.CylinderGeometry(.64, .48, .8, 10), this.white));
      const top = outlined(new THREE.SphereGeometry(.65, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), this.paper); top.position.y = .38; group.add(top); mesh = group;
    } else {
      mesh = outlined(new THREE.CylinderGeometry(.72, .72, .22, 14), this.paper); mesh.rotation.x = Math.PI / 2;
    }
    mesh.position.set(x, y, z); mesh.scale.setScalar(scale); this.group.add(mesh); return mesh;
  }

  person(x = -2.8, grandma = false) {
    const person = new THREE.Group();
    const body = outlined(new THREE.ConeGeometry(1.15, 2.7, 10), this.white); body.position.y = -.9; person.add(body);
    const head = outlined(new THREE.SphereGeometry(.9, 16, 12), this.paper); head.position.y = 1.05; person.add(head);
    const hair = outlined(new THREE.SphereGeometry(grandma ? .62 : .78, 12, 8), this.white); hair.position.set(0, grandma ? 1.86 : 1.62, -.05); hair.scale.y = grandma ? .55 : .7; person.add(hair);
    if (grandma) {
      const bun = outlined(new THREE.SphereGeometry(.38, 10, 8), this.white); bun.position.set(0, 2.25, -.03); person.add(bun);
    }
    for (const sx of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(.075, 8, 6), this.ink); eye.position.set(.3 * sx, 1.12, .78); person.add(eye);
    }
    const smile = new THREE.Mesh(new THREE.TorusGeometry(.26, .035, 6, 18, Math.PI), this.ink); smile.rotation.z = Math.PI; smile.position.set(0, .76, .8); person.add(smile);
    person.position.x = x; this.group.add(person); return person;
  }

  buildEnvironment() {
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 12), this.paper); floor.rotation.x = -Math.PI / 2; floor.position.y = -2.65; this.group.add(floor);
    const back = new THREE.Mesh(new THREE.PlaneGeometry(16, 10), this.white); back.position.set(0, 1.8, -3); this.group.add(back);
    for (let x = -5; x <= 5; x += 2.5) this.group.add(jitteredLoop([[x, -2.5], [x + .12, 4.8]], -.01));
    this.box(12, .35, 2.4, this.paper, 0, -2.3, 0);
  }

  build() {
    this.buildEnvironment();
    if (this.station === 'mixing') this.buildMixing();
    else if (this.station === 'oven') this.buildOven();
    else if (this.station === 'decorating') this.buildDecorating();
    else if (this.station === 'drinks') this.buildDrinks();
    else this.buildCounter();
  }

  buildCounter() {
    const isWelcome = this.container.id === 'three-welcome';
    if (isWelcome) this.person(-1.25, true);
    else {
      const bell = outlined(new THREE.SphereGeometry(.42, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), this.white);
      bell.position.set(-2.6, -.05, .7); this.group.add(bell);
    }
    this.box(4.2, .18, 2.2, this.white, 2, -.35, .2);
    const book = this.box(1.55, .16, 1.25, this.paper, .9, -.05, .15); book.rotation.y = -.25;
    const flyers = new THREE.Group();
    for (let i = 0; i < 3; i++) { const page = outlined(new THREE.BoxGeometry(1.35, .04, .9), this.white); page.position.set(i * .08, i * .08, i * .04); page.rotation.y = .12 * i; flyers.add(page); }
    flyers.position.set(2.8, -.08, .1); this.group.add(flyers);
    this.floaters = [book, flyers];
  }

  buildMixing() {
    const bowl = outlined(new THREE.SphereGeometry(1.7, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), this.white); bowl.scale.y = .72; bowl.position.y = -.15; this.group.add(bowl);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.68, .07, 8, 32), this.ink); rim.rotation.x = Math.PI / 2; rim.position.y = .02; this.group.add(rim);
    const whisk = new THREE.Group();
    const handle = outlined(new THREE.CylinderGeometry(.1, .1, 2.6, 8), this.paper); handle.rotation.z = -.45; whisk.add(handle);
    for (let i = 0; i < 3; i++) { const loop = new THREE.Mesh(new THREE.TorusGeometry(.3 + i * .13, .025, 6, 18), this.ink); loop.position.set(-.55, -1.05 + i * .05, 0); loop.rotation.x = Math.PI / 2; whisk.add(loop); }
    whisk.position.set(.8, 1.15, .35); this.group.add(whisk); this.whisk = whisk;
    this.ingredients = Array.from({ length: 5 }, (_, i) => this.add(outlined(new THREE.SphereGeometry(.16, 8, 6), i % 2 ? this.grey : this.white), -1.1 + i * .5, 2.9 + (i % 2) * .3, .3));
  }

  buildOven() {
    const oven = this.box(6, 5, 2.5, this.paper, 0, .15, -.2);
    const opening = this.box(4.7, 2.6, .08, this.ink, 0, .2, 1.08);
    const tray = this.box(4.1, .14, 1.65, this.grey, 0, -.45, 1.35); this.tray = tray;
    const count = Math.min(3, this.order?.quantity || 3);
    this.bakes = Array.from({length:count}, (_, i) => this.pastry((i-(count-1)/2)*1.3, -.05, 2.05, .72));
    for (let i = 0; i < 3; i++) this.add(new THREE.Mesh(new THREE.SphereGeometry(.12, 8, 6), i === 1 ? this.white : this.grey), -1 + i, 2.05, 1.18);
    this.floaters = [oven];
  }

  buildDecorating() {
    this.pastryMesh = this.pastry(0, -.2, .5, 1.8);
    const bag = outlined(new THREE.ConeGeometry(.55, 2.5, 12), this.white); bag.rotation.z = -.65; bag.position.set(2.4, 2.1, .6); this.group.add(bag); this.pipingBag = bag;
    this.sprinkles = Array.from({length:12},(_,i)=>{ const s=outlined(new THREE.BoxGeometry(.06,.28,.06), i%2?this.ink:this.grey); s.position.set(-1+(i*1.73)%2,2.7+(i%3)*.2,.7); s.rotation.z=i*.7; this.group.add(s); return s; });
  }

  buildDrinks() {
    const cup = outlined(new THREE.CylinderGeometry(1.05, .82, 2.6, 16, 1, true), this.white); cup.position.y = -.25; this.group.add(cup);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(.72, .12, 8, 18, Math.PI * 1.5), this.paper); handle.position.set(1.02, -.15, 0); handle.rotation.y = Math.PI / 2; this.group.add(handle);
    const liquid = outlined(new THREE.CylinderGeometry(.93, .93, .08, 16), this.liquid); liquid.position.y = -.95; this.group.add(liquid); this.liquidMesh = liquid;
    const target = this.order?.drinkPrep?.fill || 0;
    liquid.scale.y = Math.max(.03, target * 22); liquid.position.y = -1.45 + target * 1.18;
    this.steam = Array.from({length:3},(_,i)=>{ const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.45+i*.45,1.15,0),new THREE.Vector3(-.25+i*.4,1.8,.05),new THREE.Vector3(-.5+i*.45,2.5,0)]); const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(14)),new THREE.LineBasicMaterial({color:INK,transparent:true,opacity:.45})); this.group.add(line);return line;});
  }

  react(type) {
    if (this.reducedMotion) return;
    if (type === 'ingredient' && this.ingredients) this.ingredients.forEach((item, i) => { item.position.y += .6 + i * .08; });
    if (type === 'mix' && this.whisk) this.whisk.rotation.y += .9;
    if (type === 'serve') this.group.rotation.y += .08;
  }

  updateDrink(fill = 0) {
    if (!this.liquidMesh) return;
    const level = Math.max(0, Math.min(1, fill));
    this.liquidMesh.scale.y = Math.max(.03, level * 22);
    this.liquidMesh.position.y = -1.45 + level * 1.18;
  }

  resize() {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(width, height, false);
    const aspect = width / height;
    const span = width < 700 ? 5.4 : 5.0;
    this.camera.left = -span * aspect; this.camera.right = span * aspect; this.camera.top = span; this.camera.bottom = -span;
    this.camera.updateProjectionMatrix();
  }

  animate(now) {
    if (this.destroyed) return;
    const t = now * .001; this.time = t;
    if (!this.reducedMotion) {
      this.group.rotation.y = Math.sin(t * .42) * .025;
      if (this.whisk) this.whisk.rotation.y = t * 4.6;
      if (this.bakes) this.bakes.forEach((item, i) => { item.scale.setScalar(.72 + Math.sin(t * 2 + i) * .025); });
      if (this.pipingBag) this.pipingBag.position.y = 2.1 + Math.sin(t * 2.2) * .15;
      this.ingredients?.forEach((item, i) => { item.rotation.x = t * (1 + i * .12); item.position.y -= item.position.y > 3.8 ? .025 : 0; });
      this.sprinkles?.forEach((item, i) => { item.rotation.y = t * (1 + i * .05); });
      this.steam?.forEach((line, i) => { line.position.y = ((t * .28 + i * .32) % 1) * .75; line.material.opacity = .15 + ((t * .5 + i) % 1) * .35; });
      this.floaters?.forEach((item, i) => { item.rotation.z = Math.sin(t * .8 + i) * .018; });
    }
    this.renderer.render(this.scene, this.camera);
    this.frame = requestAnimationFrame(this.animate);
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.frame);
    this.resizeObserver?.disconnect();
    this.scene.traverse(object => { object.geometry?.dispose?.(); if (Array.isArray(object.material)) object.material.forEach(m => m.dispose?.()); else object.material?.dispose?.(); });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

export function createBakeryStage(container, options) {
  if (!container || !window.WebGLRenderingContext) return null;
  try { return new BakeryStage(container, options); } catch { container.classList.add('webgl-fallback'); return null; }
}
