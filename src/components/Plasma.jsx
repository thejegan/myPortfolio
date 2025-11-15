// src/components/Plasma.jsx
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './Plasma.css';

// helper: convert hex to normalized rgb array
const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

// shader strings (unchanged)
const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  
  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  // Reduced iterations from 60 to 40 for better performance
  for (vec2 r = iResolution.xy, Q; ++i < 25.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y)); 
    p.z -= 4.; 
    S = p;
    d = p.y-T;
    
    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05); 
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T)); 
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4; 
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }
  
  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  
  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`;

const DEFAULT_TARGET_FPS = 24;

export const Plasma = ({
  color = '#6f00ff',
  speed = 0.5,
  direction = 'forward',
  scale = 1.5,
  opacity = 0.5,
  mouseInteractive = true,
}) => {
  const containerRef = useRef(null);

  // persistent refs for renderer/program/mesh/loop
  const rendererRef = useRef(null);
  const programRef = useRef(null);
  const meshRef = useRef(null);
  const rafRef = useRef(null);
  const roRef = useRef(null);
  const runningRef = useRef(true);
  const lastFrameRef = useRef(performance.now());
  const mouseTimeoutRef = useRef(null);
  const mousePosRef = useRef([0, 0]);

  // ---------- INIT (run once) ----------
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    let mounted = true;
    try {
      // safe DPR capping
      const rawDpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      const isMobile = window.innerWidth < 768;
      const dpr = isMobile ? Math.min(rawDpr, 1) : Math.min(rawDpr, 1.5);

      const renderer = new Renderer({
        alpha: true,
        antialias: false,
        premultipliedAlpha: true,
        powerPreference: 'high-performance',
        depth: false,
        stencil: false,
        dpr,
      });
      rendererRef.current = renderer;
      const gl = renderer.gl;
      const canvas = gl.canvas;
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      containerEl.appendChild(canvas);

      // create geometry/program/mesh (shader uniforms created here)
      const geometry = new Triangle(gl);

      const customColorRgb = color ? hexToRgb(color) : [1, 1, 1];
      const directionMultiplier = direction === 'reverse' ? -1.0 : 1.0;

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new Float32Array([gl.drawingBufferWidth, gl.drawingBufferHeight]) },
          uCustomColor: { value: new Float32Array(customColorRgb) },
          uUseCustomColor: { value: color ? 1.0 : 0.0 },
          uSpeed: { value: speed * 0.4 },
          uDirection: { value: directionMultiplier },
          uScale: { value: scale },
          uOpacity: { value: opacity },
          uMouse: { value: new Float32Array([0, 0]) },
          uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 },
        },
      });

      programRef.current = program;
      meshRef.current = new Mesh(gl, { geometry, program });

      // ---------- resize handler (debounced via rAF) ----------
      let sizePending = false;
      const setSize = () => {
        if (!mounted || !containerEl || !rendererRef.current) return;
        if (sizePending) return;
        sizePending = true;
        requestAnimationFrame(() => {
          sizePending = false;
          const rect = containerEl.getBoundingClientRect();
          const width = Math.max(1, Math.floor(rect.width));
          const height = Math.max(1, Math.floor(rect.height));
          rendererRef.current.setSize(width, height);
          if (programRef.current && programRef.current.uniforms && programRef.current.uniforms.iResolution) {
            const res = programRef.current.uniforms.iResolution.value;
            res[0] = rendererRef.current.gl.drawingBufferWidth;
            res[1] = rendererRef.current.gl.drawingBufferHeight;
          }
        });
      };

      const ro = new ResizeObserver(setSize);
      ro.observe(containerEl);
      roRef.current = ro;
      setSize();

      // ---------- mouse handling (throttle) ----------
      const handleMouseMove = (e) => {
        if (!mouseInteractive || !programRef.current) return;
        // throttle updates to ~60fps (or set to 30ms if needed)
        if (mouseTimeoutRef.current) return;
        mouseTimeoutRef.current = setTimeout(() => {
          mouseTimeoutRef.current = null;
        }, 16);
        const rect = containerEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mousePosRef.current[0] = x;
        mousePosRef.current[1] = y;
        if (programRef.current.uniforms && programRef.current.uniforms.uMouse) {
          const mu = programRef.current.uniforms.uMouse.value;
          mu[0] = x;
          mu[1] = y;
        }
      };

      if (mouseInteractive) {
        containerEl.addEventListener('mousemove', handleMouseMove, { passive: true });
        containerEl.addEventListener('touchmove', handleMouseMove, { passive: true });
      }

      // ---------- visibility handling ----------
      const onVisibility = () => {
        if (document.hidden) {
          // stop running; cancel RAF
          runningRef.current = false;
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }
        } else {
          // resume
          if (!runningRef.current) {
            runningRef.current = true;
            lastFrameRef.current = performance.now();
            rafRef.current = requestAnimationFrame(loop);
          }
        }
      };
      document.addEventListener('visibilitychange', onVisibility);

      // ---------- render loop (frame limiter kept) ----------
      const targetFPS = DEFAULT_TARGET_FPS;
      const frameInterval = 1000 / targetFPS;
      const t0 = performance.now();
      let lastFrameTime = lastFrameRef.current;

      const loop = (t) => {
        if (!mounted) return;
        rafRef.current = requestAnimationFrame(loop);

        // if paused due to visibility, skip render
        if (!runningRef.current || document.hidden) {
          return;
        }

        const elapsed = t - lastFrameTime;
        if (elapsed < frameInterval) {
          return;
        }
        lastFrameTime = t - (elapsed % frameInterval);

        // update time uniform
        if (programRef.current && programRef.current.uniforms && programRef.current.uniforms.iTime) {
          // keep original behavior: allow ping-pong via props if needed
          const timeValue = (t - t0) * 0.001;
          programRef.current.uniforms.iTime.value = timeValue;
        }

        // render
        try {
          if (rendererRef.current && meshRef.current) {
            rendererRef.current.render({ scene: meshRef.current });
          }
        } catch (err) {
          // swallow render errors to avoid crash loops
          // console.error('Plasma render error', err);
        }
      };

      // start loop
      runningRef.current = !document.hidden;
      lastFrameRef.current = performance.now();
      rafRef.current = requestAnimationFrame(loop);

      // cleanup
      return () => {
        mounted = false;
        // cancel RAF
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        // disconnect observer
        try {
          ro.disconnect();
        } catch (e) {}
        // remove listeners
        document.removeEventListener('visibilitychange', onVisibility);
        if (mouseInteractive) {
          containerEl.removeEventListener('mousemove', handleMouseMove);
          containerEl.removeEventListener('touchmove', handleMouseMove);
        }
        // remove canvas
        try {
          const rendererLocal = rendererRef.current;
          if (rendererLocal && rendererLocal.gl && rendererLocal.gl.canvas && rendererLocal.gl.canvas.parentNode === containerEl) {
            containerEl.removeChild(rendererLocal.gl.canvas);
          }
        } catch (e) {}
        // release refs
        rendererRef.current = null;
        programRef.current = null;
        meshRef.current = null;
        roRef.current = null;
        mouseTimeoutRef.current = null;
      };
    } catch (error) {
      console.error('Failed to initialize Plasma:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // init once

  // ---------- UNIFORM UPDATES (cheap) ----------
  useEffect(() => {
    const program = programRef.current;
    if (!program || !program.uniforms) return;

    if (program.uniforms.uCustomColor && color) {
      const rgb = hexToRgb(color);
      const arr = program.uniforms.uCustomColor.value;
      arr[0] = rgb[0];
      arr[1] = rgb[1];
      arr[2] = rgb[2];
    }
    if (program.uniforms.uUseCustomColor) {
      program.uniforms.uUseCustomColor.value = color ? 1.0 : 0.0;
    }
    if (program.uniforms.uSpeed) program.uniforms.uSpeed.value = speed * 0.4;
    if (program.uniforms.uDirection) program.uniforms.uDirection.value = direction === 'reverse' ? -1.0 : 1.0;
    if (program.uniforms.uScale) program.uniforms.uScale.value = scale;
    if (program.uniforms.uOpacity) program.uniforms.uOpacity.value = opacity;
    if (program.uniforms.uMouseInteractive) program.uniforms.uMouseInteractive.value = mouseInteractive ? 1.0 : 0.0;
  }, [color, speed, direction, scale, opacity, mouseInteractive]);

  return <div ref={containerRef} className="plasma-container" aria-hidden="true" />;
};

export default Plasma;
