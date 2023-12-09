  import { Vector2, Matrix3 } from '../models';


export class Camera {
    pos: Vector2;
    width: number;
    height: number;
    // Current and target zoom  
    zoom: number = 1;
    targetZoom: number = 1;  

    // Zoom speed 
    zoomSpeed: number = 0.05;

    constructor(initPos: Vector2, width: number, height: number) {
      this.pos = initPos;
      this.width = width;
      this.height = height;
    } 


    deltaZoom(deltaZoom: number): void {
      this.zoom += deltaZoom;
      this.pos.x += (this.width * deltaZoom)/2;
      this.pos.y += (this.height * deltaZoom)/2;
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
