 
import { Input, Rect } from "./interfaces"; 

// Base graph node class
export class RealNode {

    x!: number;
    y!: number;
    width!: number;
    height!: number;
    color?: string;
    xVelocity: number = 0;
    yVelocity: number = 0;
    
    children: RealNode[] = [];

    get posX(): number { return   this.x + (this.width/2) }
    get posY(): number { return  this.y + (this.height/2) }

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
  
    render(ctx: CanvasRenderingContext2D) {
      // Draw current node
      ctx.fillStyle = this.color || "transparent";  
      ctx.fillRect(this.x, this.y, this.width, this.height);
      
      // Draw lines to children
      this.children.forEach(child => {
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, this.y + this.height/2); 
        ctx.lineTo(child.x + child.width/2, child.y + child.y/2);
        ctx.stroke();
      });
      
      this.renderChildren(ctx);
  
    }


    renderChildren(ctx: CanvasRenderingContext2D){
      // Render all children nodes
      this.children.forEach(child => {
        child.render(ctx); 
      });
    }
}
  