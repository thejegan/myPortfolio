// src/components/Plasma.jsx
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './Plasma.css';

// helper: convert hex to normalized rgb array
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

// shader strings (preserved exactly)
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

export const Plasma = ({
  color = '#6f00ff',
  speed = 0.5,
  direction = 'forward',
  scale = 0.5,
  opacity = 0.5,
  mouseInteractive = false,
}) => {
  const containerRef = useRef(null);

  // persistent refs
  const rendererRef = useRef(null);
  const programRef = useRef(null);
  const meshRef = useRef(null);
  const rafRef = useRef(null);
  const roRef = useRef(null);
  const heroObserverRef = useRef(null);
  const runningRef = useRef(true);
  const lastFrameRef = useRef(performance.now());
  const mouseTimeoutRef = useRef(null);
  const mousePosRef = useRef([0, 0]);

  // performance sampling for adaptive DPR/FPS
  const perfSamplesRef = useRef([]);
  const perfSampleFrames = 30;
  const areaRef = useRef(0);
  const frameIntervalRef = useRef(1000 / 24); // default 24 fps

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    let mounted = true;

    try {
            // adaptive initial DPR
      // ---------- adaptive device detection (small, safe change) ----------
      // Treat touch-capable devices as "mobile" even if the viewport width is large.
      // This prevents "Request Desktop Site" on phones from forcing desktop-quality
      // DPR/FPS/power modes which cause large battery/CPU usage.
      const rawDpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

      // detect touch device (phones/tablets): either 'ontouchstart' or maxTouchPoints
      const isTouchDevice = typeof window !== 'undefined' &&
                            ('ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0));

      // keep small-screen check too (desktop browsers on tablets may still be touchCapable)
      const isSmallScreen = window.innerWidth < 768;

      // final decision: treat as mobile if touch-capable OR small screen
      const isMobile = isTouchDevice || isSmallScreen;

      // cap DPR more aggressively on true mobile devices
      const initialDpr = isMobile ? Math.min(rawDpr, 1) : Math.min(rawDpr, 1.5);

      // prefer lower FPS on mobile/touch to save CPU/battery
      const initialFPS = isMobile ? 18 : 24;
      frameIntervalRef.current = 1000 / initialFPS;

      // prefer lower GPU profile on mobile/touch devices to avoid overheating / heavy battery drain
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

      // Program & mesh (shader uniforms)
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

      // ---------- setSize with area threshold to avoid tiny resizes ----------
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
          const newArea = width * height;
          // if previous area is set, ignore tiny changes (<2%)
          if (areaRef.current > 0) {
            const delta = Math.abs(newArea - areaRef.current) / areaRef.current;
            if (delta < 0.02) {
              // skip small changes
              return;
            }
          }
          areaRef.current = newArea;

          // apply size
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

      // ---------- visibility handling (pause when tab hidden) ----------
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

      // ---------- observe #hero and pause when it is not visible ----------
      let heroObserver = null;
      try {
        const heroEl = document.querySelector('#hero');
        if (heroEl) {
          heroObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                  // pause
                  runningRef.current = false;
                  if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                    rafRef.current = null;
                  }
                } else {
                  // resume (only if tab visible)
                  if (!runningRef.current && !document.hidden) {
                    runningRef.current = true;
                    lastFrameRef.current = performance.now();
                    rafRef.current = requestAnimationFrame(loop);
                  }
                }
              });
            },
            { threshold: 0 }
          );
          heroObserver.observe(heroEl);
          heroObserverRef.current = heroObserver;
        }
      } catch (err) {
        // ignore
      }

      // ---------- adaptive performance helpers ----------
      const recordFrameMs = (ms) => {
        perfSamplesRef.current.push(ms);
        if (perfSamplesRef.current.length >= perfSampleFrames) {
          const arr = perfSamplesRef.current;
          const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
          perfSamplesRef.current = [];

          // if avg frame time is > threshold, reduce DPR or FPS
          // threshold tuned conservatively
          if (avg > 28) {
            // reduce DPR in small steps
            const rendererLocal = rendererRef.current;
            if (rendererLocal) {
              const curDpr = rendererLocal.dpr || rendererLocal._dpr || 1; // library internals differ
              const newDpr = Math.max(0.75, Math.round((curDpr - 0.5) * 100) / 100);
              if (newDpr < curDpr) {
                // apply new DPR and re-size once
                try {
                  rendererLocal.dpr = newDpr;
                } catch (e) {
                  try {
                    rendererLocal.setDpr && rendererLocal.setDpr(newDpr);
                  } catch {}
                }
                // reapply size to update buffers
                requestAnimationFrame(() => {
                  const rect = containerEl.getBoundingClientRect();
                  rendererLocal.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
                });
              }
            }

            // lower FPS a bit if necessary
            const curInterval = frameIntervalRef.current;
            const newFPS = Math.max(12, Math.round(1000 / curInterval) - 3); // reduce by ~3fps steps
            frameIntervalRef.current = 1000 / newFPS;
          } else {
            // if perf good, gently increase FPS back toward desktop default
            const curFPS = Math.round(1000 / frameIntervalRef.current);
            const target = window.innerWidth < 768 ? 18 : 24;
            if (curFPS < target) {
              frameIntervalRef.current = 1000 / (curFPS + 1);
            }
          }
        }
      };

      // ---------- render loop (with frame limiter) ----------
      const t0 = performance.now();
      let lastFrameTime = lastFrameRef.current;

      const loop = (t) => {
        if (!mounted) return;
        rafRef.current = requestAnimationFrame(loop);

        if (!runningRef.current || document.hidden) {
          return;
        }

        const elapsed = t - lastFrameTime;
        if (elapsed < frameIntervalRef.current) {
          return;
        }
        lastFrameTime = t - (elapsed % frameIntervalRef.current);

        const start = performance.now();
        if (programRef.current && programRef.current.uniforms && programRef.current.uniforms.iTime) {
          const timeValue = (t - t0) * 0.001;
          programRef.current.uniforms.iTime.value = timeValue;
        }

        try {
          if (rendererRef.current && meshRef.current) {
            rendererRef.current.render({ scene: meshRef.current });
          }
        } catch (err) {
          // swallow render errors
        }

        // measure frame time and feed adaptive logic
        const frameMs = performance.now() - start;
        recordFrameMs(frameMs);
      };

      // start loop
      runningRef.current = !document.hidden;
      lastFrameRef.current = performance.now();
      rafRef.current = requestAnimationFrame(loop);

      // cleanup
      return () => {
        mounted = false;
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        try {
          ro.disconnect();
        } catch (e) {}
        try {
          if (heroObserver) heroObserver.disconnect();
        } catch (e) {}
        document.removeEventListener('visibilitychange', onVisibility);
        if (mouseInteractive) {
          containerEl.removeEventListener('mousemove', handleMouseMove);
          containerEl.removeEventListener('touchmove', handleMouseMove);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // init once

  // ---------- cheap uniform updates ----------
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
