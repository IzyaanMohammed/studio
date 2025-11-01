
'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const LiquidBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let config = {
      TEXTURE_DOWNSAMPLE: 1,
      DENSITY_DISSIPATION: 0.98,
      VELOCITY_DISSIPATION: 0.99,
      PRESSURE_DISSIPATION: 0.8,
      PRESSURE_ITERATIONS: 20,
      SPLAT_RADIUS: 0.005,
    };

    const pointers: {
      x: number;
      y: number;
      dx: number;
      dy: number;
      down: boolean;
      moved: boolean;
      color: number[];
    }[] = [];

    let splatStack: number[][] = [];

    const { gl, ext } = getWebGLContext(canvas);
    if (!gl || !ext) {
      console.error("WebGL not supported");
      return;
    }

    const support_linear_float = ext.supportLinearFiltering;

    let textureWidth: number, textureHeight: number;

    function getWebGLContext(canvas: HTMLCanvasElement) {
        const params = { alpha: false, depth: false, stencil: false, antialias: false };
    
        let gl = canvas.getContext('webgl2', params) as WebGL2RenderingContext;
        const isWebGL2 = !!gl;
        if (!isWebGL2) gl = canvas.getContext('webgl', params) as WebGLRenderingContext || canvas.getContext('experimental-webgl', params) as WebGLRenderingContext;
    
        let halfFloat: OES_texture_half_float | null;
        let supportLinearFiltering: OES_texture_half_float_linear | null;
        if (isWebGL2) {
            gl.getExtension('EXT_color_buffer_float');
            supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
        } else {
            halfFloat = gl.getExtension('OES_texture_half_float');
            supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
        }
    
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
        const halfFloatTexType = isWebGL2 ? (gl as WebGL2RenderingContext).HALF_FLOAT : (halfFloat ? halfFloat.HALF_FLOAT_OES : gl.UNSIGNED_BYTE);
        let formatRGBA: { internalFormat: number, format: number };
        let formatRG: { internalFormat: number, format: number };
        let formatR: { internalFormat: number, format: number };
    
        if (isWebGL2) {
            formatRGBA = getSupportedFormat(gl, (gl as WebGL2RenderingContext).RGBA16F, gl.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl, (gl as WebGL2RenderingContext).RG16F, (gl as WebGL2RenderingContext).RG, halfFloatTexType);
            formatR = getSupportedFormat(gl, (gl as WebGL2RenderingContext).R16F, (gl as WebGL2RenderingContext).RED, halfFloatTexType);
        }
        else {
            formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        }
        
        return { 
            gl, 
            ext: {
                formatRGBA,
                formatRG,
                formatR,
                halfFloatTexType,
                supportLinearFiltering
            },
            isWebGL2
        };
    }
    
    function getSupportedFormat(gl: WebGLRenderingContext | WebGL2RenderingContext, internalFormat: number, format: number, type: number) {
        if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
            switch (internalFormat) {
                case (gl as WebGL2RenderingContext).R16F:
                    return getSupportedFormat(gl, (gl as WebGL2RenderingContext).RG16F, (gl as WebGL2RenderingContext).RG, type);
                case (gl as WebGL2RenderingContext).RG16F:
                    return getSupportedFormat(gl, (gl as WebGL2RenderingContext).RGBA16F, gl.RGBA, type);
                default:
                    return { internalFormat: gl.RGBA, format: gl.RGBA };
            }
        }
    
        return { internalFormat, format };
    }
    
    function supportRenderTextureFormat(gl: WebGLRenderingContext | WebGL2RenderingContext, internalFormat: number, format: number, type: number) {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
    
        let fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        return status == gl.FRAMEBUFFER_COMPLETE;
    }

    class GLProgram {
      program: WebGLProgram;
      uniforms: { [key: string]: WebGLUniformLocation } = {};

      constructor(
        public readonly gl: WebGLRenderingContext | WebGL2RenderingContext,
        vertexShader: string,
        fragmentShader: string
      ) {
        this.program = gl.createProgram()!;
        gl.attachShader(this.program, compileShader(gl.VERTEX_SHADER, vertexShader));
        gl.attachShader(this.program, compileShader(gl.FRAGMENT_SHADER, fragmentShader));
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
          throw gl.getProgramInfoLog(this.program);
        }

        const uniformCount = gl.getProgramParameter(
          this.program,
          gl.ACTIVE_UNIFORMS
        );
        for (let i = 0; i < uniformCount; i++) {
          const uniform: WebGLActiveInfo | null = gl.getActiveUniform(
            this.program,
            i
          );
          if (uniform) {
            this.uniforms[uniform.name] = gl.getUniformLocation(
              this.program,
              uniform.name
            )!;
          }
        }
      }

      bind() {
        this.gl.useProgram(this.program);
      }
    }
    
    function compileShader(type: number, source: string) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw gl.getShaderInfoLog(shader);
      }

      return shader;
    }

    const baseVertexShader = `
      precision highp float;
      attribute vec2 a_position;
      varying vec2 v_texcoord;
      void main () {
        v_texcoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const clearShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 v_texcoord;
      uniform sampler2D u_texture;
      uniform float value;
      void main () {
          gl_FragColor = value * texture2D(u_texture, v_texcoord);
      }
    `;

    const displayShader = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 v_texcoord;
      uniform sampler2D u_texture;
      void main () {
        vec3 C = texture2D(u_texture, v_texcoord).rgb;
        float a = max(C.r, max(C.g, C.b));
        gl_FragColor = vec4(C, a);
      }
    `;

    const splatShader = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 v_texcoord;
      uniform sampler2D u_target;
      uniform float u_aspectRatio;
      uniform vec3 u_color;
      uniform vec2 u_point;
      uniform float u_radius;
      void main () {
          vec2 p = v_texcoord - u_point.xy;
          p.x *= u_aspectRatio;
          float d = min(1.0, length(p) / u_radius);
          d = pow(d, 2.0);
          vec3 splat = u_color * (1.0 - d);
          vec3 base = texture2D(u_target, v_texcoord).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const advectionShader = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 v_texcoord;
      uniform sampler2D u_velocity;
      uniform sampler2D u_source;
      uniform vec2 u_texelSize;
      uniform float u_dt;
      uniform float u_dissipation;
      vec4 bilerp (sampler2D, vec2);
      void main () {
          vec2 pos = v_texcoord - u_dt * texture2D(u_velocity, v_texcoord).xy;
          gl_FragColor = u_dissipation * texture2D(u_source, pos);
      }
    `;

    const divergenceShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 v_texcoord;
      uniform sampler2D u_velocity;
      uniform vec2 u_texelSize;
      void main () {
          float L = texture2D(u_velocity, v_texcoord - vec2(u_texelSize.x, 0.0)).x;
          float R = texture2D(u_velocity, v_texcoord + vec2(u_texelSize.x, 0.0)).x;
          float B = texture2D(u_velocity, v_texcoord - vec2(0.0, u_texelSize.y)).y;
          float T = texture2D(u_velocity, v_texcoord + vec2(0.0, u_texelSize.y)).y;
          vec2 C = texture2D(u_velocity, v_texcoord).xy;
          if (L < -999.0) { L = C.x; }
          if (R < -999.0) { R = C.x; }
          if (B < -999.0) { B = C.y; }
          if (T < -999.0) { T = C.y; }
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const curlShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 v_texcoord;
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
    `;

    const pressureShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 v_texcoord;
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
    `;

    const gradientSubtractShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 v_texcoord;
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
    `;

    let lastTime = Date.now();
    const clearProgram = new GLProgram(gl, baseVertexShader, clearShader);
    const displayProgram = new GLProgram(gl, baseVertexShader, displayShader);
    const splatProgram = new GLProgram(gl, baseVertexShader, splatShader);
    const advectionProgram = new GLProgram(gl, baseVertexShader, advectionShader);
    const divergenceProgram = new GLProgram(gl, baseVertexShader, divergenceShader);
    const curlProgram = new GLProgram(gl, baseVertexShader, curlShader);
    const pressureProgram = new GLProgram(gl, baseVertexShader, pressureShader);
    const gradienSubtractProgram = new GLProgram(gl, baseVertexShader, gradientSubtractShader);

    let dye: any, velocity: any, divergence: any, curl: any, pressure: any;

    const blit = (() => {
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        return (destination: WebGLFramebuffer | null) => {
            gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        }
    })();
    
    function initFBOs() {
      textureWidth = gl.drawingBufferWidth >> config.TEXTURE_DOWNSAMPLE;
      textureHeight = gl.drawingBufferHeight >> config.TEXTURE_DOWNSAMPLE;
      
      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;

      dye = createDoubleFBO(textureWidth, textureHeight, rgba.internalFormat, rgba.format, texType, support_linear_float ? gl.LINEAR: gl.NEAREST);
      velocity = createDoubleFBO(textureWidth, textureHeight, rg.internalFormat, rg.format, texType, support_linear_float ? gl.LINEAR: gl.NEAREST);
      divergence = createFBO(textureWidth, textureHeight, r.internalFormat, r.format, texType, gl.NEAREST);
      curl = createFBO(textureWidth, textureHeight, r.internalFormat, r.format, texType, gl.NEAREST);
      pressure = createDoubleFBO(textureWidth, textureHeight, r.internalFormat, r.format, texType, gl.NEAREST);
    }
    
    function createFBO(
      w: number,
      h: number,
      internalFormat: any,
      format: any,
      type: any,
      param: any
    ) {
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
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
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
        },
      };
    }

    function createDoubleFBO(
      w: number,
      h: number,
      internalFormat: any,
      format: any,
      type: any,
      param: any
    ) {
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
        },
      };
    }

    function update() {
      resizeCanvas();
      const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
      lastTime = Date.now();

      gl.viewport(0, 0, textureWidth, textureHeight);

      if (splatStack.length > 0) {
        for (let i = 0; i < splatStack.length; i++) {
          const s = splatStack.pop()!;
          splat(s[0], s[1], s[2], s[3], [s[4], s[5], s[6]]);
        }
      }

      advectionProgram.bind();
      gl.uniform2f(advectionProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(advectionProgram.uniforms.u_velocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.u_source, velocity.read.attach(0));
      gl.uniform1f(advectionProgram.uniforms.u_dt, dt);
      gl.uniform1f(advectionProgram.uniforms.u_dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write.fbo);
      velocity.swap();

      gl.uniform1i(advectionProgram.uniforms.u_source, dye.read.attach(0));
      gl.uniform1f(advectionProgram.uniforms.u_dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write.fbo);
      dye.swap();


      for (let i = 0; i < pointers.length; i++) {
        const pointer = pointers[i];
        if (pointer.moved) {
          splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color);
          pointer.moved = false;
        }
      }

      divergenceProgram.bind();
      gl.uniform2f(divergenceProgram.uniforms.u_texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(divergenceProgram.uniforms.u_velocity, velocity.read.attach(0));
      blit(divergence.fbo);

      curlProgram.bind();
      gl.uniform2f(curlProgram.uniforms.u_texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(curlProgram.uniforms.u_velocity, velocity.read.attach(0));
      blit(curl.fbo);

      clearProgram.bind();
      gl.uniform1i(clearProgram.uniforms.u_texture, pressure.read.attach(0));
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION);
      blit(pressure.write.fbo);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(pressureProgram.uniforms.u_texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(pressureProgram.uniforms.u_divergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.u_pressure, pressure.read.attach(1));
        blit(pressure.write.fbo);
        pressure.swap();
      }

      gradienSubtractProgram.bind();
      gl.uniform2f(gradienSubtractProgram.uniforms.u_texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(gradienSubtractProgram.uniforms.u_pressure, pressure.read.attach(0));
      gl.uniform1i(gradienSubtractProgram.uniforms.u_velocity, velocity.read.attach(1));
      blit(velocity.write.fbo);
      velocity.swap();

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      displayProgram.bind();
      gl.uniform1i(displayProgram.uniforms.u_texture, dye.read.attach(0));
      blit(null);

      animationFrameId.current = requestAnimationFrame(update);
    }

    function splat(x: number, y: number, dx: number, dy: number, color: number[]) {
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.u_target, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.u_aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.u_point, x / canvas.width, 1.0 - y / canvas.height);
      gl.uniform3f(splatProgram.uniforms.u_color, dx, -dy, 1.0);
      gl.uniform1f(splatProgram.uniforms.u_radius, config.SPLAT_RADIUS / 100.0);
      blit(velocity.write.fbo);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.u_target, dye.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.u_color, color[0], color[1], color[2]);
      blit(dye.write.fbo);
      dye.swap();
    }
    
    function multipleSplats(amount: number) {
      for (let i = 0; i < amount; i++) {
          const color = [Math.random() * 10, Math.random() * 10, Math.random() * 10];
          const x = canvas.width * Math.random();
          const y = canvas.height * Math.random();
          const dx = 1000 * (Math.random() - 0.5);
          const dy = 1000 * (Math.random() - 0.5);
          splat(x, y, dx, dy, color);
      }
    }

    function resizeCanvas() {
      if (
        canvas.width !== canvas.clientWidth ||
        canvas.height !== canvas.clientHeight
      ) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        initFBOs();
        return true;
      }
      return false;
    }

    const onMouseMove = (e: MouseEvent) => {
        let pointer = pointers[0];
        if (!pointer.down) return;
        
        const posX = e.offsetX;
        const posY = e.offsetY;

        let dx = (posX - pointer.x) * 10;
        let dy = (posY - pointer.y) * 10;

        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
             splat(posX, posY, dx, dy, pointer.color);
        }

        pointer.x = posX;
        pointer.y = posY;
    };
    
    const onMouseDown = (e: MouseEvent) => {
        let posX = e.offsetX;
        let posY = e.offsetY;
        let pointer = pointers.find(p => p.down === false);
        if(!pointer) {
          pointer = { x:0, y:0, dx:0, dy:0, down:false, moved: false, color:[0,0,0]};
          pointers.push(pointer);
        }
        pointer.down = true;
        pointer.color = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2];
        pointer.x = posX;
        pointer.y = posY;
        pointer.dx = 0;
        pointer.dy = 0;
        splat(posX, posY, 0, 0, pointer.color);
    };

    const onMouseUp = () => {
        pointers.forEach(p => p.down = false);
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
          let posX = touches[i].pageX;
          let posY = touches[i].pageY;
          let pointer = pointers[i];
          if (!pointer) {
            pointer = { x:0, y:0, dx:0, dy:0, down:false, moved: false, color:[0,0,0]};
            pointers[i] = pointer;
          }
          pointer.down = true;
          pointer.color = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2];
          pointer.x = posX;
          pointer.y = posY;
          splat(posX, posY, 0, 0, pointer.color);
      }
    };
    
    const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const touches = e.targetTouches;
        for (let i = 0; i < touches.length; i++) {
            let pointer = pointers[i];
            if (!pointer.down) continue;

            const posX = touches[i].pageX;
            const posY = touches[i].pageY;
            
            let dx = (posX - pointer.x) * 10.0;
            let dy = (posY - pointer.y) * 10.0;

            if(Math.abs(dx) > 1 || Math.abs(dy) > 1) {
              splat(posX, posY, dx, dy, pointer.color);
            }

            pointer.x = posX;
            pointer.y = posY;
        }
    };

    const onTouchEnd = () => {
        pointers.forEach(p => p.down = false);
    };

    pointers.push({
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      down: false,
      moved: false,
      color: [30, 0, 300],
    });
    
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onTouchEnd);


    initFBOs();
    multipleSplats(parseInt((Math.random() * 20).toString()) + 5);
    update();

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{width:'100%', height:'100%'}}/>;
};

export default LiquidBackground;
