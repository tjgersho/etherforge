 
import { Matrix3, TransformState, Input, Rect } from "../models";

// Base graph node class
export class RealNode {
 
    width!: number;
    height!: number;
    color?: string;

    localTransform: Matrix3 = new Matrix3();
    parentTransform: Matrix3 = new Matrix3(); // Initializes with identity.
    worldTransform: Matrix3 = new Matrix3();
    cameraTransform: Matrix3 = new Matrix3(); 

    transformState: TransformState;
    transformVelState: TransformState;

    xVel: number = 0;
    yVel: number = 0;

    children: RealNode[] = [];
 
    input_hook: (deltaTime: number, input: Input) => void = (_) => {};


    get x():number {return this.localTransform.tx}
    set x(x: number) {
      this.localTransform.tx = x;
      this.worldTransform.tx = this.parentTransform.multiply(this.localTransform).tx
    }

    get y():number { return this.localTransform.ty;}
    set y(y: number) {
      this.localTransform.ty = y; 
      this.worldTransform.ty = this.parentTransform.multiply(this.localTransform).ty
    }

    get xWorld():number {return this.worldTransform.tx}
    set xWorld(x: number) {
      this.worldTransform.tx = x;
      this.localTransform.tx = this.parentTransform.inverse().multiply(this.worldTransform).tx
    }
    get yWorld():number { return this.worldTransform.ty;}
    set yWorld(y: number) {
      this.worldTransform.ty = y; 
      this.localTransform.ty = this.parentTransform.inverse().multiply(this.worldTransform).ty
    }

     // get xVelWorld(): number { return this.worldVelTransform.tx }
    // set xVelWorld(xVel: number) { 
    //   this.worldVelTransform.tx = xVel 
    //   this.localVelTransform.tx = this.parentVelTransform.inverse().multiply(this.worldVelTransform).tx
    // }
    // get yVelWorld(): number { return this.worldVelTransform.ty }
    // set yVelWorld(velY: number) { 
    //   this.worldVelTransform.ty = velY 
    //   this.localVelTransform.ty = this.parentVelTransform.inverse().multiply(this.worldVelTransform).ty
    // }
    
 
    constructor(){ }

    setProps(kwargs: any){
      this.x = kwargs["x"];
      this.y = kwargs["y"];
      this.width = kwargs["width"];
      this.height = kwargs["height"];
      this.color = kwargs["color"];
    }

    processInput(deltaTime: number, input: Input){
        this.input_hook(deltaTime, input);
         // Update children
        this.children.forEach(child => {
          child.processInput(deltaTime, input);    
        });

    }
     
    update(deltaTime: number, bounds: Rect, ts: TransformState) {

      this.x  += this.xVel * deltaTime;
      this.y  += this.yVel * deltaTime;

      this.transforms(ts)
      const nextTs = new TransformState(ts.camera, this.worldTransform);

      this.children.forEach(child => {
        child.update(deltaTime, bounds, nextTs);    
      });
    }

    transforms( state: TransformState): void {
      this.transformState = state;

      this.parentTransform = state.parentTransform;
      this.worldTransform = this.parentTransform.multiply(this.localTransform)
      this.cameraTransform = state.camera.viewMatrix.multiply(this.worldTransform);

    }

    allTransforms(state: TransformState): void {
      this.transforms(state);

      const next_state = new TransformState(state.camera, this.worldTransform);
            
      this.children.forEach(child => {
        child.allTransforms(next_state);    
      });
    }
  
    render(ctx: CanvasRenderingContext2D, depth: number) {
        // Draw current node
        // this.transforms(state);
        ctx.fillStyle = this.color || "transparent";  

        ctx.fillRect(this.cameraTransform.tx, this.cameraTransform.ty, this.width, this.height);
  
        if(depth > 0){
          // Draw lines to children
          this.children.forEach(child => {
          ctx.beginPath();
          ctx.moveTo(this.cameraTransform.tx + this.width/2, this.cameraTransform.ty + this.height/2); 
          ctx.lineTo(child.cameraTransform.tx + child.width/2, child.cameraTransform.ty + child.height/2);
          ctx.stroke();
        });
        }
      depth++;
      this.renderChildren(ctx, depth);
    }


    renderChildren(ctx: CanvasRenderingContext2D, depth: number){
      // Render all children nodes
      this.children.forEach(child => {
        // Child world matrix is parent's world matrix  
         child.render(ctx, depth); 
      });
    }
    
}
  