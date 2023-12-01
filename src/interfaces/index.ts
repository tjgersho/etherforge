export interface Rect{
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface GraphNode {
    x: number;
    y: number; 
    width: number;
    height: number;
    color: string;
    xVelocity: number;
    yVelocity: number;

    children: GraphNode[];

    setBounds(x: number, y: number, width: number, height: number, color: string): void;
    update(deltaTime: number, bounds: Rect): void;
    render(ctx: CanvasRenderingContext2D): void; 
    renderChildren(ctx: CanvasRenderingContext2D): void; 
}

export interface Touch {
    id: number;
    x: number;
    y: number;
  }

 
export interface Input {
    touches: Touch[];
    mousePos: {x: number; y: number};
    mouseDown: boolean;
    keysDown: { [key: string ]: boolean }; 
  }
  
 