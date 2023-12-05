
import { RealNode } from "../realNode";
import { Input, Rect } from "../interfaces";
import { TransformState } from "../models";
// Example child node
export class ParticleNode extends RealNode {

    get aveRadius() {return  (this.width/2 + this.height/2) / 2};
  
    constructor() {
      super();  
    }

    override update(deltaTime: number, input: Input, bounds: Rect): void {
      super.update(deltaTime, input, bounds);
      
      if (input.mouseDown || input.touches.length > 0){
        if (!input.mouseDown && input.touches.length < 1) return;
        let clickx = input.mousePos.x;
        let clicky = input.mousePos.y;
 
        if (!input.mouseDown){
          clickx = input.touches[0].x;
          clicky = input.touches[0].y;
        }  

        let dist = Math.sqrt( Math.pow( clickx - this.posX , 2) + Math.pow(clicky - this.posY , 2));
        // f = m*a
        // v = a*deltaTime
        // f = m*v/deltaTime
        
        let f = 50000 / dist;
        let deltaV = deltaTime * f

        let v = Math.sqrt(Math.pow(this.xVelocity,2) + Math.pow(this.yVelocity,2))

        let deltaVx = deltaV * (Math.abs(this.xVelocity)/v)
        let deltaVy = deltaV * (Math.abs(this.yVelocity)/v) 

        if(clickx > this.posX) {
          this.xVelocity -= deltaV
        }else{
          this.xVelocity += deltaV
        }
        if(clicky > this.posY) {
          this.yVelocity -= deltaV
        }else{
          this.yVelocity += deltaV
        }
        
      }
    }


    override render(ctx: CanvasRenderingContext2D) {
        // Draw current node
        ctx.fillStyle = this.color || "transparent";  

        ctx.beginPath();
        ctx.arc(this.renderTransform.tx + this.width/2,  this.renderTransform.ty + this.height/2, this.aveRadius, 0,2*Math.PI);
        ctx.fill();
   
        // Draw lines to children
        this.children.forEach(child => {
         ctx.beginPath();
         ctx.moveTo(this.renderTransform.tx + this.width/2, this.renderTransform.ty + this.height/2); 
         ctx.lineTo(child.renderTransform.tx + child.width/2, child.renderTransform.ty + child.height/2);
         ctx.stroke();
       });
      
       this.renderChildren(ctx);
    
    }

}

  