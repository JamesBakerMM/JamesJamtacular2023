class Data {
    constructor() { 
        this.factory = new ObjectFactory();
        this.metals=0; // move to player later
        this.ships;  //will be group in setup
        this.drones;
        this.laser;
        this.gun;
        this.torpedo;
        this.refinery = null;
        this.resources; //will be group in setup
        this.background = new Background();

        this.managerShip = new ManagerShip();
    }

    preload() {
        this.factory.preload();
        this.background.preload();
    }

    /*
    * This is called at the start of the game to build the level
    */
    setup() {
        this.ships = new Group();
        this.drones = new this.ships.Group();
        this.laser = new this.ships.Group();
        this.gun = new this.ships.Group();
        this.torpedo = new this.ships.Group();

        this.resources = new Group();
        for (let i = 0; i < 10; i++) {
            let x = Math.random() * 1600;
            let y = Math.random() * 900;
            this.resources.push(this.factory.createResource(x, y, 4));
        }

        this.refinery = this.factory.createRefinery(800, 450)
        this.refinery.mass = 300;
        this.refinery.overlaps(this.ships);
        this.ships.push(this.refinery);
        this.drones.push(this.factory.createDrone(900, 450));
        this.drones.push(this.factory.createDrone(700, 450));

        this.background.setup();
    }

    /*
    * This is called each frame to update all our objects
    */
    update(timepassed) {
        this.background.update();

        this.managerShip.update(timepassed, this);

        //MOVE LATER TO SOMEWHERE BETTER
        if (kb.pressing("d")) {
            for(let ship of this.ships){
                ship.selected=false;
            }
        }
    }

    getClosestResource(x, y) {
        let index = -1;
        let distance = Number.MAX_VALUE;
        for (let i = 0; i < this.resources.length; i++) {
            let res = this.resources[i];
            let distToResource = dist(x, y, res.x, res.y);
            if (distToResource < distance) {
                index = i;
                distance = distToResource;
            }
        }
        return this.resources[index];

    }

    setOffset(x, y) {
        for (let i = 0; i < allSprites.length; i++) {
            let sprite = allSprites[i];
            sprite.x += x;
            sprite.y += y;
        }
    }
}


