class Data {
    constructor() { 
        this.factory = new ObjectFactory();
        this.metals=0; // move to player later
        this.ships;  //will be group in setup
        this.drones;
        this.laser;
        this.gun;
        this.torpedo;
        this.bullets;
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

        this.bullets = new Group();

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

        this.ships.push(this.factory.createEnemyTurret(1500, 800));

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
        for(let i = this.bullets.length-1; i >= 0; i--) {
            let bullet = this.bullets[i];
            bullet.lifetime -= timepassed;
            
            if (bullet.lifetime < 0) {
                this.bullets.remove(bullet);
                bullet.remove();
            } else {
                bullet.x += bullet.velocityX;
                bullet.y += bullet.velocityY;
                //IF bullet colides code here
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

    createBullet(origin, target, faction) {

        let x = target.x-origin.x;
        let y = target.y-origin.y;

        length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

        // normalize vector
        x = x / length;
        y = y / length;

        //apply bullet speed
        x = x * 10;
        y = y * 10;

        this.bullets.push(this.factory.createBullet(origin.x, origin.y, x, y, faction));
    }
}


