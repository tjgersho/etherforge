  import { Vector2, Matrix3 } from '../models';


export class Camera {
    pos: Vector2;

    // Current and target zoom  
    zoom: number = 1;
    targetZoom: number = 1;  

    // Zoom speed 
    zoomSpeed: number = 0.05;

    constructor(initPos: Vector2) {
      this.pos = initPos;
    } 

    // New desired target 
    setZoom(newZoom: number) {
        this.targetZoom = newZoom;
    }
 
    update(dt: number) {
      // Smoothly interpolate
      if (this.zoom !== this.targetZoom) {
        // Lerp towards target 
        this.zoom += (this.targetZoom - this.zoom) * this.zoomSpeed * dt;  
  
        // Clamp
        this.zoom = Math.min(Math.max(this.zoom, 0.1), 5);
      }
    }
    
    
    get viewMatrix() : Matrix3 {
      const viewMatrix = new Matrix3();
      viewMatrix.a = this.zoom;
      viewMatrix.b = 0;
      viewMatrix.c = 0;
      viewMatrix.d = this.zoom;
      viewMatrix.tx = -this.pos.x;
      viewMatrix.ty = -this.pos.y;
      return viewMatrix;
    }
}
