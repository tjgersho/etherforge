import { RealNode } from "../realNode";


export class Game extends RealNode {
    root: RealNode;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number){
        super();
        this.ctx = ctx;
        this.root = new RealNode();
        this.root.setBounds(0,0,width,height, "gray");
        this.width = width;
        this.height = height;
    }
    
    start() {
      // Run main render loop    
      this.render();
    }
  
    render() {
       // Traverse game graph
       this.ctx.clearRect(0, 0,  this.width,  this.height);  
       console.log("Rendering.")
       this.root.render(this.ctx);
  
       requestAnimationFrame(() => this.render());
    }

}