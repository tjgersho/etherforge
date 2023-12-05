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
  
    public identity() {
      this.a = 1; 
      this.b = 0;
      this.c = 0; 
      this.d = 1;
      this.tx = 0; 
      this.ty = 0;
    } 
  
    public translate(x: number, y: number) {
      this.tx += x;
      this.ty += y; 
    }

    public scale(sx: number, sy: number) {
        this.a *= sx;
        this.b *= sx;
        this.c *= sy;  
        this.d *= sy;
        
        return this;
    }

    public rotate(angle: number): Matrix3 {
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
  

    public skew(ax: number, ay: number) {
      const a = this.a + this.b * ay;
      const b = this.b + this.a * ax;
      const c = this.c + this.d * ay; 
      const d = this.d + this.c * ax;
      const newMat = new Matrix3();
      newMat.a = a; newMat.b = b; newMat.c = c; newMat.d = d;
      newMat.tx = this.tx; newMat.ty = this.ty;
      return newMat;  
    }

    public inverse(): Matrix3 {
        // I use Guassian Elimination to calculate the inverse:
        // (1) 'augment' the matrix (left) by the identity (on the right)
        // (2) Turn the matrix on the left into the identity by elemetry row ops
        // (3) The matrix on the right is the inverse (was the identity matrix)
        // There are 3 elemtary row ops: (I combine b and c in my code)
        // (a) Swap 2 rows
        // (b) Multiply a row by a scalar
        // (c) Add 2 rows
        
        //if the matrix isn't square: exit (error)
        const M = [[this.a, this.b, this.tx], [this.c, this.d, this.ty], [0,0,1]];
        //create the identity matrix (I), and a copy (C) of the original
        var i=0, ii=0, j=0, dim=3, e=0, t=0;
        var I: number[][] = [[],[],[]];
        var C: number[][] = [[],[],[]];
        for(i=0; i<dim; i+=1){
            // Create the row
            for(j=0; j<dim; j+=1){
                
                //if we're on the diagonal, put a 1 (for identity)
                if(i==j){ I[i][j] = 1; }
                else{ I[i][j] = 0; }
                
                // Also, make the copy of the original
                C[i][j] = M[i][j];
            }
        }
        
        // Perform elementary row operations
        for(i=0; i<dim; i+=1){
            // get the element e on the diagonal
            e = C[i][i];
            
            // if we have a 0 on the diagonal (we'll need to swap with a lower row)
            if(e==0){
                //look through every row below the i'th row
                for(ii=i+1; ii<dim; ii+=1){
                    //if the ii'th row has a non-0 in the i'th col
                    if(C[ii][i] != 0){
                        //it would make the diagonal have a non-0 so swap it
                        for(j=0; j<dim; j++){
                            e = C[i][j];       //temp store i'th row
                            C[i][j] = C[ii][j];//replace i'th row by ii'th
                            C[ii][j] = e;      //repace ii'th by temp
                            e = I[i][j];       //temp store i'th row
                            I[i][j] = I[ii][j];//replace i'th row by ii'th
                            I[ii][j] = e;      //repace ii'th by temp
                        }
                        //don't bother checking other rows since we've swapped
                        break;
                    }
                }
                //get the new diagonal
                e = C[i][i];
                //if it's still 0, not invertable (error)
                if(e==0){return}
            }
            
            // Scale this row down by e (so we have a 1 on the diagonal)
            for(j=0; j<dim; j++){
                C[i][j] = C[i][j]/e; //apply to original matrix
                I[i][j] = I[i][j]/e; //apply to identity
            }
            
            // Subtract this row (scaled appropriately for each row) from ALL of
            // the other rows so that there will be 0's in this column in the
            // rows above and below this one
            for(ii=0; ii<dim; ii++){
                // Only apply to other rows (we want a 1 on the diagonal)
                if(ii==i){continue;}
                
                // We want to change this element to 0
                e = C[ii][i];
                
                // Subtract (the row above(or below) scaled by e) from (the
                // current row) but start at the i'th column and assume all the
                // stuff left of diagonal is 0 (which it should be if we made this
                // algorithm correctly)
                for(j=0; j<dim; j++){
                    C[ii][j] -= e*C[i][j]; //apply to original matrix
                    I[ii][j] -= e*I[i][j]; //apply to identity
                }
            }
        }
        
        //we've done all operations, C should be the identity
        //matrix I should be the inverse:
        const inverseM = new Matrix3();
        inverseM.a = I[0][0];
        inverseM.b = I[0][1];
        inverseM.c = I[1][0];
        inverseM.d = I[1][1];
        inverseM.tx = I[0][2];
        inverseM.ty = I[1][2];
        return inverseM;
    }

    public multiply(matrix: Matrix3) : Matrix3 {    
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
