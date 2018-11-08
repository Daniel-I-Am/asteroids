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

let spaceShip: Ship = new Ship("Nebuchadnezzar", "Gray", 35, 0);

spaceShip.move();
spaceShip.move();