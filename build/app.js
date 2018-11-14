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
        this.start_screen();
    }
    start_screen() {
        let buttonOffset = 100;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.writeAsteroidHeading();
        this.writeIntroText();
        this.writeStartButton(buttonOffset);
        this.drawMenuAsteroid();
    }
    level_screen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawPlayerLives();
        this.drawYourScore();
        this.drawRandomAsteroids(10, 20);
        this.drawPlayerShip();
    }
    title_screen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawFinalScore();
        this.drawHighScores();
    }
    randomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    writeText(text, x, y, fontSize, align = "left", fontFace = "Minecraft", color = "#ffffff") {
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontSize}px ${fontFace}`;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }
    centerText(text, y, fontSize, fontFace = "Minecraft", color = "#ffffff") {
        this.writeText(text, this.canvas.width / 2, y, fontSize, "center", fontFace, color);
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
                callback();
        });
        image.src = src;
    }
    writeAsteroidHeading() {
        this.centerText("Asteroids", 200, 192);
    }
    writeIntroText() {
        this.centerText("Press start to play", 400, 48);
    }
    writeStartButton(buttonOffset) {
        this.addImage("./assets/images/SpaceShooterRedux/PNG/UI/buttonBlue.png", this.canvas.width / 2, this.canvas.height - buttonOffset, () => {
            this.centerText("Start!", this.canvas.height - buttonOffset + 8, 24, "Minecraft", "#000000");
        });
    }
    drawMenuAsteroid() {
        this.addImage("./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_big1.png", this.canvas.width / 2, this.canvas.height / 2);
    }
    drawPlayerLives() {
        for (let i = 0; i < this.lives; i++)
            this.addImage("./assets/images/SpaceShooterRedux/PNG/UI/playerLife1_blue.png", 50 + i * 64, 30, null, false);
    }
    drawYourScore() {
        let text = "Score: " + this.score.toString();
        this.ctx.font = "32px Minecraft";
        this.ctx.fillStyle = "#ffffff";
        this.ctx.textAlign = "right";
        this.ctx.fillText(text, this.canvas.width - 50, 50);
    }
    drawRandomAsteroids(min, max) {
        for (let i = this.randomNumber(min, max); i > 0; i--) {
            this.drawRandomAsteroid();
        }
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
        image.addEventListener('load', () => {
            this.ctx.drawImage(image, x, y);
        });
        let asteroidType = imageCount[this.randomNumber(0, imageCount.length - 1)];
        let subImage = asteroidType.images[this.randomNumber(0, asteroidType.images.length - 1)];
        image.src = `./assets/images/SpaceShooterRedux/PNG/Meteors/meteor${asteroidType.name}${subImage}.png`;
    }
    drawPlayerShip() {
        let image = new Image;
        image.addEventListener('load', () => {
            this.ctx.drawImage(image, (this.canvas.width - image.width) / 2, this.canvas.height - 200);
        });
        image.src = "./assets/images/SpaceShooterRedux/PNG/playerShip1_blue.png";
    }
    drawFinalScore() {
        this.centerText(`You died with ${this.score} points`, 100, 96);
    }
    drawHighScores() {
        for (let i = 0; i < this.highscores.length; i++) {
            const elem = this.highscores[i];
            this.centerText(`${elem.playerName} - ${elem.score} points`, 250 + i * 50, 48);
        }
    }
}
let Asteroids;
let init = function () {
    Asteroids = new Game(document.getElementById('canvas'));
};
window.addEventListener('load', init);
//# sourceMappingURL=app.js.map