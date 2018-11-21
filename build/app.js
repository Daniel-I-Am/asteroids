class CanvasHelper {
    constructor(aCanvas) {
        this.d_clickCommands = new Map();
        this.d_canvas = aCanvas;
        this.d_context = this.d_canvas.getContext('2d');
        document.addEventListener('click', (event) => {
            this.OnClick(event);
        });
    }
    static Instance(aCanvas = null) {
        if (this.instance == null) {
            if (aCanvas == null) {
                throw new DOMException("The first time the instance is created a Canvas must be given.");
            }
            this.instance = new CanvasHelper(aCanvas);
        }
        return this.instance;
    }
    OnClick(Event) {
        let X = Event.x;
        let Y = Event.y;
        this.d_clickCommands.forEach((value, key) => {
            value.ExecuteIfInArea(X, Y);
        });
    }
    Clear() {
        this.d_context.clearRect(0, 0, this.GetWidth(), this.GetHeight());
    }
    GetCanvas() {
        return this.d_canvas;
    }
    GetCenter() {
        return { X: this.GetWidth() / 2, Y: this.GetHeight() / 2 };
    }
    GetHeight() {
        return this.d_canvas.height;
    }
    GetWidth() {
        return this.d_canvas.width;
    }
    UnregisterClickListener(fnName) {
        this.d_clickCommands.delete(fnName);
    }
    writeTextToCanvas(aText, aFontSize, aXpos, aYpos, aColor = "white", aAlignment = "center") {
        this.d_context.font = `${aFontSize}px Minecraft`;
        this.d_context.fillStyle = aColor;
        this.d_context.textAlign = aAlignment;
        this.d_context.fillText(aText, aXpos, aYpos);
    }
    writeImageToCanvas(aSrc, aXpos, aYpos) {
        let image = new Image();
        image.addEventListener('load', () => {
            this.d_context.drawImage(image, aXpos, aYpos);
        });
        image.src = aSrc;
    }
    writeButtonToCanvas(aCaption, fnName, fn, aXpos = -1, aYpos = -1) {
        let buttonImage = new Image();
        buttonImage.src = "./assets/images/SpaceShooterRedux/PNG/UI/buttonBlue.png";
        buttonImage.addEventListener('load', () => {
            let dx = aXpos;
            let dy = aYpos;
            if (dx < 0)
                dx = (this.GetWidth() - buttonImage.width) / 2;
            if (dy < 0)
                dy = this.GetHeight() / 2 + buttonImage.height;
            let fontX = dx + ((buttonImage.width + aCaption.length - 18) / 2);
            let fontY = dy + (buttonImage.height - 12);
            this.d_context.drawImage(buttonImage, dx, dy);
            this.writeTextToCanvas(aCaption, 20, fontX, fontY, '#000');
            if (fn != null) {
                this.d_clickCommands.set(fnName, new ButtonAction(dx, dy, buttonImage.height, buttonImage.width, fn));
            }
        });
    }
}
CanvasHelper.instance = null;
class ViewBase {
    constructor(aCanvas, aChangeViewCallback) {
        this.d_canvasHelper = CanvasHelper.Instance(aCanvas);
        this.d_changeViewCallback = aChangeViewCallback;
    }
    Render() {
        this.d_canvasHelper.Clear();
        this.RenderScreen();
    }
    BeforeExit() {
        this.Cleanup();
    }
}
class Game {
    constructor(canvasId) {
        this.player = "Player1";
        this.score = 400;
        this.lives = 3;
        this.shipXOffset = 50;
        this.shipYOffset = 37;
        this.ChangeView = (aNewView) => {
            this.d_currentView.BeforeExit();
            this.d_currentView = aNewView;
            this.d_currentView.Render();
        };
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
        this.d_currentView = new MenuView(canvasId, this.ChangeView);
        this.d_currentView.Render();
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
class ButtonAction {
    constructor(x, y, h, w, fn) {
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.fn = fn;
    }
    ExecuteIfInArea(x, y) {
        if (x > this.x && x < this.x + this.w &&
            y > this.y && y < this.y + this.h) {
            this.fn();
        }
    }
}
class KeyboardHelper {
    constructor() {
        this.keyPressCallback = new Map();
        this.keyUpCallback = new Map();
        this.keyDownCallback = new Map();
        this.keyboardDown = (event) => {
            if (this.keyDownCallback.has(event.key)) {
                event.preventDefault();
                let callback = this.keyDownCallback.get(event.key);
                if (callback != null) {
                    callback();
                }
            }
        };
        this.keyboardUp = (event) => {
            if (this.keyUpCallback.has(event.key)) {
                event.preventDefault();
                let callback = this.keyUpCallback.get(event.key);
                if (callback != null) {
                    callback();
                }
            }
            if (this.keyPressCallback.has(event.key)) {
                event.preventDefault();
                let callback = this.keyPressCallback.get(event.key);
                if (callback != null) {
                    callback();
                }
            }
        };
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
    }
    static Instance() {
        if (this.instance == null) {
            this.instance = new KeyboardHelper();
        }
        return this.instance;
    }
    addKeyPressCallback(key, fn) {
        this.keyPressCallback.set(key, fn);
    }
    addKeyUpCallback(key, fn) {
        this.keyUpCallback.set(key, fn);
    }
    addKeyDownCallback(key, fn) {
        this.keyDownCallback.set(key, fn);
    }
    clearKeyCallbacks(key) {
        this.keyPressCallback.set(key, null);
        this.keyUpCallback.set(key, null);
        this.keyDownCallback.set(key, null);
    }
}
KeyboardHelper.instance = null;
class MathHelper {
    static randomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}
class MenuView extends ViewBase {
    constructor(aCanvas, aChangeViewCallback) {
        super(aCanvas, aChangeViewCallback);
        this.StartGame = () => {
            const center = this.d_canvasHelper.GetCenter();
            this.d_changeViewCallback(new GameView(this.d_canvasHelper.GetCanvas(), this.d_changeViewCallback));
        };
    }
    RenderScreen() {
        const centerCoordinate = this.d_canvasHelper.GetCenter();
        this.d_canvasHelper.writeTextToCanvas("Asteroids", 140, centerCoordinate.X, 150);
        this.d_canvasHelper.writeTextToCanvas("PRESS PLAY TO START", 40, centerCoordinate.X, centerCoordinate.Y - 20);
        this.d_canvasHelper.writeButtonToCanvas("Play", 'StartGameCommand', this.StartGame, undefined, centerCoordinate.Y + 200);
        this.d_canvasHelper.writeImageToCanvas("./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_big1.png", centerCoordinate.X - 50, centerCoordinate.Y + 40);
    }
    Cleanup() {
        this.d_canvasHelper.UnregisterClickListener('StartGameCommand');
    }
}
class GameView extends ViewBase {
    constructor(aCanvas, aChangeViewCallback) {
        super(aCanvas, aChangeViewCallback);
        this.player = "Player1";
        this.score = 400;
        this.lives = 3;
    }
    RenderScreen() {
        const lifeImagePath = "./assets/images/SpaceShooterRedux/PNG/UI/playerLife1_blue.png";
        this.d_canvasHelper.writeImageToCanvas(lifeImagePath, 70, 50);
        this.d_canvasHelper.writeImageToCanvas(lifeImagePath, 110, 50);
        this.d_canvasHelper.writeImageToCanvas(lifeImagePath, 150, 50);
        this.d_canvasHelper.writeTextToCanvas(`Score: ${this.score}`, 20, this.d_canvasHelper.GetWidth() - 150, 65, undefined, "right");
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
            this.d_canvasHelper.writeImageToCanvas(asteroids[index], MathHelper.randomNumber(0, this.d_canvasHelper.GetWidth()), MathHelper.randomNumber(0, this.d_canvasHelper.GetHeight()));
        }
    }
    Cleanup() {
    }
}
//# sourceMappingURL=app.js.map