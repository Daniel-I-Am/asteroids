interface Score {
    playerName: string;
    score: number;
}

interface AsteroidImage {
    name: string;
    images: number[];
}

interface Loc {
    x: number;
    y: number;
}

class Game {
    //global attr for canvas
    //readonly attributes must be initialized in the constructor
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    //some global player attributes
    private readonly player: string = "Player1";
    private score: number = 400;
    private lives: number = 3;
    private highscores: Array<Score>;

    private leftPressed: boolean;
    private rightPressed: boolean;
    private upPressed: boolean;
    private downPressed: boolean;
    private rotLPressed: boolean;
    private rotRPressed: boolean;
    private spaceShipLoc: Loc;
    private spaceShipRot: number;

    public constructor(canvasId: HTMLCanvasElement) {
        //construct all canvas
        this.canvas = canvasId;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
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
        this.start_screen();
        // this.level_screen();
        // this.title_screen();

    }

    //-------- Splash screen methods ------------------------------------
    /**
     * Function to initialize the splash screen
     */
    public start_screen() {
        let buttonOffset = 100;
        //0. clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //1. add 'Asteroids' text
        this.centerText("Asteroids", 200, 192);
        //2. add 'Press to play' text
        this.centerText("Press start to play", 400, 48);
        //3. add button with 'start' text
        this.addButton("./assets/images/SpaceShooterRedux/PNG/UI/buttonBlue.png", "Start!", this.canvas.width/2, this.canvas.height - buttonOffset, "click", () => {
            this.level_screen()
            window.addEventListener("keydown", (e) => this.keyDownHandler(e));
            window.addEventListener("keyup",   (e) => this.keyUpHandler(e));
            window.setInterval(() => this.draw(), 1000/30);
        }, 24, true);
        //4. add Asteroid image
        this.addImage("./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_big1.png", this.canvas.width/2, 500);
    }

    //-------- level screen methods -------------------------------------
    /**
     * Function to initialize the level screen
     */
    public level_screen() {
        //0. clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //1. load life images
        for (let i = 0; i<this.lives; i++)
            this.addImage("./assets/images/SpaceShooterRedux/PNG/UI/playerLife1_blue.png", 50 + i * 32, 30, 0, null, false);
        //2. draw current score
        this.writeText(`Score: ${this.score.toString()}`, this.canvas.width - 50, 50, 32, "right");
        //3. draw random asteroids
        for (let i = this.randomNumber(10, 20); i>0; i--)
            this.drawRandomAsteroid();
        //4. draw player spaceship
        this.spaceShipLoc = {x: this.canvas.width/2, y: this.canvas.height - 200}
        this.spaceShipRot = 0;
        this.addImage("./assets/images/SpaceShooterRedux/PNG/playerShip1_blue.png", this.canvas.width/2, this.canvas.height - 200);
    }

    //-------- Title screen methods -------------------------------------

    /**
    * Function to initialize the title screen   
    */
    public title_screen() {
        //0. clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //1. draw your score
        this.centerText(`You died with ${this.score} points`, 100, 96);
        //2. draw all highscores
        this.drawHighScores();
    }

    //-------Generic canvas functions ----------------------------------

    /**
    * Renders a random number between min and max
    * @param {number} min - minimal time
    * @param {number} max - maximal time
    * @returns random number
    */
    public randomNumber(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }

    /**
     * Writes text to canvas
     * @param {string} text Text to write to canvas
     * @param {number} x X-coord to write at
     * @param {number} y Y-Coord to write at
     * @param {number} fontSize fontsize to use
     * @param {CanvasTextAlign} align Alignment to use when writing
     * @param {string} fontFamily fontFamily to use
     * @param {string} color Color to use, default white
     */
    private writeText(
        text: string,
        x: number,
        y: number,
        fontSize: number,
        align: CanvasTextAlign = "left",
        fontFamily: string = "Minecraft",
        color: string = "#ffffff"
    ) {
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontSize}px ${fontFamily}`;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }

    /**
     * Center text at a given y-coordinate
     * @param {string} text Text to write to canvas
     * @param {number} y Y-Coord to center text
     * @param {number} fontSize fontsize to use
     * @param {string} fontFamily fontFamily to use
     * @param {string} color Color to use, default white
     */
    private centerText(text: string,
        y: number,
        fontSize: number,
        fontFamily: string = "Minecraft",
        color: string = "#ffffff"
    ) {
        this.writeText(
            text, this.canvas.width/2,
            y, fontSize, "center",
            fontFamily, color
        );
    }

    /**
     * Adds an image to the screen at the specified location
     * @param {string} src src location of the desired image
     * @param {number} x X-location to put the center of the image
     * @param {number} y Y-location to put the center of the image
     * @param {number} rot Rotation to use in degrees
     * @param {Function} callback callback function, executed once images has been loaded in and drawn on the screen
     * @param {boolean} shouldCenter Whether the image should be put relative to it's center 
     * @returns {number, number} Size of image
     */
    private addImage(src: string,
        x: number,
        y: number,
        rot: number = 0,
        callback: Function = null,
        shouldCenter: boolean = true
    ) {
        let image: HTMLImageElement = new Image;
        image.addEventListener('load', () => {
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(rot*Math.PI/180);
            if (shouldCenter)
                this.ctx.translate(-image.width/2, -image.height/2);
            this.ctx.drawImage(image, 0, 0);
            this.ctx.restore();
            if (callback)
                callback(this);
        });
        image.src = src;
        return image.width, image.height
    }

    private addButton(
        src: string,
        text: string,
        x: number,
        y: number,
        eventType: string,
        callback: Function,
        fontSize: number,
        shouldCenter: boolean = true
    ) {
        let image = new Image;
        image.addEventListener('load', () => {
            let tl: Loc, br: Loc;
            if (shouldCenter) {
                this.ctx.drawImage(image, x-image.width/2, y-image.height/2);
                this.writeText(text, x, y + fontSize/3, fontSize, "center", "Minecraft", "black");
                tl = {x: x-image.width/2, y: y-image.height/2};
                br = {x: x+image.width/2, y: y+image.height/2};
            } else {
                this.ctx.drawImage(image, x, y);
                tl = {x: x, y: y};
                br = {x: x+image.width, y: y+image.width};
                this.writeText(text, x+image.width/2, y+image.height/2, fontSize, "center", "Minecraft", "black");
            }
            if (!callback)
                return;
            this.canvas.addEventListener(eventType, (event: MouseEvent) => {
                if (
                    event.x > tl.x && event.x < br.x &&
                    event.y > tl.y && event.y < br.y
                ) {
                    callback();
                }
            });
        });
        image.src = src;
    }

    //---------Functions for drawing------------------------------------

    private drawRandomAsteroid() {
        let x = this.randomNumber(0, this.canvas.width),
            y = this.randomNumber(0, this.canvas.height),
            image = new Image;
        let imageCount: AsteroidImage[] = [
            {name: "Brown_big", images: [1,2,3,4]},
            {name: "Brown_med", images: [1,3]},
            {name: "Brown_small", images: [1,2]},
            {name: "Brown_tiny", images: [1,2]},
            {name: "Grey_big", images: [1,2,3,4]},
            {name: "Grey_med", images: [1,2]},
            {name: "Grey_small", images: [1,2]},
            {name: "Grey_tiny", images: [1,2]}
        ];

        let asteroidType: AsteroidImage = imageCount[this.randomNumber(0, imageCount.length-1)];
        let subImage: number = asteroidType.images[this.randomNumber(0, asteroidType.images.length-1)];
        this.addImage(`./assets/images/SpaceShooterRedux/PNG/Meteors/meteor${asteroidType.name}${subImage}.png`, x, y);
    }

    private drawHighScores() {
        this.centerText("Highscores", 250, 64)
        for (let i = 0; i < this.highscores.length; i++) {
            const elem = this.highscores[i];
            this.centerText(`${elem.playerName} - ${elem.score} points`, 300 + i * 50, 48);
        }
    }

    private keyDownHandler(event: KeyboardEvent) {
        switch(event.keyCode) {
            case 37:
            case 65:
                this.leftPressed = true
                break;
            case 38:
            case 87:
                this.upPressed = true;
                break;
            case 39:
            case 68:
                this.rightPressed = true;
                break;
            case 40:
            case 83:
                this.downPressed = true;
                break;
            case 81:
                this.rotRPressed = true;
                break;
            case 69:
                this.rotLPressed = true;
                break;
        }
    }

    private keyUpHandler(event: KeyboardEvent) {
        switch(event.keyCode) {
            case 37:
            case 65:
                this.leftPressed = false
                break;
            case 38:
            case 87:
                this.upPressed = false;
                break;
            case 39:
            case 68:
                this.rightPressed = false;
                break;
            case 40:
            case 83:
                this.downPressed = false;
                break;
            case 81:
                this.rotRPressed = false;
                break;
            case 69:
                this.rotLPressed = false;
                break;
        }
    }

    private draw() {
        let shipWidth = 104,
            shipHeight = 80,
            movementSpeed = 2,
            rotationSpeed = 2,
            oldLoc = this.spaceShipLoc;
        let x = movementSpeed*Math.sin(this.spaceShipRot*Math.PI/180),
            y = movementSpeed*Math.cos(this.spaceShipRot*Math.PI/180);
        if (this.leftPressed) this.spaceShipLoc = {x: this.spaceShipLoc.x - y, y: this.spaceShipLoc.y - x};
        if (this.rightPressed) this.spaceShipLoc = {x: this.spaceShipLoc.x + y, y: this.spaceShipLoc.y + x};
        if (this.upPressed) this.spaceShipLoc = {x: this.spaceShipLoc.x + x, y: this.spaceShipLoc.y - y};
        if (this.downPressed) this.spaceShipLoc = {x: this.spaceShipLoc.x - x, y: this.spaceShipLoc.y + y};
        if (this.rotLPressed) this.spaceShipRot+=rotationSpeed;
        if (this.rotRPressed) this.spaceShipRot-=rotationSpeed;

        if (this.spaceShipLoc.x - shipWidth/2  < 0)                  this.spaceShipLoc.x = 0 + shipWidth/2;
        if (this.spaceShipLoc.x + shipWidth/2  > this.canvas.width ) this.spaceShipLoc.x = this.canvas.width - shipWidth/2;
        if (this.spaceShipLoc.y - shipHeight/2 < 0)                  this.spaceShipLoc.y = 0 + shipHeight/2;
        if (this.spaceShipLoc.y + shipHeight/2 > this.canvas.height) this.spaceShipLoc.y = this.canvas.height - shipHeight/2;
        if (this.spaceShipRot < -180) this.spaceShipRot = 360 + this.spaceShipRot;
        if (this.spaceShipRot > 180) this.spaceShipRot = this.spaceShipRot - 360;

        this.ctx.save();
        this.ctx.translate(oldLoc.x, oldLoc.y);
        this.ctx.rotate(this.spaceShipRot*Math.PI/180);
        this.ctx.clearRect(-shipWidth/2, -shipHeight/2, shipWidth, shipHeight);
        this.ctx.restore();

        this.addImage("./assets/images/SpaceShooterRedux/PNG/playerShip1_blue.png", this.spaceShipLoc.x, this.spaceShipLoc.y, this.spaceShipRot);
    }
}

//this will get an HTML element. I cast this element in de appropriate type using <>
let Asteroids: Game;
let init = function () {
    Asteroids = new Game(<HTMLCanvasElement>document.getElementById('canvas'));
};
//add loadlistener for custom font types
window.addEventListener('load', init);
