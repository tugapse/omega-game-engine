import { mat4 } from "gl-matrix";

/**
 * Manages a WebGL Uniform Buffer Object (UBO) for storing and sharing camera matrices.
 *
 * @remarks
 * A UBO is a performance optimization that allows a single block of data (in this case,
 * the view and projection matrices) to be uploaded to the GPU once per frame and then
 * shared across multiple shader programs. This avoids the overhead of setting the same
* uniforms for every object that is drawn.
 */
export class CameraUBO {
  private gl: WebGL2RenderingContext;
  private ubo: WebGLBuffer;
  private data: Float32Array;
  
  /**
   * The global binding point for this UBO. All shaders that use this camera data
   * must bind their uniform block to this same point.
   * @readonly
   */
  public readonly BINDING_POINT = 0; 

  /**
   * Creates an instance of CameraUBO.
   * @param gl - The WebGL2 rendering context.
   */
  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.ubo = gl.createBuffer()!;
    
    // We need space for two mat4s (view and projection).
    // 1 mat4 = 16 floats. 2 mat4s = 32 floats.
    this.data = new Float32Array(32); 

    this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.ubo);
    // Allocate buffer space on the GPU. We use DYNAMIC_DRAW because the camera
    // matrices will be updated every frame.
    this.gl.bufferData(this.gl.UNIFORM_BUFFER, this.data.byteLength, this.gl.DYNAMIC_DRAW); 
    
    // Bind this buffer to the global binding point 0
    this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, this.BINDING_POINT, this.ubo);
    this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
  }

  /**
   * Updates the buffer on the GPU with the latest view and projection matrices.
   * This should be called exactly once per frame, before any objects that use this UBO are rendered.
   *
   * @param viewMatrix - The camera's view matrix.
   * @param projectionMatrix - The camera's projection matrix.
   */
  public update(viewMatrix: mat4, projectionMatrix: mat4): void {
    // Pack the two matrices into our single Float32Array
    this.data.set(viewMatrix, 0);          // Offset 0
    this.data.set(projectionMatrix, 16);   // Offset 16

    this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.ubo);
    // Push the updated array to the GPU
    this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 0, this.data);
    this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
  }
}