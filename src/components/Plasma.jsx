// src/components/Plasma.jsx
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './Plasma.css';

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

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

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
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

export const Plasma = ({
  color = '#9400d3',
  speed = 0.8,
  direction = 'forward',
  scale = 0.3,
  opacity = 1,
  mouseInteractive = true,
}) => {
  const containerRef = useRef(null);

  // Performance and rendering refs (preserved from optimized)
  const rendererRef = useRef(null);
  const programRef = useRef(null);
  const meshRef = useRef(null);
  const rafRef = useRef(null);
  const roRef = useRef(null);
  const heroObserverRef = useRef(null);
  const runningRef = useRef(true);
  const lastFrameRef = useRef(performance.now());
  const perfSamplesRef = useRef([]);
  const perfSampleFrames = 30;
  const areaRef = useRef(0);
  const frameIntervalRef = useRef(1000 / 24);

  useEffect(() => {
    if (!containerRef.current) return;
    let mounted = true;
    const containerEl = containerRef.current;

    try {
      const rawDpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      const isTouchDevice =
        typeof window !== 'undefined' &&
        ('ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0));
      const isSmallScreen = window.innerWidth < 768;
      const isMobile = isTouchDevice || isSmallScreen;
      const initialDpr = isMobile ? Math.min(rawDpr, 1) : Math.min(rawDpr, 1.5);
      const initialFPS = isMobile ? 18 : 24;
      frameIntervalRef.current = 1000 / initialFPS;
      const powerPref = isMobile ? 'low-power' : 'high-performance';

      const renderer = new Renderer({
        alpha: true,
        antialias: false,
        premultipliedAlpha: true,
        powerPreference: powerPref,
        depth: false,
        stencil: false,
        dpr: initialDpr,
      });

      rendererRef.current = renderer;
      const gl = renderer.gl;
      const canvas = gl.canvas;
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      containerEl.appendChild(canvas);

      const geometry = new Triangle(gl);
      const customColorRgb = color ? hexToRgb(color) : [1, 1, 1];
      const directionMultiplier = direction === 'reverse' ? -1.0 : 1.0;

      const program = new Program(gl, {
        vertex: vertex,
        fragment: fragment,
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

      // Resize + DPR + sizing logic (preserved)
      let sizePending = false;
      const MAX_PIXELS = 1920 * 1080;

      const setSize = () => {
        if (!mounted || !containerEl || !rendererRef.current) return;
        if (sizePending) return;
        sizePending = true;
        requestAnimationFrame(() => {
          sizePending = false;
          const rect = containerEl.getBoundingClientRect();
          const cssW = Math.max(1, Math.floor(rect.width));
          const cssH = Math.max(1, Math.floor(rect.height));
          const cssArea = cssW * cssH;

          const newArea = cssArea;
          if (areaRef.current > 0) {
            const delta = Math.abs(newArea - areaRef.current) / areaRef.current;
            if (delta < 0.02) return;
          }
          areaRef.current = newArea;

          const rendererLocal = rendererRef.current;
          let effectiveDpr = rendererLocal.dpr || initialDpr || 1;
          const desiredPixels = Math.round(cssW * cssH * (effectiveDpr * effectiveDpr));
          if (desiredPixels > MAX_PIXELS) {
            const scale = Math.sqrt(MAX_PIXELS / desiredPixels);
            effectiveDpr = Math.max(0.75, Math.round(effectiveDpr * scale * 100) / 100);
          }

          try {
            if (typeof rendererLocal.setDpr === 'function') {
              rendererLocal.setDpr(effectiveDpr);
            } else {
              rendererLocal.dpr = effectiveDpr;
            }
          } catch (e) {
            try {
              rendererLocal.dpr = effectiveDpr;
            } catch (e2) {}
          }

          try {
            rendererLocal.setSize(cssW, cssH);
          } catch (e) {
            try {
              const gl2 = rendererLocal.gl;
              gl2.canvas.width = Math.round(cssW * effectiveDpr);
              gl2.canvas.height = Math.round(cssH * effectiveDpr);
              gl2.canvas.style.width = `${cssW}px`;
              gl2.canvas.style.height = `${cssH}px`;
            } catch {}
          }

          if (programRef.current && programRef.current.uniforms && programRef.current.uniforms.iResolution) {
            const res = programRef.current.uniforms.iResolution.value;
            res[0] = rendererRef.current.gl.drawingBufferWidth;
            res[1] = rendererRef.current.gl.drawingBufferHeight;
          }
        });
      };

      // throttled resize
      const throttledSetSize = (() => {
        let last = 0; let timer = null; const wait = 150;
        return () => {
          const now = Date.now();
          const remaining = wait - (now - last);
          if (remaining <= 0) {
            if (timer) { clearTimeout(timer); timer = null; }
            last = now; setSize();
          } else if (!timer) {
            timer = setTimeout(() => { last = Date.now(); timer = null; setSize(); }, remaining);
          }
        };
      })();

      const ro = new ResizeObserver(throttledSetSize);
      ro.observe(containerEl);
      roRef.current = ro;
      setSize();
      window.addEventListener('resize', throttledSetSize, { passive: true });

      // mouse handling (throttled)
      const rawHandleMouseMove = (e) => {
        if (!mouseInteractive || !programRef.current) return;
        const clientX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY;
        const rect = containerEl.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        if (programRef.current.uniforms && programRef.current.uniforms.uMouse) {
          const mu = programRef.current.uniforms.uMouse.value;
          mu[0] = x;
          mu[1] = y;
        }
      };

      const throttledHandleMouseMove = (() => {
        let last = 0; let timer = null; const wait = 16;
        return (...args) => {
          const now = Date.now();
          const remaining = wait - (now - last);
          if (remaining <= 0) {
            if (timer) { clearTimeout(timer); timer = null; }
            last = now; rawHandleMouseMove(...args);
          } else if (!timer) {
            timer = setTimeout(() => { last = Date.now(); timer = null; rawHandleMouseMove(...args); }, remaining);
          }
        };
      })();

      if (mouseInteractive) {
        containerEl.addEventListener('mousemove', throttledHandleMouseMove, { passive: true });
        containerEl.addEventListener('touchmove', throttledHandleMouseMove, { passive: true });
      }

      // visibility handling
      const onVisibility = () => {
        if (document.hidden) {
          runningRef.current = false;
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }
        } else {
          if (!runningRef.current) {
            runningRef.current = true;
            lastFrameRef.current = performance.now();
            rafRef.current = requestAnimationFrame(loop);
          }
        }
      };
      document.addEventListener('visibilitychange', onVisibility);

      // intersection observer for hero to pause when offscreen
      try {
        const heroEl = document.querySelector('#hero');
        if (heroEl) {
          const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                runningRef.current = false;
                if (rafRef.current) {
                  cancelAnimationFrame(rafRef.current);
                  rafRef.current = null;
                }
              } else {
                if (!runningRef.current && !document.hidden) {
                  runningRef.current = true;
                  lastFrameRef.current = performance.now();
                  rafRef.current = requestAnimationFrame(loop);
                }
              }
            });
          }, { threshold: 0 });
          heroObserver.observe(heroEl);
          heroObserverRef.current = heroObserver;
        }
      } catch (err) {}

      // perf sampling to adapt quality
      const recordFrameMs = (ms) => {
        perfSamplesRef.current.push(ms);
        if (perfSamplesRef.current.length >= perfSampleFrames) {
          const arr = perfSamplesRef.current;
          const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
          perfSamplesRef.current = [];

          if (avg > 28) {
            const rendererLocal = rendererRef.current;
            if (rendererLocal) {
              const curDpr = rendererLocal.dpr || rendererLocal._dpr || 1;
              const newDpr = Math.max(0.75, Math.round((curDpr - 0.5) * 100) / 100);
              if (newDpr < curDpr) {
                try {
                  if (typeof rendererLocal.setDpr === 'function') {
                    rendererLocal.setDpr(newDpr);
                  } else {
                    rendererLocal.dpr = newDpr;
                  }
                } catch (e) {
                  try {
                    rendererLocal.dpr = newDpr;
                  } catch {}
                }
                requestAnimationFrame(() => {
                  const rect = containerEl.getBoundingClientRect();
                  try {
                    rendererLocal.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
                  } catch {}
                });
              }
            }

            const curInterval = frameIntervalRef.current;
            const newFPS = Math.max(12, Math.round(1000 / curInterval) - 3);
            frameIntervalRef.current = 1000 / newFPS;
          } else {
            const curFPS = Math.round(1000 / frameIntervalRef.current);
            const target = window.innerWidth < 768 ? 18 : 24;
            if (curFPS < target) {
              frameIntervalRef.current = 1000 / (curFPS + 1);
            }
          }
        }
      };

      const t0 = performance.now();
      let lastFrameTime = lastFrameRef.current;

      // rendering loop (keeps original "pingpong" handling)
      const loop = (t) => {
        if (!mounted) return;
        rafRef.current = requestAnimationFrame(loop);

        if (!runningRef.current || document.hidden) return;

        const elapsed = t - lastFrameTime;
        if (elapsed < frameIntervalRef.current) return;
        lastFrameTime = t - (elapsed % frameIntervalRef.current);

        const start = performance.now();
        if (programRef.current && programRef.current.uniforms && programRef.current.uniforms.iTime) {
          let timeValue = (t - t0) * 0.001;
          if (direction === 'pingpong') {
            const pingpongDuration = 10;
            const segmentTime = timeValue % pingpongDuration;
            const isForward = Math.floor(timeValue / pingpongDuration) % 2 === 0;
            const u = segmentTime / pingpongDuration;
            const smooth = u * u * (3 - 2 * u);
            const pingpongTime = isForward ? smooth * pingpongDuration : (1 - smooth) * pingpongDuration;
            programRef.current.uniforms.uDirection.value = 1.0;
            programRef.current.uniforms.iTime.value = pingpongTime;
          } else {
            programRef.current.uniforms.iTime.value = (t - t0) * 0.001;
          }
        }

        try {
          if (rendererRef.current && meshRef.current) {
            rendererRef.current.render({ scene: meshRef.current });
          }
        } catch (err) {}

        const frameMs = performance.now() - start;
        recordFrameMs(frameMs);
      };

      runningRef.current = !document.hidden;
      lastFrameRef.current = performance.now();
      rafRef.current = requestAnimationFrame(loop);

      return () => {
        mounted = false;
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        try { ro.disconnect(); } catch (e) {}
        try { if (heroObserverRef.current) heroObserverRef.current.disconnect(); } catch (e) {}
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('resize', throttledSetSize);
        if (mouseInteractive) {
          containerEl.removeEventListener('mousemove', throttledHandleMouseMove);
          containerEl.removeEventListener('touchmove', throttledHandleMouseMove);
        }
        try {
          const rendererLocal = rendererRef.current;
          if (rendererLocal && rendererLocal.gl && rendererLocal.gl.canvas && rendererLocal.gl.canvas.parentNode === containerEl) {
            containerEl.removeChild(rendererLocal.gl.canvas);
          }
        } catch (e) {}
        rendererRef.current = null;
        programRef.current = null;
        meshRef.current = null;
        roRef.current = null;
        heroObserverRef.current = null;
        perfSamplesRef.current = [];
      };
    } catch (error) {
      console.error('Failed to initialize Plasma:', error);
    }
  }, [color, speed, direction, scale, opacity, mouseInteractive]);

  // update uniforms when props change (kept simple and safe)
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
    if (program.uniforms.uUseCustomColor) program.uniforms.uUseCustomColor.value = color ? 1.0 : 0.0;
    if (program.uniforms.uSpeed) program.uniforms.uSpeed.value = speed * 0.4;
    if (program.uniforms.uDirection) program.uniforms.uDirection.value = direction === 'reverse' ? -1.0 : 1.0;
    if (program.uniforms.uScale) program.uniforms.uScale.value = scale;
    if (program.uniforms.uOpacity) program.uniforms.uOpacity.value = opacity;
    if (program.uniforms.uMouseInteractive) program.uniforms.uMouseInteractive.value = mouseInteractive ? 1.0 : 0.0;
  }, [color, speed, direction, scale, opacity, mouseInteractive]);

  return <div ref={containerRef} className="plasma-container" aria-hidden="true" />;
};

export default Plasma;
