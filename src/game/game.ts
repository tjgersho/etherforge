import { Matrix3, TransformState, Vector2, Input, Rect, QuadTree} from "../models";
import { RealNode } from "../entities/realNode";
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
      mouseKey: 0,
      keysDown: {}
    };
    viewTransform: Matrix3 = new Matrix3();
    localTransform: Matrix3 = new Matrix3();

    quadTree: QuadTree;

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
        this.quadTree = new QuadTree(new Rect(this.root.x, this.root.y, this.root.width, this.root.height));
    }
    
    start() {
      // Run main render loop    
      const identity = new Matrix3()
      identity.identity();
      this.transformState = new TransformState(
        this.camera,
        identity
      );

      this.run();
    }
  
    run() {

      let currentTime = Date.now();  
      let dt = (currentTime - this.lastTime) / 1000;

      // Let graph handle any input
      this.root.processInput(dt, this.inputs);

      this.root.update(dt, new Rect(0, 0, this.width,this.height), this.transformState); 
      this.camera.update(dt);
      //Clear Canvas.
      this.ctx.clearRect(0, 0, this.width, this.height);  

      // Render frame
      this.root.render(this.ctx, 0);

      // save render time.
      this.lastTime = currentTime;
 
      //Game Loop.
      requestAnimationFrame(() => this.run());

    }

}