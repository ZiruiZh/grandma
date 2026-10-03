/** Pointer-driven preparation. Original image files are never changed. */
export const clamp01 = value => Math.max(0, Math.min(1, value));
export const pointDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const pastryArea = family => family === 'cupcake'
  ? { x: .5, y: .27, rx: .43, ry: .24 }
  : { x: .5, y: .5, rx: .43, ry: .43 };
export function insideEllipse(point, area) {
  return ((point.x - area.x) / area.rx) ** 2 + ((point.y - area.y) / area.ry) ** 2 <= 1;
}
export function icingPath(points = []) {
  return points.map((point, i) => `${i === 0 || point.start ? 'M' : 'L'}${(clamp01(point.x) * 100).toFixed(2)},${(clamp01(point.y) * 100).toFixed(2)}`).join(' ');
}

export function bindWorkstations({ root, context, action, commit, feedback }) {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  let frame = 0, gesture = null, ghost = null, lastTime = 0, disposed = false;
  let pendingDistance = 0, lastSound = 0, ignoreClickUntil = 0;
  const listen = (node, type, callback) => node?.addEventListener(type, callback, options);
  const valid = () => {
    const current = context();
    return current?.order && !current.paused && current.order.id === gesture?.orderId;
  };
  const local = (event, node) => {
    const rect = node.getBoundingClientRect();
    return { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
  };
  const progress = (name, value, label) => {
    const meter = root.querySelector(`[data-${name}-meter]`);
    if (meter) { meter.style.setProperty('--progress', String(clamp01(value))); meter.setAttribute('aria-valuenow', String(Math.round(clamp01(value) * 100))); }
    const text = root.querySelector(`[data-${name}-text]`);
    if (text) text.textContent = label;
  };
  const send = payload => {
    if (!valid()) return { ok: false };
    return action({ ...payload, orderId: gesture.orderId });
  };
  const start = (kind, node, event, extra = {}) => {
    if (gesture || disposed || (event.button !== undefined && event.button !== 0)) return;
    const current = context();
    if (!current?.order || current.paused) return;
    event.preventDefault();
    gesture = { kind, node, orderId: current.order.id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: 0, angle: 0, ...extra };
    if (event.pointerId !== undefined) node.setPointerCapture(event.pointerId);
    node.classList.add('is-working');
    lastTime = performance.now();
    frame = requestAnimationFrame(animate);
  };
  const finish = (cancelled = false) => {
    if (!gesture) return;
    cancelAnimationFrame(frame);
    const ended = gesture;
    if (!cancelled && valid()) {
      if (ended.kind === 'mix-drag' && pendingDistance > 0) send({type:'mix',amount:pendingDistance/4});
      if (ended.kind === 'mix-drag' && ended.moved < .02) send({type:'mix',amount:.08});
      if (ended.kind === 'mix-hold' && ended.moved === 0) send({type:'mix',amount:.08});
      if (ended.kind === 'pour-hold' && ended.moved === 0) send({type:'fill-drink',amount:.025});
      if (ended.kind === 'pipe' && ended.inside && ended.point) {
        send({type:'decorate',amount:ended.piped ? pendingDistance * 1.5 : .08,x:ended.point.x,y:ended.point.y,strokeStart:ended.newStroke});
        const order = context().order;
        root.querySelectorAll('[data-icing-path]').forEach(node => node.setAttribute('d',icingPath(order.decoration.points)));
        progress('decor',order.decoration.coverage,`${Math.round(order.decoration.coverage*100)}% iced`);
      }
      if (ended.kind === 'tray' || ended.kind === 'extra') {
        const target = root.querySelector(ended.target);
        const rect = target?.getBoundingClientRect();
        const over = rect && ended.x >= rect.left - 16 && ended.x <= rect.right + 16 && ended.y >= rect.top - 16 && ended.y <= rect.bottom + 16;
        if (ended.moved > 7) {
          ignoreClickUntil = performance.now() + 400;
          if (over) send(ended.payload);
          else feedback('Drop it inside the marked area, or use the button below.');
        } else if (ended.kind === 'extra') send(ended.payload);
      }
    }
    gesture = null; pendingDistance = 0;
    ended.node.classList.remove('is-working');
    ghost?.remove(); ghost = null;
    root.querySelectorAll('.drop-ready').forEach(node => node.classList.remove('drop-ready'));
    root.querySelector('.pour-scene')?.classList.remove('is-pouring');
    const pourTool = root.querySelector('.pour-tool');
    if (pourTool) pourTool.style.transform = 'rotate(0deg)';
    root.querySelector('.piping-tool')?.classList.remove('is-piping');
    if (ended.kind.startsWith('mix') && context().order) progress('mix',context().order.mixProgress,`${Math.round(context().order.mixProgress*100)}% mixed`);
    if (ended.kind.startsWith('pour') && context().order) updateDrink(context().order.drinkPrep);
    if (!disposed) commit(['tray','extra'].includes(ended.kind) || (ended.kind.startsWith('mix') && context().order?.stage !== 'mixing'));
  };
  const animate = now => {
    if (!gesture || !valid()) { finish(true); return; }
    const dt = Math.min(.05, Math.max(0, (now - lastTime) / 1000));
    lastTime = now;
    const g = gesture, order = context().order;
    let work = 0;
    if (g.kind === 'mix-hold' || g.kind === 'mix-drag') {
      work = g.kind === 'mix-hold' ? dt / 4 : pendingDistance / 4;
      pendingDistance = Math.max(0, pendingDistance - work * 4);
      if (work > 0) { send({type:'mix',amount:work}); g.moved += work; g.angle += dt * 9 + work * 22; }
      const whisk = root.querySelector('.whisk-control');
      if (whisk) {
        const x = g.kind === 'mix-drag' ? (g.point.x - .5) * 110 : Math.cos(g.angle) * 30;
        const y = g.kind === 'mix-drag' ? (g.point.y - .55) * 38 : Math.sin(g.angle) * 9;
        whisk.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${(Math.sin(g.angle) * 28).toFixed(2)}deg)`;
      }
      const swirl = root.querySelector('.mixture-rings');
      if (swirl) swirl.style.transform = `rotate(${g.angle * 35}deg)`;
      progress('mix', order.mixProgress, `${Math.round(order.mixProgress * 100)}% mixed`);
      if (order.stage !== 'mixing') { finish(); return; }
    }
    if (g.kind === 'pour-hold' || g.kind === 'pour-drag') {
      const strength = g.kind === 'pour-hold' ? 1 : g.strength;
      work = dt * .16 * strength;
      if (work > 0) { send({type:'fill-drink',amount:work}); g.moved += work; }
      root.querySelector('.pour-scene')?.classList.toggle('is-pouring', strength > .05);
      const tool = root.querySelector('.pour-tool');
      if (tool) tool.style.transform = `rotate(${strength * 38}deg)`;
      updateDrink(order.drinkPrep);
      if (order.drinkPrep.fill >= 1) { finish(); return; }
    }
    if (g.kind === 'pipe' && g.point && g.inside) {
      const distance = Math.min(pendingDistance, .03);
      // A small held squeeze makes tap piping useful without requiring perfect strokes.
      const amount = distance * 1.5 + dt * .035;
      if (distance > .002 || !g.piped || now - (g.lastPipe || 0) > 90) {
        const result = send({type:'decorate',amount,x:g.point.x,y:g.point.y,strokeStart:g.newStroke});
        if (!result.ok) { feedback(result.message); finish(true); return; }
        g.newStroke = false; g.piped = true; g.lastPipe = now;
        pendingDistance = Math.max(0, pendingDistance - distance);
        const path = icingPath(order.decoration.points);
        root.querySelectorAll('[data-icing-path]').forEach(node => node.setAttribute('d', path));
        root.querySelector('.piping-guide')?.classList.add('has-icing');
        progress('decor', order.decoration.coverage, `${Math.round(order.decoration.coverage * 100)}% iced`);
      }
    }
    if (work > 0 && now - lastSound > 300) { lastSound = now; feedback('',g.kind.startsWith('mix') ? 'mix' : 'pour'); }
    frame = requestAnimationFrame(animate);
  };
  function updateDrink(prep) {
    progress('drink', prep.fill / .8, `${Math.round(prep.fill * 100)}% full · stop at 80%`);
    const liquid = root.querySelector('[data-cup-liquid]');
    if (liquid) liquid.setAttribute('y', String(218 - prep.fill * 133));
    const surface = root.querySelector('[data-cup-surface]');
    if (surface) { surface.setAttribute('cy', String(218 - prep.fill * 133)); surface.style.opacity = prep.fill > .01 ? '1' : '0'; }
    root.querySelector('.pour-scene')?.classList.toggle('at-fill-line', prep.fill >= .75 && prep.fill <= .85);
  }
  root.addEventListener('click',event => { if (performance.now() < ignoreClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); } },{signal:abort.signal,capture:true});
  const mixZone = root.querySelector('#mix-zone');
  listen(mixZone,'pointerdown',event => start('mix-drag',mixZone,event,{point:local(event,mixZone)}));
  listen(mixZone,'pointermove',event => {
    if (gesture?.kind !== 'mix-drag') return;
    const next = local(event,mixZone), last = gesture.point;
    const area = {x:.5,y:.55,rx:.49,ry:.46};
    if (insideEllipse(last,area) && insideEllipse(next,area)) pendingDistance += pointDistance(last,next);
    gesture.point = {x:clamp01(next.x),y:clamp01(next.y)};
    gesture.moved += pointDistance(last,next);
  });
  const hold = (selector,kind) => {
    const node = root.querySelector(selector);
    listen(node,'pointerdown',event => start(kind,node,event));
    listen(node,'keydown',event => { if ([' ','Enter'].includes(event.key) && !event.repeat) start(kind,node,event); });
    listen(node,'keyup',event => { if ([' ','Enter'].includes(event.key)) { event.preventDefault(); finish(); } });
  };
  hold('#mix-hold','mix-hold'); hold('#drink-hold','pour-hold');
  const whisk = root.querySelector('.whisk-control');
  listen(whisk,'keydown',event => { if ([' ','Enter'].includes(event.key) && !event.repeat) start('mix-hold',whisk,event); });
  listen(whisk,'keyup',event => { if ([' ','Enter'].includes(event.key)) { event.preventDefault(); finish(); } });
  const pourTool = root.querySelector('.pour-tool');
  listen(pourTool,'pointerdown',event => start('pour-drag',pourTool,event,{strength:.5}));
  listen(pourTool,'pointermove',event => { if (gesture?.kind === 'pour-drag') gesture.strength = clamp01(.5 + (event.clientY - gesture.startY) / 90); });
  listen(pourTool,'keydown',event => { if ([' ','Enter'].includes(event.key) && !event.repeat) start('pour-hold',pourTool,event); });
  listen(pourTool,'keyup',event => { if ([' ','Enter'].includes(event.key)) { event.preventDefault(); finish(); } });
  const canvas = root.querySelector('#decor-canvas.can-pipe');
  const pipePoint = event => {
    const point = local(event,canvas), area = pastryArea(context().order.family);
    const inside = insideEllipse(point,area);
    if (gesture.point && inside && gesture.inside) pendingDistance += Math.min(.08,pointDistance(point,gesture.point));
    if (!gesture.inside && inside) gesture.newStroke = true;
    gesture.point = point; gesture.inside = inside;
    const bag = root.querySelector('.piping-tool');
    if (bag) { bag.classList.toggle('is-piping',inside); bag.style.left = `${point.x * 100}%`; bag.style.top = `${point.y * 100}%`; }
  };
  listen(canvas,'pointerdown',event => { start('pipe',canvas,event,{newStroke:true}); if (gesture?.kind === 'pipe') pipePoint(event); });
  listen(canvas,'pointermove',event => { if (gesture?.kind === 'pipe') pipePoint(event); });
  function drag(node, target, payload) {
    listen(node,'pointerdown',event => start(payload.type === 'drink-extra' ? 'extra' : 'tray',node,event,{target,payload,x:event.clientX,y:event.clientY}));
    listen(node,'pointermove',event => {
      if (gesture?.node !== node || !['tray','extra'].includes(gesture.kind)) return;
      const g = gesture; g.x = event.clientX; g.y = event.clientY; g.moved = Math.hypot(g.x - g.startX,g.y - g.startY);
      if (g.moved < 7) return;
      if (!ghost) { ghost = node.cloneNode(true); ghost.removeAttribute('id'); ghost.className = 'preparation-ghost'; ghost.setAttribute('aria-hidden','true'); document.body.append(ghost); }
      ghost.style.transform = `translate(${g.x - 60}px,${g.y - 50}px) rotate(-4deg)`;
      root.querySelector(target)?.classList.add('drop-ready');
    });
  }
  const tray = root.querySelector('#oven-tray');
  if (tray) drag(tray,'#oven-drop',{type:'start-bake'});
  root.querySelectorAll('[data-drink-extra]').forEach(node => drag(node,'.live-cup',{type:'drink-extra',extra:node.dataset.drinkExtra}));
  listen(root,'pointerup',() => finish());
  listen(root,'pointercancel',() => finish(true));
  listen(root,'lostpointercapture',() => finish(true));
  return {
    get active() { return !!gesture; },
    dispose() { disposed = true; cancelAnimationFrame(frame); abort.abort(); gesture = null; ghost?.remove(); },
  };
}
