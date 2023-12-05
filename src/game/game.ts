import { Input } from "../interfaces";
import { Matrix3, TransformState, Vector2 } from "../models";
import { RealNode } from "../realNode";
import { Camera } from "./camera";

export class Game extends RealNode {
    root: RealNode;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    lastTime: number  = Date.now(); 
    camera: Camera;
    inputs: Input = {
      touches: [],
      mousePos: {
        x: 0,
        y: 0
      },
      mouseDown: false,
      keysDown: {}
    };
    viewTransform: Matrix3 = new Matrix3();
    localTransform: Matrix3 = new Matrix3();

    transformState: TransformState;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number){
        super();
        this.ctx = ctx;
        this.root = new RealNode();
        this.root.setProps({x:0,y:0,width,height, color:"gray"});
        this.width = width;
        this.height = height;
        this.camera = new Camera(new Vector2(0,0));
        this.viewTransform.identity();
        this.localTransform.identity();
    }
    
    start() {
      // Run main render loop    
      const itentity = new Matrix3()
      itentity.identity();
      this.transformState = new TransformState(
        this.camera,
        itentity
      );
      
 
      this.run();
    }
  
    run() {

      let currentTime = Date.now();  
      let dt = (currentTime - this.lastTime) / 1000;

      this.root.pre_update_hook();

      this.root.update(dt, this.inputs, {x:0, y:0, width:this.width, height:this.height}); 

      this.root.post_update_hook();
 
      this.ctx.clearRect(0, 0, this.width, this.height);  

      this.root.transforms(this.transformState);
 
      this.root.render(this.ctx);

      this.lastTime = currentTime;
 
      requestAnimationFrame(() => this.run());

    }

}