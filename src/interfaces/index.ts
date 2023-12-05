import { TransformState } from "../models";

export interface Rect{
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface RealNode {
    x: number;
    y: number; 
    width: number;
    height: number;
    color: string;
    xVelocity: number;
    yVelocity: number;

    children: RealNode[];

    setProps(kwargs: any): void;
    update(deltaTime: number, bounds: Rect): void;
    transforms( state: TransformState): void
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
  
 