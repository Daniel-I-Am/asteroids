/// <reference path="base/ViewBase.ts"/>

class Game {
    //global attr for canvas
    //readonly attributes must be initialized in the constructor
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    //some global player attributes
    private readonly player: string = "Player1";
    private readonly score: number = 400;
    private readonly lives: number = 3;
    private readonly highscores: Array<any>; //TODO: do not use 'any': write an interface!

    private leftPressed: boolean;
    private upPressed: boolean;
    private rightPressed: boolean;
    private downPressed: boolean;

    private shipXOffset: number = 50;
    private shipYOffset: number = 37;

    private d_currentView: ViewBase;

    public constructor(canvasId: HTMLCanvasElement) {
        //construct all canvas
        this.canvas = canvasId;
        this.canvas.width = window.innerWidth;// /2; // for two on one row
        this.canvas.height = window.innerHeight;// /2; // for two on the col
        //set the context of the canvas
        this.ctx = this.canvas.getContext('2d');

        this.highscores = [
            {
                playerName: 'Loek',
                score: 40000
            },
            {
                playerName: 'Daan',
                score: 34000
            },
            {
                playerName: 'Rimmert',
                score: 200
            }
        ]

        // all screens: uncomment to activate

        this.d_currentView = new MenuView(canvasId, this.ChangeView);
        this.d_currentView.Render();
        //this.start_screen();
        // this.level_screen();
        // this.title_screen();

    }

    private ChangeView = (aNewView: ViewBase): void => {
        this.d_currentView.BeforeExit();
        this.d_currentView = aNewView;
        this.d_currentView.Render();
    }
}

//this will get an HTML element. I cast this element in de appropriate type using <>
let init = function () {
    const Asteroids = new Game(<HTMLCanvasElement>document.getElementById('canvas'));
    // const Asteroids2 = new Game(<HTMLCanvasElement>document.getElementById('canvas2'));
    // const Asteroids3 = new Game(<HTMLCanvasElement>document.getElementById('canvas3'));
    // const Asteroids4 = new Game(<HTMLCanvasElement>document.getElementById('canvas4'));
};

//add loadlistener for custom font types
window.addEventListener('load', init);
