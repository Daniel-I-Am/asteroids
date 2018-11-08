class Ship {
    private name: string;
    public color: string;
    private cannons: number;
    private distanceTraveled: number;

    public setNames(name: string) {
        this.name = name;
    } 

    public setCannons(amount: number) {
        this.cannons = amount;
    }

    public shoot() {
        console.log("I'm shooting");
    }

    public move() {
        this.distanceTraveled++;
        console.log(this.distanceTraveled);
    }
}

let spaceShip: Ship = new Ship();
spaceShip.color = "Gray";

spaceShip.move();
spaceShip.move();