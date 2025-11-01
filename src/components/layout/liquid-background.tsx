
'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const LiquidBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue('--primary').trim();
    const accentColor = style.getPropertyValue('--accent').trim();

    const config = {
      TEXTURE_DOWNSAMPLE: 1,
      DENSITY_DISSIPATION: 0.98,
      VELOCITY_DISSIPATION: 0.99,
      PRESSURE_DISSIPATION: 0.8,
      PRESSURE_ITERATIONS: 20,
      SPLAT_RADIUS: 0.005,
    };

    const pointers: {x: number, y: number, dx: number, dy: number, down: boolean, moved: boolean, color: number[]}[] = [];
    
    class GLProgram {
        
      program: WebGLProgram | null = null;
      uniforms: {[key: string]: WebGLUniformLocation} = {};

      constructor(public readonly gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.program = gl.createProgram();
        if (!this.program) {
            throw new Error("Failed to create program");
        }
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
    
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
          throw gl.getProgramInfoLog(this.program);
        }
    
        const uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
          const uniform: WebGLActiveInfo | null = gl.getActiveUniform(this.program, i);
          if (uniform) {
            this.uniforms[uniform.name] = gl.getUniformLocation(this.program, uniform.name)!;
          }
        }
      }
    
      bind() {
        this.gl.useProgram(this.program);
      }
    }
    

    const webGLContext = getWebGLContext(canvas);
    if (!webGLContext) {
        console.error("WebGL 2 not supported");
        return;
    }

    const { gl, ext } = webGLContext;
    
    const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
      precision highp float;
      precision highp sampler2D;
      
      attribute vec2 a_position;
      varying vec2 v_texcoord;
      
      void main () {
        v_texcoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `);
    
    const clearShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;

      varying vec2 v_texcoord;
      uniform sampler2D u_texture;
      uniform float u_value;

      void main () {
        gl_FragColor = u_value * texture2D(u_texture, v_texcoord);
      }
    `);

    const displayShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;

        varying vec2 v_texcoord;
        uniform sampler2D u_texture;

        void main () {
          gl_FragColor = texture2D(u_texture, v_texcoord);
        }
    `);
    
    const splatShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;

      varying vec2 v_texcoord;
      uniform sampler2D u_target;
      uniform vec2 u_point;
      uniform vec3 u_color;
      uniform float u_radius;

      void main () {
        vec2 p = v_texcoord - u_point.xy;
        p.x *=_Resolution.x / _Resolution.y;
        float d = length(p);
        float a = 1.0 - smoothstep(u_radius, u_radius + 0.001, d);
        
        vec3 splat = u_color * a;
        vec3 base = texture2D(u_target, v_texcoord).xyz;
        
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `);

    const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;

      varying vec2 v_texcoord;
      uniform sampler2D u_velocity;
      uniform sampler2D u_source;
      uniform vec2 u_texelSize;
      uniform float u_dt;
      uniform float u_dissipation;

      void main () {
        vec2 pos = v_texcoord - u_dt * texture2D(u_velocity, v_texcoord).xy;
        gl_FragColor = u_dissipation * texture2D(u_source, pos);
      }
    `);

    const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;

      varying vec2 v_texcoord;
      uniform sampler2D u_velocity;
      uniform vec2 u_texelSize;

      void main () {
        float L = texture2D(u_velocity, v_texcoord - vec2(u_texelSize.x, 0.0)).x;
        float R = texture2D(u_velocity, v_texcoord + vec2(u_texelSize.x, 0.0)).x;
        float B = texture2D(u_velocity, v_texcoord - vec2(0.0, u_texelSize.y)).y;
        float T = texture2D(u_velocity, v_texcoord + vec2(0.0, u_texelSize.y)).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `);

    const curlShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;

      varying vec2 v_texcoord;
      uniform sampler2D u_velocity;
      uniform vec2 u_texelSize;

      void main () {
        float L = texture2D(u_velocity, v_texcoord - vec2(u_texelSize.x, 0.0)).y;
        float R = texture2D(u_velocity, v_texcoord + vec2(u_texelSize.x, 0.0)).y;
        float B = texture2D(u_velocity, v_texcoord - vec2(0.0, u_texelSize.y)).x;
        float T = texture2D(u_velocity, v_texcoord + vec2(0.0, u_texelSize.y)).x;
        float curl = 0.5 * (R - L - T + B);
        gl_FragColor = vec4(curl, 0.0, 0.0, 1.0);
      }
    `);

    const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;

      varying vec2 v_texcoord;
      uniform sampler2D u_pressure;
      uniform sampler2D u_divergence;
      uniform vec2 u_texelSize;

      void main () {
        float L = texture2D(u_pressure, v_texcoord - vec2(u_texelSize.x, 0.0)).x;
        float R = texture2D(u_pressure, v_texcoord + vec2(u_texelSize.x, 0.0)).x;
        float B = texture2D(u_pressure, v_texcoord - vec2(0.0, u_texelSize.y)).x;
        float T = texture2D(u_pressure, v_texcoord + vec2(0.0, u_texelSize.y)).x;
        float C = texture2D(u_pressure, v_texcoord).x;
        float divergence = texture2D(u_divergence, v_texcoord).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `);

    const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;

      varying vec2 v_texcoord;
      uniform sampler2D u_pressure;
      uniform sampler2D u_velocity;
      uniform vec2 u_texelSize;

      void main () {
        float L = texture2D(u_pressure, v_texcoord - vec2(u_texelSize.x, 0.0)).x;
        float R = texture2D(u_pressure, v_texcoord + vec2(u_texelSize.x, 0.0)).x;
        float B = texture2D(u_pressure, v_texcoord - vec2(0.0, u_texelSize.y)).x;
        float T = texture2D(u_pressure, v_texcoord + vec2(0.0, u_texelSize.y)).x;
        vec2 grad = 0.5 * vec2(R - L, T - B);
        vec2 vel = texture2D(u_velocity, v_texcoord).xy;
        gl_FragColor = vec4(vel - grad, 0.0, 1.0);
      }
    `);
    
    let lastTime = Date.now();
    const clearProgram = new GLProgram(gl, baseVertexShader, clearShader);
    const displayProgram = new GLProgram(gl, baseVertexShader, displayShader);
    const splatProgram = new GLProgram(gl, baseVertexShader, splatShader);
    const advectionProgram = new GLProgram(gl, baseVertexShader, advectionShader);
    const divergenceProgram = new GLProgram(gl, baseVertexShader, divergenceShader);
    const curlProgram = new GLProgram(gl, baseVertexShader, curlShader);
    const pressureProgram = new GLProgram(gl, baseVertexShader, pressureShader);
    const gradienSubtractProgram = new GLProgram(gl, baseVertexShader, gradientSubtractShader);

    const textureWidth = gl.drawingBufferWidth >> config.TEXTURE_DOWNSAMPLE;
    const textureHeight = gl.drawingBufferHeight >> config.TEXTURE_DOWNSAMPLE;
    const texelSize = { x: 1.0 / textureWidth, y: 1.0 / textureHeight };
    const dye = createDoubleFBO(textureWidth, textureHeight, ext.format.internal, ext.format.format, ext.type, gl.NEAREST);
    const velocity = createDoubleFBO(textureWidth, textureHeight, ext.format.internal, ext.format.format, ext.type, gl.NEAREST);
    const divergence = createFBO(textureWidth, textureHeight, ext.format.internal, ext.format.format, ext.type, gl.NEAREST);
    const curl = createFBO(textureWidth, textureHeight, ext.format.internal, ext.format.format, ext.type, gl.NEAREST);
    const pressure = createDoubleFBO(textureWidth, textureHeight, ext.format.internal, ext.format.format, ext.type, gl.NEAREST);

    const triangle = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 0,1, 1,1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle);
    let position = gl.getAttribLocation(splatProgram.program!, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    function getWebGLContext(canvas: HTMLCanvasElement) {
        const params = {
            alpha: false,
            depth: false,
            stencil: false,
            antialias: false,
        };
        let gl = canvas.getContext("webgl2", params) as WebGL2RenderingContext;
        const isWebGL2 = !!gl;
        if (!isWebGL2) {
            console.error("WebGL 2 not supported");
            return null;
        }

        const extensions: {[key: string]: any} = {};
        const available_extensions = gl.getSupportedExtensions();
        if (available_extensions) {
            for(let i=0; i<available_extensions.length; i++) {
                const e = available_extensions[i];
                if(e.includes('color_buffer_float'))
                  extensions.format = {
                    internal: gl.RGBA16F,
                    format: gl.RGBA,
                    type: gl.HALF_FLOAT,
                };
            }
        }
    
        if (extensions.format == null) {
          extensions.format = {
            internal: gl.RGBA,
            format: gl.RGBA,
            type: gl.UNSIGNED_BYTE,
          };
        }
    
        return { gl, ext: extensions };
    }
    
    function compileShader(type: number, source: string) {
      source = source.replace(/_Resolution/g, "vec2("+textureWidth+", "+textureHeight+")");
      const shader = gl.createShader(type);
      if (!shader) {
          throw new Error("Failed to create shader");
      }
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
  
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw gl.getShaderInfoLog(shader);
      }
  
      return shader;
    };
    
    function createFBO(w: number, h: number, internalFormat: any, format: any, type: any, param: any) {
        gl.activeTexture(gl.TEXTURE0);
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
    
        let fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.viewport(0, 0, w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);

        return {
          texture,
          fbo,
          width: w,
          height: h,
          attach(id: number) {
            gl.activeTexture(gl.TEXTURE0 + id);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            return id;
          }
        };
    }
    
    function createDoubleFBO(w: number, h: number, internalFormat: any, format: any, type: any, param: any) {
        let fbo1 = createFBO(w, h, internalFormat, format, type, param);
        let fbo2 = createFBO(w, h, internalFormat, format, type, param);
    
        return {
          width: w,
          height: h,
          texelSizeX: 1.0 / w,
          texelSizeY: 1.0 / h,
          get read() {
            return fbo1;
          },
          set read(value) {
            fbo1 = value;
          },
          get write() {
            return fbo2;
          },
          set write(value) {
            fbo2 = value;
          },
          swap() {
            let temp = fbo1;
            fbo1 = fbo2;
            fbo2 = temp;
          }
        };
    }
    
    function update() {
        resizeCanvas();
        const dt = (Date.now() - lastTime) / 1000;
        lastTime = Date.now();
    
        gl.viewport(0, 0, textureWidth, textureHeight);
    
        advectionProgram.bind();
        gl.uniform2f(advectionProgram.uniforms['u_texelSize'], texelSize.x, texelSize.y);
        gl.uniform1i(advectionProgram.uniforms['u_velocity'], velocity.read.attach(0));
        gl.uniform1i(advectionProgram.uniforms['u_source'], velocity.read.attach(0));
        gl.uniform1f(advectionProgram.uniforms['u_dt'], dt);
        gl.uniform1f(advectionProgram.uniforms['u_dissipation'], config.VELOCITY_DISSIPATION);
        blit(velocity.write.fbo);
        velocity.swap();
    
        gl.uniform1i(advectionProgram.uniforms['u_source'], dye.read.attach(0));
        gl.uniform1f(advectionProgram.uniforms['u_dissipation'], config.DENSITY_DISSIPATION);
        blit(dye.write.fbo);
        dye.swap();
    
        for (let i = 0; i < pointers.length; i++) {
            if (pointers[i].moved) {
                splat(pointers[i].x, pointers[i].y, pointers[i].dx, pointers[i].dy, pointers[i].color);
                pointers[i].moved = false;
            }
        }
    
        divergenceProgram.bind();
        gl.uniform2f(divergenceProgram.uniforms['u_texelSize'], texelSize.x, texelSize.y);
        gl.uniform1i(divergenceProgram.uniforms['u_velocity'], velocity.read.attach(0));
        blit(divergence.fbo);
    
        curlProgram.bind();
        gl.uniform2f(curlProgram.uniforms['u_texelSize'], texelSize.x, texelSize.y);
        gl.uniform1i(curlProgram.uniforms['u_velocity'], velocity.read.attach(0));
        blit(curl.fbo);
    
        clearProgram.bind();
        let pressureTexId = pressure.read.attach(0);
        gl.activeTexture(gl.TEXTURE0 + pressureTexId);
        gl.bindTexture(gl.TEXTURE_2D, pressure.read.texture);
        gl.uniform1i(clearProgram.uniforms['u_texture'], pressureTexId);
        gl.uniform1f(clearProgram.uniforms['u_value'], config.PRESSURE_DISSIPATION);
        blit(pressure.write.fbo);
        pressure.swap();
    
        pressureProgram.bind();
        gl.uniform2f(pressureProgram.uniforms['u_texelSize'], texelSize.x, texelSize.y);
        gl.uniform1i(pressureProgram.uniforms['u_divergence'], divergence.attach(0));
        for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
            pressureTexId = pressure.read.attach(1);
            gl.activeTexture(gl.TEXTURE0 + pressureTexId);
            gl.bindTexture(gl.TEXTURE_2D, pressure.read.texture);
            gl.uniform1i(pressureProgram.uniforms['u_pressure'], pressureTexId);
            blit(pressure.write.fbo);
            pressure.swap();
        }
    
        gradienSubtractProgram.bind();
        gl.uniform2f(gradienSubtractProgram.uniforms['u_texelSize'], texelSize.x, texelSize.y);
        gl.uniform1i(gradienSubtractProgram.uniforms['u_pressure'], pressure.read.attach(0));
        gl.uniform1i(gradienSubtractProgram.uniforms['u_velocity'], velocity.read.attach(1));
        blit(velocity.write.fbo);
        velocity.swap();
    
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        displayProgram.bind();
        gl.uniform1i(displayProgram.uniforms['u_texture'], dye.read.attach(0));
        blit(null);
    
        requestAnimationFrame(update);
    }
    
    function splat(x: number, y: number, dx: number, dy: number, color: number[]) {
        splatProgram.bind();
        gl.uniform1i(splatProgram.uniforms['u_target'], velocity.read.attach(0));
        gl.uniform2f(splatProgram.uniforms['u_point'], x / window.innerWidth, 1.0 - y / window.innerHeight);
        gl.uniform3f(splatProgram.uniforms['u_color'], dx, -dy, 1.0);
        gl.uniform1f(splatProgram.uniforms['u_radius'], config.SPLAT_RADIUS);
        blit(velocity.write.fbo);
        velocity.swap();
    
        gl.uniform1i(splatProgram.uniforms['u_target'], dye.read.attach(0));
        gl.uniform3f(splatProgram.uniforms['u_color'], color[0] * 0.3, color[1] * 0.3, color[2] * 0.3);
        blit(dye.write.fbo);
        dye.swap();
    }
    
    function resizeCanvas() {
        if (canvas.width != window.innerWidth || canvas.height != window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            return true;
        }
        return false;
    }
    
    function hslToRgb(h: number, s: number, l: number): [number, number, number] {
      let r, g, b;
      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      return [r, g, b];
    }
    
    const primaryHsl = primaryColor.split(' ').map(parseFloat);
    const accentHsl = accentColor.split(' ').map(parseFloat);
    const primaryRgb = hslToRgb(primaryHsl[0]/360, primaryHsl[1]/100, primaryHsl[2]/100).map(c => c * 255);
    const accentRgb = hslToRgb(accentHsl[0]/360, accentHsl[1]/100, accentHsl[2]/100).map(c => c * 255);


    pointers.push({ x: 0, y: 0, dx:0, dy:0, down: false, moved:false, color: [30, 0, 300] });

    canvas.addEventListener('mousedown', e => {
        let posX = e.offsetX;
        let posY = e.offsetY;
        let pointer = pointers.find(p => p.down == false);
        if(pointer == null)
            pointer = { x: 0, y: 0, dx:0, dy:0, down: false, moved:false, color: [30, 0, 300] };
        pointer.down = true;
        pointer.color = [primaryRgb[0],primaryRgb[1],primaryRgb[2]];
        pointer.x = posX;
        pointer.y = posY;
        pointer.dx = 0;
        pointer.dy = 0;
        pointer.moved = true;
    });

    window.addEventListener('mousemove', e => {
        let pointer = pointers[0];
        if (!pointer.down) return;
        let posX = e.offsetX;
        let posY = e.offsetY;
        
        let dx = posX - pointer.x;
        let dy = posY - pointer.y;

        pointer.moved = Math.abs(dx) > 0 || Math.abs(dy) > 0;
        if(pointer.moved){
          pointer.dx = dx * 10.0;
          pointer.dy = dy * 10.0;
          pointer.x = posX;
          pointer.y = posY;
        }

    });
    
    window.addEventListener('mouseup', (e) => {
        pointers[0].down = false;
    });

    function blit(destination: WebGLFramebuffer | null) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
    
    update();

    return () => {
      window.removeEventListener('resize', () => {});
      canvas.removeEventListener('mousedown', () => {});
      window.removeEventListener('mousemove', () => {});
      window.removeEventListener('mouseup', () => {});
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default LiquidBackground;
