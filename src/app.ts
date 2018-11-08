const mapSize = [800, 600];

class Ship {
    private name: string;
    public color: string;
    private cannons: number;
    private distanceTraveled: number;

    public constructor(
        name: string, 
        color: string, 
        cannons: number,
    ) {
        this.name = name;
        this.cannons = cannons;
        this.distanceTraveled = 0;
    }

    private addDistanceTraveled() {
        this.distanceTraveled++;
    }

    private setCannons(amount: number) {
        this.cannons = amount;
    }

    public shoot() {
        console.log("I'm shooting");
    }

    public move() {
        this.addDistanceTraveled();
        console.log(this.distanceTraveled);
    }
}

class Asteroid {
    private size: number;
    private location: number[];
    private velocity: number[];
    private rotation: number;
    private rotationVeloicty: number;

    public constructor(
        size: number,
        location: number[],
        velocity: number[],
        rotation: number,
        rotationVelocity: number,    
    ) {
        this.size = size;
        this.location = location;
        this.velocity = velocity;
        this.rotation = rotation;
        this.rotationVeloicty = rotationVelocity;
    }

    public move() {
        // add velocity to location
        this.location.map((e, i) => e + this.velocity[i]);
        // if location is outside of map, wrap
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

let spaceShip: Ship = new Ship("Nebuchadnezzar", "Gray", 35);

spaceShip.move();
spaceShip.move();