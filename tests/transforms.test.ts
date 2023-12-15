import { Camera } from '../src/game/camera';
import { ChildNode, Matrix3, etherforge, Rect, TransformState, Vector2 } from '../src/index';


it("Moves in x direction", () => {
    let canvasElem: HTMLCanvasElement = {getContext: (dat: string)=>{}} as HTMLCanvasElement;
    let engine =  new etherforge(canvasElem);
    const child = new ChildNode();
    child.setProps({x:100, y:0, width:100, height:100});
    engine.game.root.children.push(child);

    const child1 = new ChildNode();
    child1.setProps({x:100, y:0, width:100, height:100});
    child.children.push(child1);

    const identity = new Matrix3()
    identity.identity();
    let cam = new Camera(new Vector2(0,0), 100, 100);
    let transformState = new TransformState(
        cam,
        identity
    );
 
    engine.game.root.allTransforms(transformState);

    expect(child1.xWorld).toBe(200);
    expect(child1.x).toBe(100);

    child.x += 10

    engine.game.root.allTransforms(transformState);

    expect(child1.xWorld).toBe(210);
    expect(child1.x).toBe(100);

    child.xWorld += 10

    engine.game.root.allTransforms(transformState);

    expect(child1.xWorld).toBe(220);
    expect(child1.x).toBe(100);

    child.xWorld += 10

    expect(child1.xWorld).toBe(220);
    expect(child1.x).toBe(100);

    engine.game.root.allTransforms(transformState);

    expect(child1.xWorld).toBe(230);
    expect(child1.x).toBe(100);

 

})



it("Moves in x direction --", () => {
    let canvasElem: HTMLCanvasElement = {getContext: (dat: string)=>{}} as HTMLCanvasElement;
    let engine =  new etherforge(canvasElem);
    const child = new ChildNode();
    child.setProps({x:100, y:0, width:100, height:100});
    engine.game.root.children.push(child);

    const child1 = new ChildNode();
    child1.setProps({x:100, y:0, width:100, height:100});
    child.children.push(child1);

    const identity = new Matrix3()
    identity.identity();
    let cam = new Camera(new Vector2(0,0), 100, 100);
    let transformState = new TransformState(
        cam,
        identity
    );
 
    engine.game.root.update(1, new Rect(0, 0,  1000, 1000), transformState);

    expect(child1.xWorld).toBe(200);
    expect(child1.x).toBe(100);

    child.x += 10

    expect(child.x).toBe(110);
    expect(child.xWorld).toBe(110);

    expect(child1.xWorld).toBe(200);
    expect(child1.x).toBe(100);

    engine.game.root.update(1, new Rect(0, 0,  1000, 1000), transformState);

 
    console.log(child1.localTransform);
    console.log(child1.worldTransform);
    
})