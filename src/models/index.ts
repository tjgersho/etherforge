import { Camera } from "../game/camera";

// Maintain transform state
export class TransformState {
  camera: Camera;
  parentTransform: Matrix3; 
  
  constructor(camerTr: Camera, parentTr: Matrix3) {
    this.camera = camerTr; 
    this.parentTransform = parentTr;
  }
}


export class Vector2 {
    public x: number;
    public y: number;
  
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y; 
    }
  
    add(v: Vector2): Vector2 {
      return new Vector2(this.x + v.x, this.y + v.y);
    }
  
    multiply(n: number): Vector2 {
      return new Vector2(this.x * n, this.y * n);
    }
}
  
  
export class Matrix3 {
    public a: number = 1; 
    public b: number = 0;
    public c: number = 0;
    public d: number = 1;
    public tx: number = 0; 
    public ty: number = 0; 
  
    constructor() {}
  
    identity() {
      this.a = 1; 
      this.b = 0;
      this.c = 0; 
      this.d = 1;
      this.tx = 0; 
      this.ty = 0;
    } 
  
    translate(x: number, y: number) {
      this.tx += x;
      this.ty += y; 
    }

    scale(sx: number, sy: number) {
        this.a *= sx;
        this.b *= sx;
        this.c *= sy;  
        this.d *= sy;
        
        return this;
    }

    rotate(angle: number): Matrix3 {
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      const a = this.a * cosine + this.c * sine;
      const b = this.b * cosine + this.d * sine; 
      const c = this.c * cosine - this.a * sine;  
      const d = this.d * cosine - this.b * sine;
      const newMat = new Matrix3();
      newMat.a = a; newMat.b = b; newMat.c = c; newMat.d = d;
      newMat.tx = this.tx; newMat.ty = this.ty;
      return newMat;  
    }
  

    skew(ax: number, ay: number) {
      const a = this.a + this.b * ay;
      const b = this.b + this.a * ax;
      const c = this.c + this.d * ay; 
      const d = this.d + this.c * ax;
      const newMat = new Matrix3();
      newMat.a = a; newMat.b = b; newMat.c = c; newMat.d = d;
      newMat.tx = this.tx; newMat.ty = this.ty;
      return newMat;  
    }

    multiply(matrix: Matrix3) : Matrix3 {    
        const a = this.a * matrix.a + this.b * matrix.c;
        const b = this.a * matrix.b + this.b * matrix.d;
        const tx = this.a * matrix.tx + this.b * matrix.ty + this.tx;
        const c = this.c * matrix.a + this.d * matrix.c;
        const d = this.c * matrix.b + this.d * matrix.d
        const ty = this.c * matrix.tx + this.d * matrix.ty + this.ty;
        const newMat = new Matrix3();
        newMat.a = a;
        newMat.b = b;
        newMat.c = c;
        newMat.d = d;
        newMat.tx = tx;
        newMat.ty = ty;
        return newMat;
    }
}
