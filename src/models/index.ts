import { Camera } from "../game/camera";


export abstract class Shape {
  abstract contains(point: Point): boolean

  abstract intersects(range: Rect): boolean
}

 
export class Rect extends Shape {
    contains(point: Point): boolean {
      return point.x >= this.x &&
      point.x <= this.x + this.width &&
      point.y >= this.y &&
      point.y <= this.y + this.height;
    }
    intersects(range: Rect): boolean {
      return !(range.x > this.x + this.width
        || range.x + range.width < this.x
        || range.y > this.y + this.height
        || range.y + range.height < this.y);
    }

    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number){
      super()
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
}

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number){
      this.x = x;
      this.y = y;
    }
}

 
export class Circle  implements Shape{
    readonly x: number;
    readonly y: number;
    readonly r: number;
    readonly rPow2: number;

    /**
     * Circle constructor;
     * @constructs Circle
     * @param {number} x - X coordinate of the circle.
     * @param {number} y - Y coordinate of the circle.
     * @param {number} r - Radius of the circle.
     * @param {*} [data] - Data to store along the circle.
     */
    constructor(x: number, y: number, r: number) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rPow2 = this.r * this.r; // To avoid square roots
    }

    private euclideanDistancePow2(point1: Point, point2: Point): number {
        return Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2);
    }

    /**
     * Check if a point is contained in the circle.
     * @param {Point|Object} point - The point to test if it is contained in the circle.
     * @returns {boolean} - True if the point is contained in the circle, otherwise false.
     */
    contains(point: Point): boolean {
        return this.euclideanDistancePow2(point, this) <= this.rPow2;
    }

    /**
     * Check if a box intersects with this circle.
     * @param {Box|Object} range - The box to test the intersection with.
     * @returns {boolean} - True if it intersects, otherwise false.
     */
    intersects(range: Rect): boolean {
        const dX = this.x - Math.max(range.x, Math.min(this.x, range.x + range.width));
        const dY = this.y - Math.max(range.y, Math.min(this.y, range.y + range.height));
        return (dX * dX + dY * dY) <= (this.rPow2);
    }
}



export class Touch {
    id: number;
    x: number;
    y: number;
  }

 
export class Input {
    touches: Touch[];
    mousePos: {x: number; y: number};
    mouseDown: boolean;
    mouseKey: number;
    keysDown: { [key: string ]: boolean }; 
}
  

type PointsComparator = <T extends Point>(point1: T, point2: T) => boolean;

export class QuadTreeConfig {
    capacity?: number;
    removeEmptyNodes?: boolean;
    maximumDepth?: number | -1;
    arePointsEqual?: PointsComparator;
}

type DeepRequired<T> = T extends Function ? T : (T extends object ? { [P in keyof Required<T>]: DeepRequired<T[P]>; } : NonNullable<Required<T>>);

export type QuadTreeConfigComplete = DeepRequired<QuadTreeConfig>;

export type Tree = number | {
    ne: number | Tree;
    nw: number | Tree;
    se: number | Tree;
    sw: number | Tree;
}

 


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


const defaultConfig: QuadTreeConfigComplete = {
  capacity: 4,
  removeEmptyNodes: false,
  maximumDepth: -1,
  arePointsEqual: (point1: Point, point2: Point) => point1.x === point2.x && point1.y === point2.y
};


export class QuadTree {

  private readonly container: Rect;
  private isDivided: boolean;
  private points: Point[];
  private readonly config: QuadTreeConfigComplete;
  private ne!: QuadTree;
  private nw!: QuadTree;
  private se!: QuadTree;
  private sw!: QuadTree;

  /**
   * Create a new QuadTree
   * @constructor
   * @param {Rect} container - The Rect on which the QuadTree will operate.
   * @param {Object} [config] - The configuration of the quadtree.
   * @param {number} [config.capacity] - The maximum amount of points per node.
   * @param {boolean} [config.removeEmptyNodes] - Specify if the quadtree has to remove subnodes if they are empty.
   * @param {number} [config.maximumDepth] - Specify the maximum depth of the tree.
   * @param {function} [config.arePointsEqual] - Specify a custom method to compare point for removal.
   * @param {(Object[]|Point[])} [points] - An array of initial points to insert in the QuadTree.
   * @param {number} points[].x - X coordinate of the point.
   * @param {number} points[].y - Y coordinate of the point.
   */
  constructor(container: Rect, config?: QuadTreeConfig, points: Point[] = []) {
      this.container = container;
      this.config = Object.assign({}, defaultConfig, config);

      this.isDivided = false;
      this.points = [];

      for (const point of points) {
          this.insertRecursive(point);
      }
  }

  /**
   * Return a tree representation of the QuadTree
   * @returns {{se: *, sw: *, ne: *, nw: *}|Number} - A tree representation of the QuadTree
   */
  getTree(): Tree {
      let tree;

      if (this.isDivided) {
          tree = {
              ne: this.ne.getTree(),
              nw: this.nw.getTree(),
              se: this.se.getTree(),
              sw: this.sw.getTree()
          };

      } else {
          tree = this.getNodePointAmount();
      }

      return tree;
  }

  /**
   * Get all the points in the QuadTree
   * @returns {(Object[]|Point[])} - An array containing all the points.
   */
  getAllPoints(): Point[] {
      const pointsList: Point[] = [];
      this.getAllPointsRecursive(pointsList);
      return pointsList;
  }

  /**
   * Get all the points in the QuadTree
   * @param {(Object[]|Point[])} pointsList
   * @private
   */
  private getAllPointsRecursive(pointsList: Point[]): void {
      if (!this.isDivided) {
          Array.prototype.push.apply(pointsList, this.points.slice());
          return;
      }

      this.ne.getAllPointsRecursive(pointsList);
      this.nw.getAllPointsRecursive(pointsList);
      this.se.getAllPointsRecursive(pointsList);
      this.sw.getAllPointsRecursive(pointsList);
  }

  /**
   * Return the amount of points in this node.
   * @returns {number} - The amount of points in this node.
   * @private
   */
  private getNodePointAmount(): number {
      return this.points.length;
  }

  /**
   * Divide this node into 4 sub-nodes
   * @private
   */
  private divide(): void {
      const childMaximumDepth = this.config.maximumDepth === -1 ? -1 : this.config.maximumDepth - 1;
      const childConfig: QuadTreeConfig = Object.assign({}, this.config, {maximumDepth: childMaximumDepth});

      this.isDivided = true;

      const x = this.container.x;
      const y = this.container.y;
      const w = this.container.width / 2;
      const h = this.container.height / 2;

      // Creation of the sub-nodes, and insertion of the current point
      this.ne = new QuadTree(new Rect(x + w, y, w, h), childConfig);
      this.nw = new QuadTree(new Rect(x, y, w, h), childConfig);
      this.se = new QuadTree(new Rect(x + w, y + h, w, h), childConfig);
      this.sw = new QuadTree(new Rect(x, y + h, w, h), childConfig);

      this.insert(this.points.slice());

      // We empty this node points
      this.points.length = 0;
      this.points = [];
  }

  /**
   * Remove a point in the QuadTree
   * @param {(Point|Object|Point[]|Object[])} pointOrArray - A point or an array of points to remove
   * @param {number} pointOrArray.x - X coordinate of the point
   * @param {number} pointOrArray.y - Y coordinate of the point
   */
  remove(pointOrArray: Point | Point[]): void {
      if (Array.isArray(pointOrArray)) {
          for (const point of pointOrArray) {
              this.removeRecursive(point);
          }
      } else {
          this.removeRecursive(pointOrArray);
      }
  }

  /**
   * Remove a point in the QuadTree
   * @param {(Point|Object)} point - A point to remove
   * @param {number} point.x - X coordinate of the point
   * @param {number} point.y - Y coordinate of the point
   * @private
   */
  private removeRecursive(point: Point): void {
      if (!this.container.contains(point)) {
          return;
      }

      if (!this.isDivided) {
          const len = this.points.length;
          for (let i = len - 1; i >= 0; i--) {
              if (this.config.arePointsEqual(point, this.points[i])) {
                  this.points.splice(i, 1);
              }
          }

          return;
      }

      this.ne.removeRecursive(point);
      this.nw.removeRecursive(point);
      this.se.removeRecursive(point);
      this.sw.removeRecursive(point);

      if (this.config.removeEmptyNodes) {
          if (this.ne.getNodePointAmount() === 0 && !this.ne.isDivided &&
              this.nw.getNodePointAmount() === 0 && !this.nw.isDivided &&
              this.se.getNodePointAmount() === 0 && !this.se.isDivided &&
              this.sw.getNodePointAmount() === 0 && !this.sw.isDivided) {

              this.isDivided = false;

              delete this.ne;
              delete this.nw;
              delete this.se;
              delete this.sw;
          }
      }
  }

  /**
   * Insert a point in the QuadTree
   * @param {(Point|Object|Point[]|Object[])} pointOrArray - A point or an array of points to insert
   * @param {number} pointOrArray.x - X coordinate of the point
   * @param {number} pointOrArray.y - Y coordinate of the point
   * @returns {boolean} true if the point or all the point has been inserted, false otherwise
   */
  insert(pointOrArray: Point | Point[]): boolean {
      if (Array.isArray(pointOrArray)) {
          let returnValue = true;
          for (const point of pointOrArray) {
              returnValue = returnValue && this.insertRecursive(point);
          }
          return returnValue;
      } else {
          return this.insertRecursive(pointOrArray);
      }
  }

  /**
   * Insert a point in the QuadTree
   * @param {(Point|Object)} point - A point to insert
   * @param {number} point.x - X coordinate of the point
   * @param {number} point.y - Y coordinate of the point
   * @returns {boolean}
   * @private
   */
  private insertRecursive(point: Point): boolean {
      if (!this.container.contains(point)) {
          return false;
      }
      if (!this.isDivided) {
          if (this.getNodePointAmount() < this.config.capacity || this.config.maximumDepth === 0) {
              this.points.push(point);
              return true;
          } else if (this.config.maximumDepth === -1 || this.config.maximumDepth > 0) {
              this.divide();
          }
      }

      if (this.isDivided) {
          return this.ne.insertRecursive(point) 
              || this.nw.insertRecursive(point) 
              || this.se.insertRecursive(point) 
              || this.sw.insertRecursive(point);
      } else {
          return false;
      }
  }

  /**
   * Query all the point within a range
   * @param {Shape} range - The range to test
   * @returns {(Point[]|Object[])} - The points within the range
   */
  query(range: Shape): Point[] {
      const pointsFound: Point[] = [];
      this.queryRecursive(range, pointsFound);
      return pointsFound;
  }

  /**
   * @param {Shape} range
   * @param {(Point[]|Object[])} pointsFound
   * @returns {(Point[]|Object[])}
   * @private
   */
  private queryRecursive(range: Shape, pointsFound: Point[]): void {
      if (range.intersects(this.container)) {
          if (this.isDivided) {
              this.ne.queryRecursive(range, pointsFound);
              this.nw.queryRecursive(range, pointsFound);
              this.se.queryRecursive(range, pointsFound);
              this.sw.queryRecursive(range, pointsFound);
          } else {
              const p = this.points.filter((point) => range.contains(point));

              Array.prototype.push.apply(pointsFound, p);
          }
      }
  }

  /**
   * Clear the QuadTree
   */
  clear(): void {
      this.points = [];
      this.isDivided = false;

      delete this.ne;
      delete this.nw;
      delete this.se;
      delete this.sw;
  }

}