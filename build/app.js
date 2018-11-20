class Game {
    constructor(canvasId) {
        this.player = "Player1";
        this.score = 400;
        this.lives = 3;
        this.shipXOffset = 50;
        this.shipYOffset = 37;
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
        ];
        this.start_screen();
    }
    start_screen() {
        const center = this.canvasHelper.GetCenter();
        this.canvasHelper.writeTextToCanvas("Asteroids", 140, center.X, 150);
        this.canvasHelper.writeTextToCanvas("PRESS PLAY TO START", 40, center.X, center.Y - 100);
        this.canvasHelper.writeButtonToCanvas("Play!", center.X, center.Y + 200, "./assets/images/SpaceShooterRedux/PNG/UI/buttonBlue.png", 20, console.log);
        this.canvasHelper.writeImageToCanvas("./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_big1.png", center.X, center.Y);
    }
    level_screen() {
        const lifeImagePath = "./assets/images/SpaceShooterRedux/PNG/UI/playerLife1_blue.png";
        for (let i = 0; i < this.lives; i++)
            this.canvasHelper.writeImageToCanvas(lifeImagePath, 20 + 32 * i, 20, 0);
        this.canvasHelper.writeTextToCanvas(`Score: ${this.score}`, 20, this.canvasHelper.GetWidth() - 150, 65, undefined, undefined, "right");
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
            const index = MathHelper.randomNumber(0, asteroids.length);
            this.canvasHelper.writeImageToCanvas(asteroids[index], MathHelper.randomNumber(0, this.canvasHelper.GetWidth()), MathHelper.randomNumber(0, this.canvasHelper.GetHeight()));
        }
    }
    title_screen() {
        const center = this.canvasHelper.GetCenter();
        this.canvasHelper.writeTextToCanvas(`${this.player} score is ${this.score}`, 80, center.X, center.Y - 100);
        this.canvasHelper.writeTextToCanvas("HIGHSCORES", 40, center.X, center.Y);
        this.highscores.forEach((element, index) => {
            center.Y += 40;
            this.canvasHelper.writeTextToCanvas(`${index + 1}: ${element.playerName} - ${element.score}`, 20, center.X, center.Y);
        });
    }
    draw() {
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
        this.canvasHelper.writeImageToCanvas("./assets/images/SpaceShooterRedux/PNG/playerShip1_blue.png", this.canvasHelper.GetWidth() / 2 + this.shipXOffset, this.canvasHelper.GetWidth() / 2 + this.shipYOffset);
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
    constructor(aCanvas, aWidth = -1, aHeight = -1) {
        this.canvas = aCanvas;
        this.ctx = aCanvas.getContext('2d');
        this.canvas.width = (aWidth < 0 ? window.innerWidth : aWidth);
        this.canvas.height = (aHeight < 0 ? window.innerHeight : aHeight);
    }
    RegisterOnClick(aCallBack) {
        this.canvas.addEventListener('click', (aEvent) => {
            aCallBack(aEvent.x, aEvent.y);
        });
    }
    Clear() {
        this.ctx.clearRect(0, 0, this.GetWidth(), this.GetHeight());
    }
    GetCenter() {
        return { X: this.GetWidth() / 2, Y: this.GetHeight() / 2 };
    }
    GetWidth() {
        return this.canvas.width;
    }
    GetHeight() {
        return this.canvas.height;
    }
    getCanvas() {
        return this.canvas;
    }
    writeTextToCanvas(text, fontSize, aXpos, aYpos, color = "white", aTextBaseLine = "bottom", fontFamily = "Minecraft", alignment = "center") {
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontSize}px ${fontFamily}`;
        this.ctx.textAlign = alignment;
        this.ctx.textBaseline = aTextBaseLine;
        this.ctx.fillText(text, aXpos, aYpos);
    }
    writeImageToCanvas(aSrc, aXpos, aYpos, rot = 0) {
        let element = new Image();
        element.addEventListener("load", () => {
            this.ctx.drawImage(element, aXpos - element.width / 2, aYpos - element.height / 2);
        });
        element.src = aSrc;
    }
    writeButtonToCanvas(aCaption, aXpos, aYpos, aSrc = "./assets/images/SpaceShooterRedux/PNG/UI/buttonBlue.png", aFontSize = 20, callback = null) {
        let buttonElement = new Image();
        buttonElement.addEventListener("load", () => {
            this.ctx.drawImage(buttonElement, aXpos - buttonElement.width / 2, aYpos - buttonElement.height / 2);
            this.writeTextToCanvas(aCaption, aFontSize, aXpos, aYpos, "black", "middle");
        });
        buttonElement.src = aSrc;
        if (!callback)
            return;
        this.canvas.addEventListener("click", (event) => {
            if (event.x > aXpos - buttonElement.width / 2 && event.x < aXpos + buttonElement.width / 2 + 111) {
                if (event.y > aYpos - buttonElement.height / 2 && event.y < aYpos + buttonElement.height / 2) {
                    callback(event);
                }
            }
        });
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
                    this.d_changeViewCallback(new GameView(this.d_canvasHelper.getCanvas(), this.d_changeViewCallback));
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