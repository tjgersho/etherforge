
import { RealNode } from "./realNode";
import { TransformState, Input, Rect} from "../models";
// Example child node
export class ChildNode extends RealNode {
    constructor() {
      super();  
      this.input_hook = (deltaTime: number, input: Input) => {
        if (input.mouseDown){
          this.color = "red";
        }else{
          this.color = "green";
        }
      }
    }

    override update(deltaTime: number, bounds: Rect, ts: TransformState): void {
      super.update(deltaTime, bounds, ts);
 
      // Check bounds
      if(this.xWorld > (bounds.width - this.width)) {
        this.xVel =  -this.xVel;
        this.xWorld = (bounds.width - this.width);
      }

      if(this.yWorld > (bounds.height - this.height)) {
        this.yVel =  -this.yVel;
        this.yWorld = (bounds.height - this.height);
      }

      if(this.xWorld < 0) {
        this.xVel = -this.xVel;
        this.xWorld = 0;
      }

      if(this.yWorld < 0) {
          this.yVel =  -this.yVel;
          this.yWorld = 0;
      }

    }

}

  