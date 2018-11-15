class Game {
    constructor(canvasId) {
        this.player = "Player1";
        this.score = 400;
        this.lives = 3;
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
    }
    start_screen() {
        let buttonOffset = 100;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.centerText("Asteroids", 200, 192);
        this.centerText("Press start to play", 400, 48);
        this.addButton("./assets/images/SpaceShooterRedux/PNG/UI/buttonBlue.png", "Start!", this.canvas.width / 2, this.canvas.height - buttonOffset, "click", () => {
            this.level_screen();
            console.log("adding listeners");
            window.addEventListener("keydown", (e) => this.keyDownHandler(e));
            window.addEventListener("keyup", (e) => this.keyUpHandler(e));
            window.setInterval(() => this.draw(), 1000 / 30);
        }, 24, true);
        this.addImage("./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_big1.png", this.canvas.width / 2, this.canvas.height / 2);
    }
    level_screen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.lives; i++)
            this.addImage("./assets/images/SpaceShooterRedux/PNG/UI/playerLife1_blue.png", 50 + i * 32, 30, null, false);
        this.writeText(`Score: ${this.score.toString()}`, this.canvas.width - 50, 50, 32, "right");
        for (let i = this.randomNumber(10, 20); i > 0; i--)
            this.drawRandomAsteroid();
        this.spaceShipLoc = { x: this.canvas.width / 2, y: this.canvas.height - 200 };
        this.addImage("./assets/images/SpaceShooterRedux/PNG/playerShip1_blue.png", this.canvas.width / 2, this.canvas.height - 200);
    }
    title_screen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.centerText(`You died with ${this.score} points`, 100, 96);
        this.drawHighScores();
    }
    randomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    writeText(text, x, y, fontSize, align = "left", fontFamily = "Minecraft", color = "#ffffff") {
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontSize}px ${fontFamily}`;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }
    centerText(text, y, fontSize, fontFamily = "Minecraft", color = "#ffffff") {
        this.writeText(text, this.canvas.width / 2, y, fontSize, "center", fontFamily, color);
    }
    addImage(src, x, y, callback = null, shouldCenter = true) {
        let image = new Image;
        image.addEventListener('load', () => {
            if (shouldCenter) {
                this.ctx.drawImage(image, x - image.width / 2, y - image.height / 2);
            }
            else {
                this.ctx.drawImage(image, x, y);
            }
            if (callback)
                callback(this);
        });
        image.src = src;
    }
    addButton(src, text, x, y, eventType, callback, fontSize, shouldCenter = true) {
        let image = new Image;
        image.addEventListener('load', () => {
            let tl, br;
            if (shouldCenter) {
                this.ctx.drawImage(image, x - image.width / 2, y - image.height / 2);
                this.writeText(text, x, y + fontSize / 3, fontSize, "center", "Minecraft", "black");
                tl = { x: x - image.width / 2, y: y - image.height / 2 };
                br = { x: x + image.width / 2, y: y + image.height / 2 };
            }
            else {
                this.ctx.drawImage(image, x, y);
                tl = { x: x, y: y };
                br = { x: x + image.width, y: y + image.width };
                this.writeText(text, x + image.width / 2, y + image.height / 2, fontSize, "center", "Minecraft", "black");
            }
            if (!callback)
                return;
            this.canvas.addEventListener(eventType, (event) => {
                if (event.x > tl.x && event.x < br.x &&
                    event.y > tl.y && event.y < br.y) {
                    callback();
                }
            });
        });
        image.src = src;
    }
    drawRandomAsteroid() {
        let x = this.randomNumber(0, this.canvas.width), y = this.randomNumber(0, this.canvas.height), image = new Image;
        let imageCount = [
            { name: "Brown_big", images: [1, 2, 3, 4] },
            { name: "Brown_med", images: [1, 3] },
            { name: "Brown_small", images: [1, 2] },
            { name: "Brown_tiny", images: [1, 2] },
            { name: "Grey_big", images: [1, 2, 3, 4] },
            { name: "Grey_med", images: [1, 2] },
            { name: "Grey_small", images: [1, 2] },
            { name: "Grey_tiny", images: [1, 2] }
        ];
        let asteroidType = imageCount[this.randomNumber(0, imageCount.length - 1)];
        let subImage = asteroidType.images[this.randomNumber(0, asteroidType.images.length - 1)];
        this.addImage(`./assets/images/SpaceShooterRedux/PNG/Meteors/meteor${asteroidType.name}${subImage}.png`, x, y);
    }
    drawHighScores() {
        this.centerText("Highscores", 250, 64);
        for (let i = 0; i < this.highscores.length; i++) {
            const elem = this.highscores[i];
            this.centerText(`${elem.playerName} - ${elem.score} points`, 300 + i * 50, 48);
        }
    }
    keyDownHandler(event) {
        switch (event.keyCode) {
            case 37:
            case 65:
                this.leftPressed = true;
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
        }
    }
    keyUpHandler(event) {
        switch (event.keyCode) {
            case 37:
            case 65:
                this.leftPressed = false;
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
        }
    }
    draw() {
        this.ctx.clearRect(this.spaceShipLoc.x - 64, this.spaceShipLoc.y - 64, 128, 128);
        if (this.leftPressed)
            this.spaceShipLoc.x -= 2;
        if (this.rightPressed)
            this.spaceShipLoc.x += 2;
        if (this.upPressed)
            this.spaceShipLoc.y -= 2;
        if (this.downPressed)
            this.spaceShipLoc.y += 2;
        this.spaceShipLoc.x = Math.min(this.canvas.width, Math.max(0, this.spaceShipLoc.x));
        this.spaceShipLoc.x = Math.min(this.canvas.height, Math.max(0, this.spaceShipLoc.y));
        this.addImage("./assets/images/SpaceShooterRedux/PNG/playerShip1_blue.png", this.spaceShipLoc.x, this.spaceShipLoc.y, null, true);
    }
}
let init = function () {
    const Asteroids = new Game(document.getElementById('canvas'));
    Asteroids.start_screen();
};
window.addEventListener('load', init);
//# sourceMappingURL=app.js.map