/* P10X identity field. Original renderer; samples the existing P10X vector mark. */
(() => {
  'use strict';
  const hero = document.getElementById('p10x-motion-hero');
  if (!hero) return;
  let canvas = hero.querySelector('.pm-canvas');
  const mark = hero.querySelector('.pm-mark-fallback svg');
  const pause = hero.querySelector('.pm-pause');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 767px)');
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const fract = n => n - Math.floor(n);
  const random = n => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453);
  const points = [];
  const mask = document.createElement('canvas');
  mask.width = 704; mask.height = 205;
  const maskContext = mask.getContext('2d', { willReadFrequently: true });
  if (!maskContext || typeof Path2D === 'undefined') return;
  maskContext.scale(mask.width / 1761.07, mask.height / 513.31);
  mark.querySelectorAll('path').forEach(path => {
    maskContext.fillStyle = path.getAttribute('fill');
    maskContext.fill(new Path2D(path.getAttribute('d')));
  });
  const pixels = maskContext.getImageData(0, 0, mask.width, mask.height).data;
  const samples = [];
  for (let y = 0; y < mask.height; y += 2) for (let x = 0; x < mask.width; x += 2) {
    const k = (y * mask.width + x) * 4;
    if (pixels[k + 3] > 160) samples.push([x, y, pixels[k] < 100 ? 0 : 1]);
  }
  if (!samples.length) return;
  function sphere(seed, radius) {
    const y = 1 - 2 * random(seed + 2), phi = random(seed + 7) * Math.PI * 2;
    const r = Math.sqrt(1 - y * y);
    return [Math.cos(phi) * r * radius, y * radius, Math.sin(phi) * r * radius];
  }
  const logoCount = mobile.matches ? 5700 : 8800;
  for (let i = 0; i < logoCount; i++) {
    const p = samples[Math.floor(random(i + 1) * samples.length)];
    const x = ((p[0] + random(i + 9) * 1.8) / mask.width - .5) * 1.83;
    const y = -((p[1] + random(i + 19) * 1.8) / mask.height - .5) * .534;
    const z = (random(i + 29) - .5) * .17;
    points.push({ x, y, z, kind: 0, cyan: p[2] === 0, cloud: sphere(i * 2.7 + 23, 1.03) });
  }
  const shellCount = mobile.matches ? 6500 : 10800;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < shellCount; i++) {
    const y = 1 - (i + .5) / shellCount * 2;
    const ring = Math.sqrt(1 - y * y), angle = golden * i;
    const x = Math.cos(angle) * ring, z = Math.sin(angle) * ring;
    const radius = 1.075 + (random(i + 92) - .5) * .015;
    points.push({ x: x * radius, y: y * radius, z: z * radius, kind: 1, cyan: random(i + 53) > .13 });
  }
  for (let i = 0; i < (mobile.matches ? 550 : 1100); i++) {
    const p = sphere(i + 800, 1.09 + Math.pow(random(i + 921), 2) * .43);
    points.push({ x: p[0], y: p[1], z: p[2], kind: 2, cyan: true });
  }
  let width = 1, height = 1, radius = 1, cx = 0, cy = 0, dpr = 1;
  let elapsed = reduced.matches ? 3 : 0, last = 0, raf = 0, visible = true, paused = reduced.matches;
  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0, active = 0, targetActive = 0;
  let gl, ctx, program, uniforms, engine = 'canvas2d';
  const impacts = [];
  let frames = 0, drawTotal = 0, measureAt = 0;
  const vertex = `
    precision highp float;
    attribute vec3 aPosition;
    attribute vec3 aCloud;
    attribute vec2 aKind;
    uniform vec2 uSize;
    uniform vec2 uCenter;
    uniform float uRadius;
    uniform float uDpr;
    uniform float uTime;
    uniform float uReveal;
    uniform vec3 uPointer;
    uniform vec4 uImpacts[4];
    varying vec3 vColor;
    varying float vAlpha;
    void main(){
      float logo=1.0-step(.5,aKind.x);
      vec3 p=mix(aCloud,aPosition,mix(1.0,uReveal,logo));
      float yaw=mix(uTime*.045,sin(uTime*.24)*.10+sin(uTime*.11)*.06+uPointer.x*.10-(1.0-uReveal)*1.4,logo);
      float tilt=.13+uPointer.y*.045;
      float a=cos(yaw),b=sin(yaw),c=cos(tilt),d=sin(tilt);
      p=vec3(a*p.x+b*p.z,p.y,-b*p.x+a*p.z);
      p=vec3(p.x,c*p.y-d*p.z,d*p.y+c*p.z);
      float proximity=exp(-length(p.xy-uPointer.xy)*5.0)*uPointer.z;
      float shock=0.0;
      for(int i=0;i<4;i++){
        float age=uTime-uImpacts[i].z;
        float delta=length(p.xy-uImpacts[i].xy)-age*.83;
        float ripple=exp(-delta*delta*75.0)*exp(-max(age,0.0)*1.2)*uImpacts[i].w;
        if(age>=0.0&&age<4.0)shock+=ripple;
      }
      p+=normalize(p+vec3(.0001))*(shock*.12+proximity*.025);
      float perspective=1.0/(1.0-p.z*.13);
      vec2 pixel=uCenter+vec2(p.x,-p.y)*uRadius*perspective;
      gl_Position=vec4(pixel.x/uSize.x*2.0-1.0,1.0-pixel.y/uSize.y*2.0,0.0,1.0);
      float rim=pow(1.0-abs(p.z/1.08),3.0);
      float light=clamp(.55-p.x*.22+p.y*.35+p.z*.22,0.0,1.0);
      float shellAlpha=(.035+rim*.53+pow(light,8.0)*.48)*(p.z>0.0?1.0:.32);
      float quiet=1.0-(1.0-step(.94,abs(p.x)))*(1.0-step(.33,abs(p.y)))*.83;
      shellAlpha*=quiet;
      float alpha=mix(shellAlpha,.65+light*.35,logo);
      if(aKind.x>1.5)alpha=(.06+light*.10)*(.6+.4*sin(uTime*.35+aPosition.y*9.0));
      alpha+=shock*.5+proximity*.2;
      vec3 cyan=mix(vec3(.012,.64,.72),vec3(.35,1.0,1.0),light*.65+shock*.2);
      vec3 white=vec3(.91,.96,.97);
      vColor=mix(white,cyan,aKind.y);
      vAlpha=clamp(alpha,0.0,1.0);
      float pointSize=mix(.88,1.13,logo)+rim*.2+shock*.7;
      if(aKind.x>1.5)pointSize=.65;
      gl_PointSize=max(1.0,pointSize*uDpr*perspective);
    }`;
  const fragment = `
    precision mediump float;
    varying vec3 vColor;
    varying float vAlpha;
    void main(){
      float r=length(gl_PointCoord-vec2(.5));
      float opacity=smoothstep(.5,.12,r)*vAlpha;
      gl_FragColor=vec4(vColor,opacity);
    }`;
  function makeShader(type, source) {
    const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Shader unavailable');
    return shader;
  }
  try {
    gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
    if (gl) {
      program = gl.createProgram();
      gl.attachShader(program, makeShader(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, makeShader(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Program unavailable');
      gl.useProgram(program);
      function attribute(name, length, data) {
        const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        const location = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, length, gl.FLOAT, false, 0, 0);
      }
      attribute('aPosition', 3, points.flatMap(p => [p.x,p.y,p.z]));
      attribute('aCloud', 3, points.flatMap(p => p.cloud || [p.x,p.y,p.z]));
      attribute('aKind', 2, points.flatMap(p => [p.kind,p.cyan ? 1 : 0]));
      uniforms = Object.fromEntries(['uSize','uCenter','uRadius','uDpr','uTime','uReveal','uPointer','uImpacts[0]'].map(n => [n,gl.getUniformLocation(program,n)]));
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.clearColor(8/255,9/255,11/255,1);
      engine = 'webgl';
    }
  } catch (_) {
    const replacement = canvas.cloneNode(false); canvas.replaceWith(replacement); canvas = replacement; gl = null;
  }
  if (!gl) ctx = canvas.getContext('2d');
  if (!gl && !ctx) return;
  canvas.dataset.renderer = engine;
  canvas.dataset.points = points.length;
  const bins = Array.from({length:16},()=>[]);
  const colors = Array.from({length:16},(_,i)=>{const alpha=.025+Math.pow((i%8)/7,1.6)*.94;return i<8?`rgba(3,196,213,${alpha})`:`rgba(231,244,247,${alpha})`;});
  const entered = performance.now();
  function reveal() { const p = paused?1:clamp((performance.now()-entered)/2600); return 1 - Math.pow(1-p,3); }
  function draw2d() {
    const progress = reveal(), tilt = .13 + pointerY*.045, c = Math.cos(tilt), s = Math.sin(tilt);
    const angles = [Math.sin(elapsed*.24)*.10+Math.sin(elapsed*.11)*.06+pointerX*.10-(1-progress)*1.4,elapsed*.045,elapsed*.045];
    const cos = angles.map(Math.cos), sin = angles.map(Math.sin);
    bins.forEach(b => b.length = 0); ctx.clearRect(0,0,width,height);
    for (const p of points) {
      let x=p.x,y=p.y,z=p.z;
      if(p.kind===0 && progress<1){x=p.cloud[0]+(x-p.cloud[0])*progress;y=p.cloud[1]+(y-p.cloud[1])*progress;z=p.cloud[2]+(z-p.cloud[2])*progress;}
      const rx=x*cos[p.kind]+z*sin[p.kind],rz=-x*sin[p.kind]+z*cos[p.kind];
      x=rx;z=y*s+rz*c;y=y*c-rz*s;
      let shock=0;
      for(const impact of impacts){const age=elapsed-impact.time;if(age<0||age>4)continue;const delta=Math.hypot(x-impact.x,y-impact.y)-age*.83;shock+=Math.exp(-delta*delta*75-age*1.2);}
      const near=Math.exp(-Math.hypot(x-pointerX,y-pointerY)*5)*active;
      const displace=1+shock*.12+near*.025;x*=displace;y*=displace;z*=displace;
      const perspective=1/(1-z*.13),px=cx+x*radius*perspective,py=cy-y*radius*perspective;
      const light=clamp(.55-x*.22+y*.35+z*.22),rim=Math.pow(clamp(1-Math.abs(z/1.08)),3);
      let alpha=p.kind===0 ? .65+light*.35 : (.035+rim*.53+Math.pow(light,8)*.48)*(z>0?1:.32);
      if(p.kind===1&&Math.abs(x)<.94&&Math.abs(y)<.33)alpha*=.17;
      if(p.kind===2)alpha=(.06+light*.10)*(.6+.4*Math.sin(elapsed*.35+p.y*9));
      alpha=clamp(alpha+shock*.5+near*.2);
      const index=(p.cyan?0:8)+Math.floor(alpha*7);
      const size=(p.kind===0?1.06:p.kind===2?.62:.85+rim*.18)+shock*.55;
      bins[index].push(px,py,size*perspective);
    }
    bins.forEach((bin,i)=>{ctx.beginPath();for(let k=0;k<bin.length;k+=3)ctx.rect(bin[k],bin[k+1],bin[k+2],bin[k+2]);ctx.fillStyle=colors[i];ctx.fill();});
  }
  function draw() {
    const start = performance.now();
    if(gl) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uniforms.uSize,width,height);gl.uniform2f(uniforms.uCenter,cx,cy);
      gl.uniform1f(uniforms.uRadius,radius);gl.uniform1f(uniforms.uDpr,dpr);
      gl.uniform1f(uniforms.uTime,elapsed);gl.uniform1f(uniforms.uReveal,reveal());
      gl.uniform3f(uniforms.uPointer,pointerX,pointerY,active);
      const hits = new Float32Array(16); impacts.slice(-4).forEach((p,i)=>hits.set([p.x,p.y,p.time,1],i*4));
      gl.uniform4fv(uniforms['uImpacts[0]'],hits);gl.drawArrays(gl.POINTS,0,points.length);
    } else draw2d();
    canvas.dataset.ready = 'true'; hero.classList.add('is-rendered');
    drawTotal += performance.now()-start;frames++;
  }
  function resize() {
    const b=hero.getBoundingClientRect();width=b.width;height=b.height;
    dpr=Math.min(devicePixelRatio||1,mobile.matches?1.5:1.6);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    cx=width*.5;cy=height*(mobile.matches?.35:.40);
    radius=mobile.matches?Math.min(width*.43,height*.22):Math.min(width*.29,height*.30);
    if(gl)gl.viewport(0,0,canvas.width,canvas.height);else ctx.setTransform(dpr,0,0,dpr,0,0);
    canvas.dataset.radius=radius.toFixed(1);draw();
  }
  function tick(now) {
    raf=0;if(paused||!visible||document.hidden)return;
    const dt=Math.min((now-last)/1000,.06);last=now;elapsed+=dt;
    pointerX+=(targetX-pointerX)*Math.min(1,dt*4);pointerY+=(targetY-pointerY)*Math.min(1,dt*4);active+=(targetActive-active)*Math.min(1,dt*3);
    // The CPU fallback stays at 30fps; the GPU version follows the display.
    if(gl || now-(canvas._lastDraw||0)>30){draw();canvas._lastDraw=now;}
    if(now-measureAt>1500){canvas.dataset.renderMs=(drawTotal/Math.max(frames,1)).toFixed(2);canvas.dataset.fps=(frames*1000/(now-measureAt)).toFixed(1);frames=0;drawTotal=0;measureAt=now;}
    raf=requestAnimationFrame(tick);
  }
  function start(){if(!raf&&!paused&&visible&&!document.hidden){last=performance.now();measureAt=last;raf=requestAnimationFrame(tick);}}
  function syncPause(){
    pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Play hero animation':'Pause hero animation');
    pause.innerHTML=paused?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>';
    if(paused){cancelAnimationFrame(raf);raf=0;elapsed=Math.max(3,elapsed);draw();}else start();
  }
  pause.addEventListener('click',()=>{paused=!paused;syncPause();});
  hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||paused)return;const b=hero.getBoundingClientRect();targetX=clamp((e.clientX-b.left-cx)/radius,-1.5,1.5);targetY=clamp(-(e.clientY-b.top-cy)/radius,-1.5,1.5);targetActive=1;},{passive:true});
  hero.addEventListener('pointerleave',()=>{targetX=0;targetY=0;targetActive=0;});
  hero.addEventListener('pointerdown',e=>{if(paused||e.target.closest('a,button'))return;const b=hero.getBoundingClientRect();impacts.push({x:(e.clientX-b.left-cx)/radius,y:-(e.clientY-b.top-cy)/radius,time:elapsed});if(impacts.length>4)impacts.shift();},{passive:true});
  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else{cancelAnimationFrame(raf);raf=0;}},{threshold:.01}).observe(hero);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else start();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;syncPause();});
  resize();syncPause();
})();
