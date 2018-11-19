class Game {
    constructor(canvasId) {
        this.player = "Player1";
        this.score = 400;
        this.lives = 3;
        this.shipXOffset = 50;
        this.shipYOffset = 37;
        this.canvas = canvasId;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
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
        ];
        this.start_screen();
    }
    start_screen() {
        const horizontalCenter = this.canvas.width / 2;
        const verticalCenter = this.canvas.height / 2;
        this.writeTextToCanvas("Asteroids", 140, horizontalCenter, 150);
        this.writeTextToCanvas("PRESS PLAY TO START", 40, horizontalCenter, verticalCenter - 20);
        this.writeButtonToCanvas();
        this.writeImageToCanvas("./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_big1.png", horizontalCenter - 50, verticalCenter + 40);
    }
    level_screen() {
        const lifeImagePath = "./assets/images/SpaceShooterRedux/PNG/UI/playerLife1_blue.png";
        this.writeImageToCanvas(lifeImagePath, 70, 50, 40, undefined, this.lives);
        this.writeTextToCanvas(`Score: ${this.score}`, 20, this.canvas.width - 150, 65, undefined, "right");
        const asteroids = [
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
        const maxAsteroidsOnScreen = 5;
        for (let i = 0; i < maxAsteroidsOnScreen; i++) {
            const index = this.randomNumber(0, asteroids.length);
            this.writeImageToCanvas(asteroids[index], this.randomNumber(0, this.canvas.width), this.randomNumber(0, this.canvas.height));
        }
    }
    title_screen() {
        const horizontalCenter = this.canvas.width / 2;
        let verticalCenter = this.canvas.height / 2;
        this.writeTextToCanvas(`${this.player} score is ${this.score}`, 80, horizontalCenter, verticalCenter - 100);
        this.writeTextToCanvas("HIGHSCORES", 40, horizontalCenter, verticalCenter);
        this.highscores.forEach((element, index) => {
            verticalCenter += 40;
            this.writeTextToCanvas(`${index + 1}: ${element.playerName} - ${element.score}`, 20, horizontalCenter, verticalCenter);
        });
    }
    randomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    writeTextToCanvas(text, fontSize, xCoordinate, yCoordinate, color = "white", alignment = "center") {
        this.ctx.font = `${fontSize}px Minecraft`;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = alignment;
        this.ctx.fillText(text, xCoordinate, yCoordinate);
    }
    writeImageToCanvas(src, xCoordinate, yCoordinate, deltaX = 0, deltaY = 0, loops = 1) {
        let element = document.createElement("img");
        element.src = src;
        for (let i = 0; i < loops; i++) {
            element.addEventListener("load", () => {
                xCoordinate += deltaX;
                yCoordinate += deltaY;
                this.ctx.drawImage(element, xCoordinate, yCoordinate);
            });
        }
    }
    writeButtonToCanvas() {
        const horizontalCenter = this.canvas.width / 2;
        const verticalCenter = this.canvas.height / 2;
        let buttonElement = document.createElement("img");
        buttonElement.src = "./assets/images/SpaceShooterRedux/PNG/UI/buttonBlue.png";
        buttonElement.addEventListener("load", () => {
            this.ctx.drawImage(buttonElement, horizontalCenter - 111, verticalCenter + 219);
            this.writeTextToCanvas("Play", 20, horizontalCenter, verticalCenter + 245, "black");
        });
        this.canvas.addEventListener("click", (event) => {
            const horizontalCenter = this.canvas.width / 2 + this.canvas.offsetLeft;
            const verticalCenter = this.canvas.height / 2 + this.canvas.offsetTop;
            if (event.x > horizontalCenter - 111 && event.x < horizontalCenter + 111) {
                if (event.y > verticalCenter + 219 && event.y < verticalCenter + 259) {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.level_screen();
                    window.addEventListener("keydown", (event) => this.keyDownHandler(event));
                    window.addEventListener("keyup", (event) => this.keyUpHandler(event));
                    window.setInterval(() => this.draw(), 1000 / 30);
                }
            }
        });
    }
    draw() {
        this.ctx.clearRect(this.shipXOffset, this.shipYOffset, this.canvas.width, this.canvas.height);
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
        this.writeImageToCanvas("./assets/images/SpaceShooterRedux/PNG/playerShip1_blue.png", this.canvas.width / 2 + this.shipXOffset, this.canvas.height / 2 + this.shipYOffset);
    }
    keyDownHandler(event) {
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
    keyUpHandler(event) {
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
let init = function () {
    const Asteroids = new Game(document.getElementById('canvas'));
};
window.addEventListener('load', init);
class CanvasHelper {
    constructor(aCanvas) {
        ;
    }
    RegisterOnClick(aCallBack) {
        this.canvas.addEventListener('click', (aEvent) => {
            aCallBack(aEvent.x, aEvent.y);
        });
    }
    Clear() {
    }
    GetCenter() {
        return { X: this.GetWidth(), Y: this.GetHeight() };
    }
    GetHeight() {
        return this.canvas.height;
    }
    GetWidth() {
        return this.canvas.width;
    }
    writeTextToCanvas(text, fontSize, aXpos, aYpos, color = "white", alignment = "center") {
    }
    writeImageToCanvas(aSrc, aXpos, aYpos) {
    }
    writeButtonToCanvas(aCaption, aXpos = -1, aYpos = -1) {
    }
}
class ViewBase {
    constructor(aCanvas, aChangeViewCallback) {
        this.d_alive = true;
        this.OnClick = (aXaxis, aYaxis) => {
            if (!this.d_alive)
                return;
        };
    }
    Render() {
    }
    BeforeExit() {
        this.d_alive = false;
    }
}
class MathHelper {
    static randomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}
class MenuView extends ViewBase {
    constructor(aCanvas, aChangeViewCallback) {
        super(aCanvas, aChangeViewCallback);
        this.HandleClick = (aXpos, aYpos) => {
            let centerCoordinate = this.d_canvasHelper.GetCenter();
            if (aXpos > centerCoordinate.X - 111 && aXpos < centerCoordinate.X + 111) {
                if (aYpos > centerCoordinate.Y + 219 && aYpos < centerCoordinate.Y + 259) {
                    this.d_changeViewCallback(new GameView(this.d_canvasHelper.canvas, this.d_changeViewCallback));
                }
            }
        };
    }
    RenderScreen() {
    }
}
class GameView extends ViewBase {
    constructor() {
        super(...arguments);
        this.player = "Player1";
        this.score = 400;
        this.lives = 3;
        this.HandleClick = () => { };
    }
    RenderScreen() { }
}
//# sourceMappingURL=app.js.map