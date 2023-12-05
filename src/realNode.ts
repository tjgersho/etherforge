 
import { Input, Rect } from "./interfaces"; 
import { Matrix3, TransformState } from "./models";

// Base graph node class
export class RealNode {
 
    width!: number;
    height!: number;
    color?: string;
    xVelocity: number = 0; //Relative x velocity
    yVelocity: number = 0; //Relative y velocity
    parentTransform: Matrix3 = new Matrix3(); // Initializes with identity.
    localTransform: Matrix3 = new Matrix3();
    renderTransform: Matrix3 = new Matrix3();
    children: RealNode[] = [];

    pre_update_hook: () => void = () => {};
    post_update_hook: () => void = () => {};

    get posX(): number { return   this.localTransform.tx + (this.width/2) }
    get posY(): number { return   this.localTransform.ty  + (this.height/2) }

    get x():number {return this.localTransform.tx}
    set x(x: number) {this.localTransform.tx = x;}

    get y():number { return this.localTransform.ty;}
    set y(y: number) {this.localTransform.ty = y; }


    constructor(){ }

    setProps(kwargs: any){
      this.x = kwargs["x"];
      this.y = kwargs["y"];
      this.width = kwargs["width"];
      this.height = kwargs["height"];
      this.color = kwargs["color"];
    }

     
    update(deltaTime: number, input: Input, bounds: Rect) {

      this.x += this.xVelocity * deltaTime;
      this.y += this.yVelocity * deltaTime;

      // Check bounds
      if(this.renderTransform.tx > (bounds.width - this.width)) {
        var targetMat = new Matrix3();
        targetMat.tx = bounds.width - this.width;
        targetMat.ty = this.renderTransform.ty;
        const iviewMatrix =  this.parentTransform.inverse()
        const globalToLocal = iviewMatrix.multiply(targetMat);
        this.x = globalToLocal.tx;
        this.xVelocity =  -this.xVelocity;
      }

      if(this.renderTransform.ty > (bounds.height - this.height)) {
        var targetMat = new Matrix3();
        targetMat.ty = bounds.height - this.height;
        targetMat.tx = this.renderTransform.tx;
        const iviewMatrix =  this.parentTransform.inverse()
        const globalToLocal = iviewMatrix.multiply(targetMat);
        this.y = globalToLocal.ty;
        this.yVelocity =  -this.yVelocity;
      }

      if(this.renderTransform.tx < 0) {
        var targetMat = new Matrix3();
        targetMat.tx = 0;
        targetMat.ty = this.renderTransform.ty;
        const iviewMatrix =  this.parentTransform.inverse()
        const globalToLocal = iviewMatrix.multiply(targetMat);
        this.x = globalToLocal.tx;
        this.xVelocity = -this.xVelocity;
      }

      if(this.renderTransform.ty < 0) {
        var targetMat = new Matrix3();
        targetMat.ty = 0;
        targetMat.tx = this.renderTransform.tx;
        const iviewMatrix =  this.parentTransform.inverse()
        const globalToLocal = iviewMatrix.multiply(targetMat);
        this.y = globalToLocal.ty;
        this.yVelocity = -this.yVelocity;
      }

      // Update children
      this.children.forEach(child => {
        child.update(deltaTime, input, bounds);    
      });

    }

    transforms( state: TransformState): void {
      this.parentTransform = state.parentTransform;
      const viewTransform = this.parentTransform.multiply(this.localTransform)
      this.renderTransform = state.camera.viewMatrix.multiply(viewTransform);
       // Update children
             
      const next_state = new TransformState(state.camera, this.parentTransform);
       this.children.forEach(child => {
        child.transforms(next_state);   
      });
    }
  
    render(ctx: CanvasRenderingContext2D) {
      // Draw current node
      // this.transforms(state);
 
      ctx.fillStyle = this.color || "transparent";  

      ctx.fillRect(this.renderTransform.tx, this.renderTransform.ty, this.width, this.height);
 
       // Draw lines to children
       this.children.forEach(child => {
        ctx.beginPath();
        ctx.moveTo(this.renderTransform.tx + this.width/2, this.renderTransform.ty + this.height/2); 
        ctx.lineTo(child.renderTransform.tx + child.width/2, child.renderTransform.ty + child.height/2);
        ctx.stroke();
      });

      this.renderChildren(ctx);
    }


    renderChildren(ctx: CanvasRenderingContext2D){
      // Render all children nodes
      this.children.forEach(child => {
        // Child world matrix is parent's world matrix  
         child.render(ctx); 
      });
    }
}
  