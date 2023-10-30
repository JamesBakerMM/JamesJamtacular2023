class Data {
    constructor() { 
        this.factory = new ObjectFactory();
        this.metals=0; // move to player later
        this.ships;  //will be group in setup
        this.resources; //will be group in setup

        this.managerShip = new ManagerShip();
    }

    preload() {
        this.factory.preload();
    }

    /*
    * This is called at the start of the game to build the level
    */
    setup() {
        this.ships = new Group();
        this.resources = new Group();
        for (let i = 0; i < 20; i++) {
            let x = Math.random() * 1600;
            let y = Math.random() * 900;
            this.resources.push(this.factory.createResource(x, y, 100));
        }

        this.ships.push(this.factory.createRefinery(800, 450));
        this.ships.push(this.factory.createDrone(900, 450));
        this.ships.push(this.factory.createDrone(700, 450));
    }

    /*
    * This is called each frame to update all our objects
    */
    update(timepassed) {
        this.managerShip.update(timepassed, this);
    }

    getClosestResource(x, y) {
        let index = -1;
        let distance = 0;
        for (let i = 0; i < this.resources.length; i++) {
            let res = this.resources[i];
            let distToResource = dist(x, y, res.x, res.y);
            if (distToResource < distance || index < 0) {
                index = i;
                distance = distToResource;
            }
        }
        return this.resources[index];

    }
}


