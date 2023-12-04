

export class InputHandler {
    elementRef: HTMLElement;
    private keyDownEventFunc: (e: Event) => void;
    private keyUpEventFunc: (e: Event) => void;
    private mouseDwnEventFunc: (e: Event) => void;
    private mouseUpEventFunc: (e: Event) => void;
    private mouseMoveEventFunc: (e: Event) => void;
    private touchStartEventFunc: (e: Event) => void;
    private touchEndEventFunc: (e: Event) => void;
    private touchMoveEventFunc: (e: Event) => void;

    constructor(elementRef: any, event_callback: (e: Event) =>void){
        this.elementRef = elementRef;

        this.keyDownEventFunc = (e: any) => {
            e.preventDefault();
            event_callback(e);
        }
        this.keyUpEventFunc = (e: any) => {
            e.preventDefault();
            event_callback(e);
        }
        this.mouseDwnEventFunc = (e: any) => {
            e.preventDefault();
            event_callback(e);
        }
        this.mouseUpEventFunc = (e: any) => {
            e.preventDefault();
            event_callback(e);
        }
        this.mouseMoveEventFunc = (e: any) => {
            e.preventDefault();
            event_callback(e);
        }
        this.touchStartEventFunc = (e: any) => {
            event_callback(e);
        }
        this.touchMoveEventFunc = (e: any) => {
            event_callback(e);
        }
        this.touchEndEventFunc = (e: any) => {
            e.preventDefault();
            event_callback(e);
        }
        this.registerEvents();
    }

    registerEvents(){

        this.elementRef.addEventListener('keydown', this.keyDownEventFunc);
        this.elementRef.addEventListener('keyup',this.keyUpEventFunc);
        
        this.elementRef.addEventListener('mousedown', this.mouseDwnEventFunc);
        this.elementRef.addEventListener('mouseup', this.mouseUpEventFunc);
        this.elementRef.addEventListener('mousemove', this.mouseUpEventFunc);

        this.elementRef.addEventListener('touchstart', this.touchStartEventFunc);
        this.elementRef.addEventListener('touchmove', this.touchMoveEventFunc);
        this.elementRef.addEventListener('touchend', this.touchEndEventFunc);

    }

    cleanupEvents(){

        this.elementRef.removeEventListener('keydown', this.keyDownEventFunc);
        this.elementRef.removeEventListener('keyup',this.keyUpEventFunc);
        this.elementRef.removeEventListener('mousedown', this.mouseDwnEventFunc);
        this.elementRef.removeEventListener('mouseup', this.mouseUpEventFunc);
        this.elementRef.removeEventListener('mousemove', this.mouseUpEventFunc);

        this.elementRef.removeEventListener('touchstart', this.touchStartEventFunc);
        this.elementRef.removeEventListener('touchmove', this.touchMoveEventFunc);
        this.elementRef.removeEventListener('touchend', this.touchEndEventFunc);

    }
}

      