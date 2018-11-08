const mapSize = [800, 600];
class Ship {
    constructor(name, color, cannons) {
        this.name = name;
        this.cannons = cannons;
        this.distanceTraveled = 0;
    }
    addDistanceTraveled() {
        this.distanceTraveled++;
    }
    setCannons(amount) {
        this.cannons = amount;
    }
    shoot() {
        console.log("I'm shooting");
    }
    move() {
        this.addDistanceTraveled();
        console.log(this.distanceTraveled);
    }
}
class Asteroid {
    constructor(size, location, velocity, rotation, rotationVelocity) {
        this.size = size;
        this.location = location;
        this.velocity = velocity;
        this.rotation = rotation;
        this.rotationVeloicty = rotationVelocity;
    }
    move() {
        this.location.map((e, i) => e + this.velocity[i]);
        this.location.map((e, i) => {
            if (e < 0)
                return mapSize[i];
            if (e > mapSize[i])
                return 0;
            return e;
        });
        this.rotation += this.rotationVeloicty;
    }
}
let spaceShip = new Ship("Nebuchadnezzar", "Gray", 35);
spaceShip.move();
spaceShip.move();
//# sourceMappingURL=app.js.map