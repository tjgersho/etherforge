import { Camera } from '../src/game/camera';
import { ChildNode, Matrix3, RealTime, Rect, TransformState, Vector2 } from '../src/index';

it('Runs without crashing', () => {
    let canvasElem: HTMLCanvasElement = {getContext: (dat: string)=>{}} as HTMLCanvasElement;
    new RealTime(canvasElem);
});

