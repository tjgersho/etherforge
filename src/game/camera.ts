  import { Vector2, Matrix3 } from '../models';


export class Camera {
    pos: Vector2;

    constructor(initPos: Vector2) {
      this.pos = initPos;
    } 
    
    
    get viewMatrix() : Matrix3 {
      const viewMatrix = new Matrix3();
      viewMatrix.a = 1;
      viewMatrix.b = 0;
      viewMatrix.c = 0;
      viewMatrix.d = 1;
      viewMatrix.tx = -this.pos.x;
      viewMatrix.ty = -this.pos.y;
      return viewMatrix;
    }
}
