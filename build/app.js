class Ship {
    constructor(name, color, cannons, distanceTraveled) {
        this.name = name;
        this.cannons = cannons;
        this.distanceTraveled = distanceTraveled;
    }
    shoot() {
        console.log("I'm shooting");
    }
    move() {
        this.distanceTraveled++;
        console.log(this.distanceTraveled);
    }
}
let spaceShip = new Ship("Nebuchadnezzar", "Gray", 35, 0);
spaceShip.move();
spaceShip.move();
//# sourceMappingURL=app.js.map