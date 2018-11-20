class Game {
    //global attr for helpers
    private readonly canvasHelper: CanvasHelper;
    private d_currentView: ViewBase;

    //some global player attributes
    private readonly player: string = "Player1";
    private readonly score: number = 400;
    private readonly lives: number = 3;
    private readonly highscores: Array<Score>; //TODO: do not use 'any': write an interface!

    private leftPressed: boolean;
    private upPressed: boolean;
    private rightPressed: boolean;
    private downPressed: boolean;

    private shipXOffset: number = 50;
    private shipYOffset: number = 37;

    public constructor(canvasId: HTMLCanvasElement) {
        this.canvasHelper = new CanvasHelper(canvasId);

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

        // render the current screen
        this.d_currentView = new MenuView(canvasId, this.ChangeView);
        this.d_currentView.Render();
    }

    private ChangeView = (aNewView: ViewBase): void => {
        console.log("Game.ChangeView", this)
        this.d_currentView.BeforeExit();
        this.d_currentView = aNewView;
        this.d_currentView.Render();    
    }
    //-------Generic canvas functions ----------------------------------

    private draw() {

        if (this.leftPressed) {
            this.shipXOffset -= 2;
        }
        if (this.upPressed) {
            this.shipYOffset -= 2;
        }
        if (this.rightPressed) {
            this.shipXOffset += 2;
        }
        if (this.downPressed) {
            this.shipYOffset += 2;
        }

        //4. draw player spaceship
        this.canvasHelper.writeImageToCanvas("./assets/images/SpaceShooterRedux/PNG/playerShip1_blue.png", this.canvasHelper.GetWidth() / 2 + this.shipXOffset, this.canvasHelper.GetWidth() / 2 + this.shipYOffset);
    }

    private keyDownHandler(event: KeyboardEvent) {
        if (event.keyCode == 37) {
            this.leftPressed = true;
        }
        if (event.keyCode == 38) {
            this.upPressed = true;
        }
        if (event.keyCode == 39) {
            this.rightPressed = true;
        }
        if (event.keyCode == 40) {
            this.downPressed = true;
        }
    }

    private keyUpHandler(event: KeyboardEvent) {
        if (event.keyCode == 37) {
            this.leftPressed = false;
        }
        if (event.keyCode == 38) {
            this.upPressed = false;
        }
        if (event.keyCode == 39) {
            this.rightPressed = false;
        }
        if (event.keyCode == 40) {
            this.downPressed = false;
        }
    }
}

//this will get an HTML element. I cast this element in de appropriate type using <>
let Asteroids: Game;
let init = function () {
    Asteroids = new Game(<HTMLCanvasElement>document.getElementById('canvas'));
    // const Asteroids2 = new Game(<HTMLCanvasElement>document.getElementById('canvas2'));
    // const Asteroids3 = new Game(<HTMLCanvasElement>document.getElementById('canvas3'));
    // const Asteroids4 = new Game(<HTMLCanvasElement>document.getElementById('canvas4'));
};

//add loadlistener for custom font types
window.addEventListener('load', init);
