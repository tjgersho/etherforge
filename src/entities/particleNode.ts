
import { RealNode } from "./realNode";
import { TransformState,  Input, Rect  } from "../models";
// Example child node
export class ParticleNode extends RealNode {

    get aveRadius() {return  (this.width/2 + this.height/2) / 2};
  
    constructor() {
      super();  
      this.input_hook = (deltaTime: number, input: Input) => {
        if (input.mouseDown || input.touches.length > 0){
          if (!input.mouseDown && input.touches.length < 1) return;
          let clickx = input.mousePos.x;
          let clicky = input.mousePos.y;
      
          if (!input.mouseDown){
            clickx = input.touches[0].x;
            clicky = input.touches[0].y;
          }  
      
          var worldX = this.xWorld + this.width/2;
          var worldY = this.yWorld + this.height/2
          console.log("Input Hook")
          console.log(clickx - worldX, clicky - worldY)
          let dist = Math.sqrt( Math.pow( clickx - worldX, 2) + Math.pow(clicky - worldY, 2));
          // f = m*a
          // v = a*deltaTime
          // f = m*v/deltaTime
          
          let f = 50000 / dist;
          let deltaV = deltaTime * f
      
          let v = Math.sqrt(Math.pow(this.xVel,2) + Math.pow(this.yVel,2))
          let deltaVx = deltaV;
          let deltaVy = deltaV;
          if (v > 0){
            deltaVx = deltaV * (Math.abs(this.xVel)/v)
            deltaVy = deltaV * (Math.abs(this.yVel)/v) 
          } 
          if(clickx > worldX) {
            this.xVel += deltaVx
          }else{
            this.xVel -= deltaVx
          }
          if(clicky > worldY) {
            this.yVel += deltaVy
          }else{
            this.yVel -= deltaVy
          }
          
        }
      }
    }


    override update(deltaTime: number, bounds: Rect, transformState: TransformState): void {
      super.update(deltaTime, bounds, transformState);

        // Check bounds
        if(this.xWorld > (bounds.width - this.width) && this.xVel > 0) {
          this.xVel =  -this.xVel;
        }

        if(this.yWorld > (bounds.height - this.height) && this.yVel > 0) {
          this.yVel =  -this.yVel;
        }

        if(this.xWorld < 0 && this.xVel < 0) {
          this.xVel = -this.xVel;
        }

        if(this.yWorld < 0 && this.yVel < 0) {
          this.yVel =  -this.yVel;
        }


    }


    override render(ctx: CanvasRenderingContext2D, depth: number): void {
        // Draw current node
        ctx.fillStyle = this.color || "transparent";  

        ctx.beginPath();
        ctx.arc(this.cameraTransform.tx + (this.width * this.cameraTransform.a)/2,  this.cameraTransform.ty + (this.height*this.cameraTransform.d)/2, this.aveRadius*(this.cameraTransform.a + this.cameraTransform.d)/2, 0,2*Math.PI);
        ctx.fill();
        
       this.renderChildren(ctx, depth);
    }

}

  