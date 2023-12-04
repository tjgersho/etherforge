
import { RealNode } from "../realNode";
import { Input, Rect } from "../interfaces";
// Example child node
export class ChildNode extends RealNode {
    constructor() {
      super();  
    }

    override update(deltaTime: number, input: Input, bounds: Rect): void {
      super.update(deltaTime, input, bounds);

      if (input.mouseDown){
        this.color = "red";
      }else{
        this.color = "green";
      }
    }

}

  