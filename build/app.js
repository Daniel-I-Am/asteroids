class Ship {
    constructor() {
        this.distanceTraveled = 10000;
    }
    shoot() {
        console.log("I'm shsooting");
    }
    move() {
        this.distanceTraveled++;
        console.log(this.distanceTraveled);
    }
}
let spaceShip = new Ship();
spaceShip.name = "Nebuchadnezzar";
spaceShip.color = "Gray";
spaceShip.cannons = 5;
spaceShip.move();
spaceShip.move();
//# sourceMappingURL=app.js.map