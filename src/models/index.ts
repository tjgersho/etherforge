

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
      this.tx = x;
      this.ty = y; 
    }

    scale(sx: number, sy: number) {
        this.a *= sx;
        this.b *= sx;
        
        this.c *= sy;  
        this.d *= sy;
        
        return this;
    }

    multiply(matrix: Matrix3) : Matrix3 {    
        const a = this.a * matrix.a + this.c * matrix.b;
        const b = this.b * matrix.a + this.d * matrix.b;        
        const c = this.a * matrix.c + this.c * matrix.d;
        const d = this.b * matrix.c + this.d * matrix.d;
        const tx = this.a * matrix.tx + this.c * matrix.ty + this.tx; 
        const ty = this.b * matrix.tx + this.d * matrix.ty + this.ty;
    
        const newMat = new Matrix3();
        newMat.a = a;
        newMat.a = b;
        newMat.a = c;
        newMat.a = d;
        newMat.a = tx;
        newMat.a = ty;
        return newMat;
    }
}

const A = new Matrix3(); 
A.translate(10, 10);

const B = new Matrix3();
B.scale(2, 2); 

const C = A.multiply(B); 
// C has translation by (10, 10) 
// and then scale by (2, 2)



// Camera view transform
const camera = new Matrix3(); 
camera.translate(-100, -50);

// Node A world transform
const worldA = new Matrix3();
worldA.translate(100, 100);

// Node B local transform 
const localB = new Matrix3();
localB.translate(50, 0); 

// Node C local transform
const localC = new Matrix3();
localC.translate(10, 10);

// Build world transform chain 
const worldB = worldA.multiply(localB); 
const worldC = worldB.multiply(localC);

// Apply camera view transform
const viewC = camera.multiply(worldC);

// Render position
const x = viewC.tx; 
const y = viewC.ty;

 