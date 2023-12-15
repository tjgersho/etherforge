import { Game } from "./game/game";

export class etherforge {

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    game: Game;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.game = new Game(this.ctx, this.canvas.width, this.canvas.height);
    }

    run(): void {
        console.log("etherforge RUNNING")
        this.game.start();
    }
    
}
