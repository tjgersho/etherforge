import { Vector2, Matrix3 } from '../models';


class Camera {
    pos: Vector2;
    viewMatrix: Matrix3;
  
    constructor(initPos: Vector2) {
      this.viewMatrix = new Matrix3();
      this.pos = initPos;
    } 
    
    getWorldToCameraMatrix() {
      // Calculate matrix going from world => camera space
    }
}
