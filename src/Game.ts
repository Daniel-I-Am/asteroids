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

interface ImageDetails {
    x: number;
    y: number;
    src: string;
    w: number;
    h: number;
}

interface SpriteSheetTexture {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

class Game {
    //global attr for canvas
    //readonly attributes must be initialized in the constructor
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    //spriteMap objects
    private readonly spriteMapImage: HTMLImageElement;
    private spriteMapData: SpriteSheetTexture[];

    //some global player attributes
    private readonly player: string = "Player1";
    private score: number = 400;
    private lives: number = 3;
    private highscores: Array<Score>;

    // toggled when button is (un)pressed
    private leftPressed: boolean;
    private rightPressed: boolean;
    private upPressed: boolean;
    private downPressed: boolean;
    private rotLPressed: boolean;
    private rotRPressed: boolean;

    // keeps track of where the player is and in which direction they are looking
    private spaceShipLoc: Loc;
    private spaceShipRot: number;

    // keeps track of all the asteroids.... not the arrays in the array....
    private asteroidLocations: Loc[];
    private asteroidSizes: number[][];
    private asteroidDirections: number[];
    private asteroidSprite: string[];
    private asteroidSpeed: number[];

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
        this.spriteMapImage = new Image;
        this.spriteMapImage.addEventListener('load', () => {
            fetch('./assets/images/SpaceShooterRedux/Spritesheet/sheet.xml')
                .then((response) => {
                    return response.text()
                })
                .then((str) => {
                    let parser = new DOMParser();
                    this.spriteMapData = [];
                    //<SubTexture name="beam0.png" x="143" y="377" width="43" height="31"/>
                    Array.prototype.forEach.call(parser.parseFromString(str, "text/xml").getElementsByTagName("SubTexture"), (e: Element) => {
                        let atts = e.attributes;
                        this.spriteMapData.push({name: atts[0].nodeValue, x: parseInt(atts[1].nodeValue), y: parseInt(atts[2].nodeValue), width: parseInt(atts[3].nodeValue), height: parseInt(atts[4].nodeValue)});
                    });
                    //console.table(this.spriteMapData);
                }).then(() => {
                    this.start_screen();
                });
        });
        this.spriteMapImage.src = "./assets/images/SpaceShooterRedux/Spritesheet/sheet.png";
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
        this.addImage("meteorBrown_big1.png", this.canvas.width/2, 500);
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
            this.addImage("playerLife1_blue.png", 50 + i * 32, 30, 0, null, false);
        //2. draw current score
        this.writeText(`Score: ${this.score.toString()}`, this.canvas.width - 50, 50, 32, "right");
        //3. draw random asteroids
        this.drawRandomAsteroids();
        //4. draw player spaceship
        this.spaceShipLoc = {x: this.canvas.width/2, y: this.canvas.height - 200}
        this.spaceShipRot = 0;
        this.addImage("layerShip1_blue.png", this.canvas.width/2, this.canvas.height - 200);
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
     * @param {boolean} shouldCenter Whether the image should be put relative to it's center 
     * @returns {number, number} Size of image
     */
    private addImage(src: string,
        x: number,
        y: number,
        rot: number = 0,
        callback: Function = null,
        shouldCenter: boolean = true
    ): SpriteSheetTexture {
        let image = this.spriteMapData.filter(obj => {
            return obj.name === src
        })[0];
        if (!image) return null;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rot*Math.PI/180);
        if (shouldCenter)
            this.ctx.translate(-image.width/2, -image.height/2);
        this.ctx.drawImage(this.spriteMapImage, image.x, image.y, image.width, image.height, 0, 0, image.width, image.height);
        this.ctx.restore(); 
        return image;
    }

    /**
     * 
     * @param {string} src Source location of the image
     * @param {string} text Text to add on top of the button
     * @param {number} x X location of the button
     * @param {number} y Y location of the button
     * @param {string} eventType Wait for what event?
     * @param {Function} callback Run what function if the event is raised
     * @param {number} fontSize Fontsize of the text on the button
     * @param {boolean} shouldCenter should the button be centered on the location or should that be the top left corner?
     */
    private addButton(
        src: string,
        text: string,
        x: number,
        y: number,
        eventType: string,
        callback: Function,
        fontSize: number,
        shouldCenter: boolean = true,
        singleFire: boolean = true
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
            let _listener = (event: MouseEvent) => {
                if (
                    event.x > tl.x && event.x < br.x &&
                    event.y > tl.y && event.y < br.y
                ) {
                    if (singleFire)
                        this.canvas.removeEventListener(eventType, _listener);
                    callback();
                }
            };
            this.canvas.addEventListener(eventType, _listener);
        });
        image.src = src;
    }

    //---------Functions for drawing------------------------------------
    private drawRandomAsteroids() {
        // loop through all asteroids we want to draw, 5 of them
        for (let i = 0; i < 5; i++) {
            // define a callback to be run once the images are loaded in
            let callback = (imageDetails: ImageDetails) => {
                if (this.asteroidLocations == undefined) {
                    this.asteroidLocations = [({x: imageDetails.x, y: imageDetails.y})];
                    this.asteroidSprite = [(imageDetails.src)];
                    this.asteroidDirections = [(Math.random()*360-180)];
                    this.asteroidSpeed = [(Math.ceil(Math.random()*5))];
                    this.asteroidSizes = [([imageDetails.w, imageDetails.h])];
                } else {
                    this.asteroidLocations.push({x: imageDetails.x, y: imageDetails.y});
                    this.asteroidSprite.push(imageDetails.src);
                    this.asteroidDirections.push(Math.random()*360-180);
                    this.asteroidSpeed.push(Math.ceil(Math.random()*5));
                    this.asteroidSizes.push([imageDetails.w, imageDetails.h]);
                }
            }
            // generate the asteroid
            this.drawRandomAsteroid(callback);
        }
    }

    private drawRandomAsteroid(callback: Function) {
        // random location on the screen
        let x = this.randomNumber(0, this.canvas.width),
            y = this.randomNumber(0, this.canvas.height);
        // definition of all asteroids provided in assets
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

        // randomize asteroid
        let asteroidType: AsteroidImage = imageCount[this.randomNumber(0, imageCount.length-1)];
        let subImage: number = asteroidType.images[this.randomNumber(0, asteroidType.images.length-1)];
        let spriteSrc = `meteor${asteroidType.name}${subImage}.png`;
        // draw image, all the madness is inside this.addImage
        let image = this.addImage(spriteSrc, x, y, 0)
        // we just need to parameters of the drawing for the callback, so immidiately remove the asteroid, this.draw takes care of drawing
        this.ctx.clearRect(x-image.width/2, y-image.height/2, image.width, image.height);
        // finally... call the callback with the data we needed
        callback({src: spriteSrc, x: x, y: y, w: image.width, h: image.height});
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
        // define some constants
        let shipWidth = 104,
            shipHeight = 80,
            movementSpeed = 10,
            rotationSpeed = 5,
            oldLoc = this.spaceShipLoc;
        // use a circle-math to figure out the x and y components of the movement vector
        let x = movementSpeed*Math.sin(this.spaceShipRot*Math.PI/180),
            y = movementSpeed*Math.cos(this.spaceShipRot*Math.PI/180);

        // check all button presses and adjust location accordingly
        //if (this.leftPressed) this.spaceShipLoc = {x: this.spaceShipLoc.x - y, y: this.spaceShipLoc.y - x};
        //if (this.rightPressed) this.spaceShipLoc = {x: this.spaceShipLoc.x + y, y: this.spaceShipLoc.y + x};
        if (this.upPressed) this.spaceShipLoc = {x: this.spaceShipLoc.x + x, y: this.spaceShipLoc.y - y};
        if (this.downPressed) this.spaceShipLoc = {x: this.spaceShipLoc.x - x, y: this.spaceShipLoc.y + y};
        if (this.rightPressed) this.spaceShipRot+=rotationSpeed; //can be changed to this.rotRPressed
        if (this.leftPressed) this.spaceShipRot-=rotationSpeed;  //can be changed to this.rotLPressed

        // if we are out of bounds, stop moving
        if (this.spaceShipLoc.x - shipWidth/2  < 0)                  this.spaceShipLoc.x = 0 + shipWidth/2;
        if (this.spaceShipLoc.x + shipWidth/2  > this.canvas.width ) this.spaceShipLoc.x = this.canvas.width - shipWidth/2;
        if (this.spaceShipLoc.y - shipHeight/2 < 0)                  this.spaceShipLoc.y = 0 + shipHeight/2;
        if (this.spaceShipLoc.y + shipHeight/2 > this.canvas.height) this.spaceShipLoc.y = this.canvas.height - shipHeight/2;
        if (this.spaceShipRot < -180) this.spaceShipRot = 360 + this.spaceShipRot;
        if (this.spaceShipRot > 180) this.spaceShipRot = this.spaceShipRot - 360;

        // this is where the hell begins
        // save current state of the canvas, move the origin around, rotate according to angle, clear out the old ship, restore saved state
        this.ctx.save();
        this.ctx.translate(oldLoc.x, oldLoc.y);
        this.ctx.rotate(this.spaceShipRot*Math.PI/180);
        this.ctx.clearRect(-shipWidth/2, -shipHeight/2, shipWidth, shipHeight);
        this.ctx.restore();

        // draw new ship, luckely all the madness lies in the function this.addImage
        this.addImage("playerShip1_blue.png", this.spaceShipLoc.x, this.spaceShipLoc.y, this.spaceShipRot);

        // if there's no asteroids, stop here
        if (!this.asteroidSprite) return;
        // loop through all asteroids
        this.asteroidSprite.forEach((_, i) => {
            // move the origin to the desired center and rotate around, clear the old asteroid and undo all transformations
            this.ctx.translate(this.asteroidLocations[i].x, this.asteroidLocations[i].y);
            this.ctx.rotate(this.asteroidDirections[i]*Math.PI/180);
            this.ctx.clearRect(-this.asteroidSizes[i][0]/2-this.asteroidSpeed[i], -this.asteroidSizes[i][1]/2-this.asteroidSpeed[i], this.asteroidSizes[i][0]+this.asteroidSpeed[i]*2, this.asteroidSizes[i][1]+this.asteroidSpeed[i]*2);
            this.ctx.rotate(-this.asteroidDirections[i]*Math.PI/180);
            this.ctx.translate(-this.asteroidLocations[i].x, -this.asteroidLocations[i].y);
            // do the same circle-math as before on the movement vector of the asteroids
            let x = this.asteroidSpeed[i]*Math.sin(this.asteroidDirections[i]*Math.PI/180),
                y = this.asteroidSpeed[i]*Math.cos(this.asteroidDirections[i]*Math.PI/180);
            // move the asteroids
            this.asteroidLocations[i] = {x: this.asteroidLocations[i].x + x, y: this.asteroidLocations[i].y - y};
            let location = this.asteroidLocations[i],
                size = this.asteroidSizes[i];
            if (location.x + size[0]/2 < 0)                  location.x += this.canvas.width  + size[0];
            if (location.x - size[0]/2 > this.canvas.width)  location.x -= this.canvas.width  + size[0];
            if (location.y + size[1]/2 < 0)                  location.y += this.canvas.height + size[1];
            if (location.y - size[1]/2 > this.canvas.height) location.y -= this.canvas.height + size[1];
            // draw the new asteroids, the madness lies inside this.addImage again
            this.addImage(this.asteroidSprite[i], this.asteroidLocations[i].x, this.asteroidLocations[i].y, this.asteroidDirections[i]);
        });
    }
}

//this will get an HTML element. I cast this element in de appropriate type using <>
let Asteroids: Game;
let init = function () {
    Asteroids = new Game(<HTMLCanvasElement>document.getElementById('canvas'));
};
//add loadlistener for custom font types
window.addEventListener('load', init);
