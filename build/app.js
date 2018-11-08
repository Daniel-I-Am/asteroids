class Ship {
    setName(name) {
        this.name = name;
    }
    setCannons(amount) {
        this.cannons = amount;
    }
    shoot() {
        console.log("I'm shooting");
    }
    move() {
        this.distanceTraveled++;
        console.log(this.distanceTraveled);
    }
}
let spaceShip = new Ship();
spaceShip.color = "Gray";
spaceShip.move();
spaceShip.move();
//# sourceMappingURL=app.js.map