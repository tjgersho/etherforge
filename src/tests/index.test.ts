import { RealTime } from '../index';

it('Runs without crashing', () => {
    let canvasElem: HTMLCanvasElement = {} as HTMLCanvasElement;
    new RealTime(canvasElem);
});