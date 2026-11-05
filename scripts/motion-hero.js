/* P10X identity field. Independent renderer using the existing P10X vector mark. */
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
  const random = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const points = [];
  const mask = document.createElement('canvas');
  mask.width = 704; mask.height = 205;
  const mc = mask.getContext('2d', { willReadFrequently: true });
  if (!mc || typeof Path2D === 'undefined') return;
  mc.scale(mask.width / 1761.07, mask.height / 513.31);
  mark.querySelectorAll('path').forEach(path => {
    mc.fillStyle = path.getAttribute('fill'); mc.fill(new Path2D(path.getAttribute('d')));
  });
  const pixels = mc.getImageData(0, 0, mask.width, mask.height).data, samples = [];
  for (let y = 0; y < mask.height; y += 2) for (let x = 0; x < mask.width; x += 2) {
    const k = (y * mask.width + x) * 4;
    if (pixels[k + 3] > 160) samples.push([x, y, pixels[k] < 100]);
  }
  if (!samples.length) return;
  function sphere(seed, r) {
    const y = 1 - 2 * random(seed + 2), phi = random(seed + 7) * Math.PI * 2;
    const ring = Math.sqrt(1 - y * y);
    return [Math.cos(phi) * ring * r, y * r, Math.sin(phi) * ring * r];
  }
  // Keep the established mark-to-sphere proportion while matching the reference scale.
  const logoScale = .8 / 1.3;
  for (let i = 0; i < (mobile.matches ? 5700 : 8800); i++) {
    const p = samples[Math.floor(random(i + 1) * samples.length)];
    points.push({
      x: ((p[0] + random(i + 9) * 1.8) / mask.width - .5) * 1.83 * logoScale,
      y: -((p[1] + random(i + 19) * 1.8) / mask.height - .5) * .534 * logoScale,
      z: (random(i + 29) - .5) * .17 * logoScale,
      kind: 0, cyan: p[2], seed: random(i + 82) * Math.PI * 2, cloud: sphere(i * 2.7 + 23, 1.03)
    });
  }
  const golden = Math.PI * (3 - Math.sqrt(5));
  function shell(count, r, kind) {
    for (let i = 0; i < count; i++) {
      const y = 1 - (i + .5) / count * 2, ring = Math.sqrt(1 - y * y), a = golden * i;
      const jitter = (random(i + kind * 493) - .5) * .012;
      points.push({ x: Math.cos(a) * ring * (r + jitter), y: y * (r + jitter), z: Math.sin(a) * ring * (r + jitter), kind, seed: random(i + kind * 92) * Math.PI * 2 });
    }
  }
  // A fine, defined globe plus a loose volume of orbiting particles, not a second rim.
  shell(mobile.matches ? 7800 : 11600, 1, 1);
  for (let i = 0; i < (mobile.matches ? 1800 : 3200); i++) {
    const p = sphere(i * 1.71 + 1700, 1.045 + Math.pow(random(i + 2921), 1.65) * .31);
    points.push({x:p[0], y:p[1], z:p[2], kind:2, seed:random(i + 7182) * Math.PI * 2});
  }
  for (let i = 0; i < (mobile.matches ? 220 : 400); i++) {
    const p = sphere(i * 2.13 + 3800, 1.22 + random(i + 4921) * .26);
    points.push({x:p[0], y:p[1], z:p[2], kind:3, seed:random(i + 5182) * Math.PI * 2});
  }
  // Ice highlights, mint, brand turquoise, electric cyan and blue shadow.
  const stops = [[220,255,246],[105,250,235],[3,196,213],[13,151,239],[21,78,187]];
  const palette = Array.from({length:24}, (_, i) => {
    const v = i / 23 * 4, k = Math.min(3, Math.floor(v)), t = v - k;
    return stops[k].map((c,j) => Math.round(c + (stops[k+1][j] - c) * t));
  });
  palette.push([239,255,252]);
  const alphaSteps = 16;
  const bins = Array.from({length:palette.length * alphaSteps}, () => []);
  const colors = bins.map((_,i) => `rgba(${palette[Math.floor(i/alphaSteps)].join(',')},${Math.pow((i%alphaSteps+1)/alphaSteps,2)})`);
  const bufferData = new Float32Array(points.length * 7);
  let width=1,height=1,radius=1,cx=0,cy=0,dpr=1,gl,ctx,buffer;
  let elapsed=0,yaw=0,pitch=.10,velocityX=0,velocityY=0,last=0,raf=0,visible=true,paused=reduced.matches;
  let dragging=null,dragCount=0,lastDraw=0,frames=0,drawTotal=0,measureAt=0;
  const impacts=[];
  const entered=performance.now();
  function shader(type, source) {
    const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error('Shader unavailable');
    return s;
  }
  try {
    gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
    if(gl){
      const program=gl.createProgram();
      gl.attachShader(program,shader(gl.VERTEX_SHADER,`precision highp float;attribute vec2 aPosition;attribute vec4 aColor;attribute float aSize;varying vec4 vColor;void main(){gl_Position=vec4(aPosition,0.,1.);gl_PointSize=aSize;vColor=aColor;}`));
      gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`precision mediump float;varying vec4 vColor;void main(){float r=length(gl_PointCoord-vec2(.5));gl_FragColor=vec4(vColor.rgb,vColor.a*smoothstep(.5,.18,r));}`));
      gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error('Program unavailable');
      gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,bufferData.byteLength,gl.DYNAMIC_DRAW);
      [['aPosition',2,0],['aColor',4,8],['aSize',1,24]].forEach(([name,size,offset])=>{
        const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,28,offset);
      });
      gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.clearColor(8/255,9/255,11/255,1);
    }
  } catch (_) {
    const replacement=canvas.cloneNode(false);canvas.replaceWith(replacement);canvas=replacement;gl=null;
  }
  if(!gl)ctx=canvas.getContext('2d');
  if(!gl&&!ctx)return;
  canvas.dataset.renderer=gl?'webgl':'canvas2d';canvas.dataset.points=points.length;canvas.dataset.layers='2';
  function draw(){
    const started=performance.now();
    const reveal=paused?1:1-Math.pow(1-clamp((started-entered)/2600),3);
    const angles=[yaw-(1-reveal)*1.15,yaw+elapsed*.035,yaw-elapsed*.025,yaw+elapsed*.018];
    const cos=angles.map(Math.cos),sin=angles.map(Math.sin),c=Math.cos(pitch),s=Math.sin(pitch);
    bins.forEach(b=>b.length=0);
    let offset=0;
    for(const p of points){
      let x=p.x,y=p.y,z=p.z;
      if(p.kind===0&&reveal<1){x=p.cloud[0]+(x-p.cloud[0])*reveal;y=p.cloud[1]+(y-p.cloud[1])*reveal;z=p.cloud[2]+(z-p.cloud[2])*reveal;}
      if(p.kind>0){const loose=p.kind>1;const wave=1+Math.sin(p.y*7+(loose?p.seed:0)+elapsed*(loose?.65:.45))*(loose?.045:.003)+Math.sin(p.x*9+elapsed*.6)*(loose?.025:.002);x*=wave;y*=wave;z*=wave;}
      const rx=x*cos[p.kind]+z*sin[p.kind],rz=-x*sin[p.kind]+z*cos[p.kind];
      x=rx;z=y*s+rz*c;y=y*c-rz*s;
      let shock=0;
      for(const hit of impacts){const age=elapsed-hit.time;if(age<0||age>3.5)continue;const delta=Math.hypot(x-hit.x,y-hit.y)-age*.85;shock+=Math.exp(-delta*delta*80-age*1.4);}
      const displacement=1+shock*.07;x*=displacement;y*=displacement;z*=displacement;
      const perspective=1/(1-z*.10),px=cx+x*radius*perspective,py=cy-y*radius*perspective;
      const norm=Math.sqrt(x*x+y*y+z*z)||1,nx=x/norm,ny=y/norm,nz=z/norm;
      const rim=Math.pow(1-Math.abs(nz),1.45),key=clamp(.36-nx*.36+ny*.36+nz*.24);
      const spec=Math.pow(key,5),twinkle=.83+.17*Math.sin(p.seed+elapsed*1.4);
      let alpha,size,color;
      if(p.kind===0){
        alpha=.82+key*.18;size=1.04;color=p.cyan?Math.round(clamp(.37+nx*.13-ny*.13)*23):24;
      }else{
        const outer=p.kind===2;
        alpha=(outer?.05+rim*.22+key*.15+spec*.28:.10+rim*.50+key*.18+spec*.85)*(nz>0?1:.32)*twinkle;
        size=(outer?.75+random(p.seed+37)*.65:.68+rim*.85)*(1+shock*.4);
        if(p.kind===3){alpha=(.025+key*.08)*twinkle;size=.65;}
        color=Math.round(clamp(.51+nx*.27-ny*.29-spec*.20+Math.sin(elapsed*.16)*.045)*23);
      }
      alpha=clamp(alpha+shock*.25);const colorRGB=palette[color];
      if(gl){
        bufferData[offset++]=px/width*2-1;bufferData[offset++]=1-py/height*2;
        bufferData[offset++]=colorRGB[0]/255;bufferData[offset++]=colorRGB[1]/255;bufferData[offset++]=colorRGB[2]/255;
        bufferData[offset++]=alpha;bufferData[offset++]=Math.max(1,size*dpr*perspective*1.3);
      }else{
        const bucket=Math.min(alphaSteps-1,Math.max(0,Math.ceil(Math.sqrt(alpha)*alphaSteps)-1));bins[color*alphaSteps+bucket].push(px,py,size*perspective);
      }
    }
    if(gl){gl.clear(gl.COLOR_BUFFER_BIT);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,bufferData);gl.drawArrays(gl.POINTS,0,points.length);}
    else{
      ctx.clearRect(0,0,width,height);ctx.globalCompositeOperation='lighter';
      bins.forEach((bin,i)=>{if(!bin.length)return;ctx.beginPath();for(let k=0;k<bin.length;k+=3)ctx.rect(bin[k],bin[k+1],bin[k+2],bin[k+2]);ctx.fillStyle=colors[i];ctx.fill();});
    }
    canvas.dataset.ready='true';canvas.dataset.rotation=(yaw*180/Math.PI).toFixed(2);canvas.dataset.pitch=pitch.toFixed(3);canvas.dataset.dragCount=dragCount;
    hero.classList.add('is-rendered');drawTotal+=performance.now()-started;frames++;
  }
  function resize(){
    const b=hero.getBoundingClientRect();width=b.width;height=b.height;dpr=Math.min(devicePixelRatio||1,mobile.matches?1.5:1.6);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);cx=width/2;cy=height/2;
    // The reference's main sphere spans about 55% of the desktop viewport height.
    // On phones reserve space for the header and bottom copy; keep the halo inside the width.
    radius=mobile.matches?Math.min(width*.35,height*.22):Math.min(width*.205,height*.275);
    hero.style.setProperty('--pm-logo-width',`${radius*1.83*logoScale}px`);
    canvas.dataset.radius=radius.toFixed(2);canvas.dataset.center=`${cx},${cy}`;
    if(gl)gl.viewport(0,0,canvas.width,canvas.height);else ctx.setTransform(dpr,0,0,dpr,0,0);
    draw();
  }
  function tick(now){
    raf=0;if(paused||!visible||document.hidden)return;
    const dt=Math.min((now-last)/1000,1);last=now;elapsed+=dt;
    if(!dragging){yaw+=dt*(.13+velocityX);pitch=clamp(pitch+velocityY*dt,-.9,.9);const decay=Math.exp(-dt*4);velocityX*=decay;velocityY*=decay;}
    if(gl||now-lastDraw>30){draw();lastDraw=now;}
    if(now-measureAt>1500){canvas.dataset.renderMs=(drawTotal/Math.max(1,frames)).toFixed(2);canvas.dataset.fps=(frames*1000/(now-measureAt)).toFixed(1);frames=0;drawTotal=0;measureAt=now;}
    raf=requestAnimationFrame(tick);
  }
  function start(){if(!raf&&!paused&&visible&&!document.hidden){last=performance.now();measureAt=last;raf=requestAnimationFrame(tick);}}
  function syncPause(){
    pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Play hero animation':'Pause hero animation');
    pause.innerHTML=paused?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>';
    if(paused){cancelAnimationFrame(raf);raf=0;draw();}else start();
  }
  pause.addEventListener('click',()=>{paused=!paused;syncPause();});
  hero.addEventListener('pointerdown',e=>{
    if(e.button!==0||!e.target.closest('.pm-stage'))return;
    const b=hero.getBoundingClientRect(),x=(e.clientX-b.left-cx)/radius,y=-(e.clientY-b.top-cy)/radius;
    if(Math.hypot(x,y)>1.48)return;
    dragging={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,time:performance.now(),hitX:x,hitY:y,moved:false};
    velocityX=velocityY=0;hero.setPointerCapture(e.pointerId);hero.classList.add('is-dragging');canvas.dataset.dragging='true';
  });
  hero.addEventListener('pointermove',e=>{
    if(!dragging||dragging.id!==e.pointerId)return;
    const now=performance.now(),dt=Math.max(.016,(now-dragging.time)/1000),dx=e.clientX-dragging.x,dy=e.clientY-dragging.y;
    yaw+=dx*.006;pitch=clamp(pitch+dy*.004,-.9,.9);velocityX=clamp(dx*.006/dt,-2,2);velocityY=clamp(dy*.004/dt,-1,1);
    if(Math.hypot(e.clientX-dragging.startX,e.clientY-dragging.startY)>4)dragging.moved=true;
    dragging.x=e.clientX;dragging.y=e.clientY;dragging.time=now;draw();
  });
  function release(e){
    if(!dragging||dragging.id!==e.pointerId)return;
    if(e.type!=='pointercancel'){
      if(dragging.moved)dragCount++;
      else{impacts.push({x:dragging.hitX,y:dragging.hitY,time:elapsed});if(impacts.length>4)impacts.shift();}
    }
    dragging=null;hero.classList.remove('is-dragging');canvas.dataset.dragging='false';draw();
  }
  hero.addEventListener('pointerup',release);hero.addEventListener('pointercancel',release);hero.addEventListener('lostpointercapture',release);
  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else{cancelAnimationFrame(raf);raf=0;}},{threshold:.01}).observe(hero);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else start();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;syncPause();});
  resize();syncPause();
})();
