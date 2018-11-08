class Ship {
    name: string;
    color: string;
    cannons: number;
    private distanceTraveled: number = 10000;

    shoot() {
        console.log("I'm shsooting");
    }
    move() {
        this.distanceTraveled++;
        console.log(this.distanceTraveled);
    }
}

let spaceShip: Ship = new Ship();
spaceShip.name = "Nebuchadnezzar";
spaceShip.color = "Gray";
spaceShip.cannons = 5;

spaceShip.move()
spaceShip.move()