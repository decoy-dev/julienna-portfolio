/**
 * Node-canvas dot grid rendered in a fragment shader. Dots part around the pointer and a single
 * ripple can be emitted from a node. Progressive enhancement only:
 *   - `failIfMajorPerformanceCaveat` refuses software rasterizers, so browsers without hardware
 *     acceleration keep the static CSS grid underneath.
 *   - Frames render on demand (pointer activity or an active ripple); there is no idle loop.
 *   - Context loss removes the canvas and the CSS grid shows through again.
 * The shader lattice matches `.grid-canvas` exactly (24px pitch, 1.5px dots), so the swap is invisible.
 */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

// highp where available: squared pixel distances overflow mediump on some mobile GPUs.
const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;uniform vec2 uMouse;uniform float uPush;uniform vec3 uWave;uniform float uDpr;
const vec3 BG=vec3(1.);const vec3 DOT=vec3(.874,.903,.904);const vec3 TINT=vec3(.296,.725,.691);
void main(){
  vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);
  float pitch=24.*uDpr;
  vec2 dm=p-uMouse;float r2=dot(dm,dm);float s=70.*uDpr;
  float fm=uPush*exp(-r2/(2.*s*s));
  vec2 dw=p-uWave.xy;float dist=length(dw);float bw=28.*uDpr;
  float fw=uWave.z>0.?exp(-pow(dist-uWave.z,2.)/(2.*bw*bw))*clamp(1.-uWave.z/(640.*uDpr),0.,1.):0.;
  vec2 q=p-normalize(dm+1e-4)*fm*9.*uDpr-normalize(dw+1e-4)*fw*6.*uDpr;
  vec2 c=mod(q+pitch*.5,pitch)-pitch*.5;
  float inf=clamp(fm+fw,0.,1.);
  float rad=(1.5+inf*1.1)*uDpr;
  float a=1.-smoothstep(rad-.7,rad+.7,length(c));
  gl_FragColor=vec4(mix(BG,mix(DOT,TINT,inf),a),1.);
}`;

export type Field = { ripple: (x: number, y: number) => void; suspend: (on: boolean) => void; dispose: () => void };

export function mountField(host: HTMLElement, reduced: MediaQueryList): Field | null {
  if (reduced.matches) return null;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.className = 'field-canvas';
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    failIfMajorPerformanceCaveat: true,
    powerPreference: 'low-power',
  });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = {
    res: gl.getUniformLocation(prog, 'uRes'),
    mouse: gl.getUniformLocation(prog, 'uMouse'),
    push: gl.getUniformLocation(prog, 'uPush'),
    wave: gl.getUniformLocation(prog, 'uWave'),
    dpr: gl.getUniformLocation(prog, 'uDpr'),
  };

  const dpr = Math.min(1.5, devicePixelRatio || 1);
  const mouse = { x: -9999, y: -9999 };
  let push = 0;
  let pushTarget = 0;
  const wave = { x: 0, y: 0, r: 0, active: false };
  let raf = 0;
  let alive = true;
  let suspended = false;
  const ac = new AbortController();
  const ro = new ResizeObserver(() => resize());

  const frame = () => {
    raf = 0;
    if (!alive) return;
    push += (pushTarget - push) * 0.14;
    if (wave.active) {
      wave.r += 9 * dpr;
      if (wave.r > 640 * dpr) wave.active = false;
    }
    gl.uniform2f(u.mouse, mouse.x * dpr, mouse.y * dpr);
    gl.uniform1f(u.push, push);
    gl.uniform3f(u.wave, wave.x * dpr, wave.y * dpr, wave.active ? wave.r : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (Math.abs(pushTarget - push) > 0.002 || wave.active) kick();
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform1f(u.dpr, dpr);
    kick();
  };
  ro.observe(host);

  /** Tear everything down; the static CSS grid underneath takes over again. */
  const dispose = () => {
    if (!alive) return;
    alive = false;
    cancelAnimationFrame(raf);
    ro.disconnect();
    ac.abort();
    canvas.remove();
  };

  const on = { signal: ac.signal };
  host.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || suspended) return;
    const b = host.getBoundingClientRect();
    mouse.x = e.clientX - b.left;
    mouse.y = e.clientY - b.top;
    pushTarget = 1;
    kick();
  }, on);
  host.addEventListener('pointerleave', () => {
    pushTarget = 0;
    kick();
  }, on);
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    dispose();
  }, on);
  reduced.addEventListener('change', () => reduced.matches && dispose(), on);

  host.prepend(canvas);
  resize();
  // Reveal only after the first real frame, so a failed draw never blanks the grid.
  requestAnimationFrame(() => alive && canvas.classList.add('is-ready'));

  return {
    ripple(x, y) {
      if (!alive || suspended) return;
      Object.assign(wave, { x, y, r: 0, active: true });
      kick();
    },
    /** Freeze the field (the user pressed Pause): dots ease back to rest and stop responding. */
    suspend(on) {
      suspended = on;
      if (!on) return;
      pushTarget = 0;
      wave.active = false;
      kick();
    },
    dispose,
  };
}
