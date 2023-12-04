 
import { Input, Rect } from "./interfaces"; 
import { Matrix3, TransformState } from "./models";

// Base graph node class
export class RealNode {
 
    width!: number;
    height!: number;
    color?: string;
    xVelocity: number = 0; //Relative x velocity
    yVelocity: number = 0; //Relative y velocity
    viewTransform: Matrix3 = new Matrix3(); // Initializes with identity.
    localTransform: Matrix3 = new Matrix3();
    renderTransform: Matrix3 = new Matrix3();
    children: RealNode[] = [];

    get posX(): number { return   this.localTransform.tx + (this.width/2) }
    get posY(): number { return   this.localTransform.ty  + (this.height/2) }

    get x():number {return this.localTransform.tx}
    set x(x: number) {this.localTransform.tx = x;}

    get y():number { return this.localTransform.ty;}
    set y(y: number) {this.localTransform.ty = y; }


    constructor(){ }

    setBounds(x: number, y: number, width: number, height: number, color: string) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
    }
  
    update(deltaTime: number, input: Input, bounds: Rect) {

      this.x += this.xVelocity * deltaTime;
      this.y += this.yVelocity * deltaTime;

      // Check bounds
      if(this.x > (bounds.width - this.width)) {
        this.x = bounds.width - this.width;
        this.xVelocity = -this.xVelocity;
      }
      if(this.y > (bounds.height - this.height)) {
        this.y = bounds.height - this.height;
        this.yVelocity = -this.yVelocity;
      }

      if(this.x < 0) {
        this.x = 0;
        this.xVelocity = -this.xVelocity;
      }
      if(this.y < 0) {
        this.y = 0;
        this.yVelocity = -this.yVelocity;
      }
      // Update children
      this.children.forEach(child => {
        child.update(deltaTime, input, bounds);    
      });

    }

    transforms( state: TransformState): void {
      this.viewTransform = state.parentTransform.multiply(this.localTransform)
      this.renderTransform = state.camera.viewMatrix.multiply(this.viewTransform);
    }
  
    render(ctx: CanvasRenderingContext2D, state: TransformState) {
      // Draw current node
      // this.transforms(state);
      this.transforms(state);

      ctx.fillStyle = this.color || "transparent";  

      ctx.fillRect(this.renderTransform.tx, this.renderTransform.ty, this.width, this.height);
 
       // Draw lines to children
       this.children.forEach(child => {
        ctx.beginPath();
        ctx.moveTo(this.renderTransform.tx + this.width/2, this.renderTransform.ty + this.height/2); 
        ctx.lineTo(child.renderTransform.tx + child.width/2, child.renderTransform.ty + child.height/2);
        ctx.stroke();
      });
      
      const next_state = new TransformState(state.camera, this.viewTransform);
      this.renderChildren(ctx, next_state);

     
          
  
    }


    renderChildren(ctx: CanvasRenderingContext2D, state: TransformState){
      // Render all children nodes
      this.children.forEach(child => {
        // Child world matrix is parent's world matrix  
         child.render(ctx, state); 
      });
    }
}
  