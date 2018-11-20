class Game {
    //global attr for helpers
    private readonly canvasHelper: CanvasHelper;

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

        // all screens: uncomment to activate
        this.start_screen();
        // this.level_screen();
        // this.title_screen();

    }

    //-------- Splash screen methods ------------------------------------
    /**
     * Function to initialize the splash screen
     */
    public start_screen() {
        const center = this.canvasHelper.GetCenter();

        //1. add 'Asteroids' text
        this.canvasHelper.writeTextToCanvas("Asteroids", 140, center.X, 150);

        //2. add 'Press to play' text
        this.canvasHelper.writeTextToCanvas("PRESS PLAY TO START", 40, center.X, center.Y - 100);

        //3. add button with 'start' text
        this.canvasHelper.writeButtonToCanvas("Play!", center.X, center.Y+200, "./assets/images/SpaceShooterRedux/PNG/UI/buttonBlue.png", 20, null);

        //4. add Asteroid image
        this.canvasHelper.writeImageToCanvas(
            "./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_big1.png",
            center.X, center.Y
        );
    }

    //-------- level screen methods -------------------------------------
    /**
     * Function to initialize the level screen
     */
    public level_screen() {
        //1. load life images
        const lifeImagePath = "./assets/images/SpaceShooterRedux/PNG/UI/playerLife1_blue.png";

        for (let i = 0; i < this.lives; i++)
            this.canvasHelper.writeImageToCanvas(lifeImagePath, 20 + 32*i, 20, 0);

        //2. draw current score
        this.canvasHelper.writeTextToCanvas(`Score: ${this.score}`, 20, this.canvasHelper.GetWidth() - 150, 65, undefined, undefined, "right");

        //3. draw random asteroids
        const asteroids: Array<string> = [
            "./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_big1.png",
            "./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_big2.png",
            "./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_big3.png",
            "./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_big4.png",
            "./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_med1.png",
            "./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_med3.png",
            "./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_small1.png",
            "./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_small2.png",
            "./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_tiny1.png",
            "./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_tiny2.png",
        ];

        const maxAsteroidsOnScreen: number = 5;

        for (let i = 0; i < maxAsteroidsOnScreen; i++) {
            const index = MathHelper.randomNumber(0, asteroids.length);

            this.canvasHelper.writeImageToCanvas(
                asteroids[index],
                MathHelper.randomNumber(0, this.canvasHelper.GetWidth()),
                MathHelper.randomNumber(0, this.canvasHelper.GetHeight())
            );
        }
    }

    //-------- Title screen methods -------------------------------------

    /**
     * Function to initialize the title screen
     */
    public title_screen() {
        const center = this.canvasHelper.GetCenter();

        //1. draw your score
        this.canvasHelper.writeTextToCanvas(`${this.player} score is ${this.score}`, 80, center.X, center.Y - 100);

        //2. draw all highscores
        this.canvasHelper.writeTextToCanvas("HIGHSCORES", 40, center.X, center.Y);

        this.highscores.forEach((element, index) => {
            center.Y += 40;

            this.canvasHelper.writeTextToCanvas(
                `${index + 1}: ${element.playerName} - ${element.score}`,
                20,
                center.X,
                center.Y
            );
        });
    }

    //-------Generic canvas functions ----------------------------------

    private draw() {
        this.canvasHelper.Clear();

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
let init = function () {
    const Asteroids = new Game(<HTMLCanvasElement>document.getElementById('canvas'));
    // const Asteroids2 = new Game(<HTMLCanvasElement>document.getElementById('canvas2'));
    // const Asteroids3 = new Game(<HTMLCanvasElement>document.getElementById('canvas3'));
    // const Asteroids4 = new Game(<HTMLCanvasElement>document.getElementById('canvas4'));
};

//add loadlistener for custom font types
window.addEventListener('load', init);
