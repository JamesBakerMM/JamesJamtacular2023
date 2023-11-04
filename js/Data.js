class Data {
    constructor() { 
        this.factory = new ObjectFactory();
        this.metals=0; // move to player later
        this.ships;  //will be group in setup
        this.drones;
        this.laser;
        this.gun;
        this.torpedo;
        this.effects;
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
        this.effects = new Group();
        this.effects.collider="none";

        this.bullets = new Group();

        this.refinery = this.factory.createRefinery(800, 450)
        this.refinery.mass = 300;
        this.refinery.overlaps(this.ships);
        this.ships.push(this.refinery);
        this.drones.push(this.factory.createDrone(900, 450));
        this.drones.push(this.factory.createDrone(700, 450));

        this.resources = new Group();
        // this.resources.push(this.factory.createResource(this.refinery.x + random(-5,5), 
        //         this.refinery.y + random(-5,5), 4));
        // this.resources.push(this.factory.createResource(this.refinery.x + random(-2000,2000), 
        //         this.refinery.y + random(-1000,1000), 4));
        for (let i = 0; i < 10; i++) {
            let x = Math.random() * 1600;
            //while (Math.abs(x - this.refinery.x) < 5) x = Math.random() * 1600;
            let y = Math.random() * 900;
            //while (Math.abs(y - this.refinery.y) < 5) x = Math.random() * 1600;
            this.resources.push(this.factory.createResource(x, y, 4));
        }

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
                this.factory.createCleanExplosion(bullet.x,bullet.y);
                bullet.remove();
            } else {
                //IF bullet colides code here
                for(let ship of this.ships){
                    if(ship.overlaps(bullet) && ship.faction!==bullet.faction) {
                        this.factory.createDirtyExplosion(bullet.x,bullet.y,0.5);
                        ship.hp.doDamage(bullet.damage)
                        // ship.remove()
                        this.bullets.remove(bullet);
                        bullet.remove();
                    }
                }
            }

            if (bullet.target != null) {
                bullet.rotateTowards(bullet.target, 0.02, 0);
                bullet.vel.x = cos(bullet.rotation) * 4;
                bullet.vel.y = sin(bullet.rotation) * 4;

                for(let res of this.resources){
                    if(res.collides(bullet)){
                        this.bullets.remove(bullet);
                        bullet.remove();
                    }
                }
            }
        }
        for(let ship of this.ships){ 
            if(ship.hp.isDead()){
                ship.remove();
                cameraGood.addScreenShake();
            }
        }
    }

    getClosestResource(x, y) {
        let index = -1;
        let distance = Number.MAX_VALUE;
        for (let i = 0; i < this.resources.length; i++) {
            let res = this.resources[i];
            let distToResource = dist(this.refinery.x, this.refinery.y, res.x, res.y);
            let closest = distToResource < distance;
            let inRange = dist(this.refinery.x,this.refinery.y,res.x,res.y) <= this.refinery.range/2;
            if (closest && inRange) {
                index = i;
                distance = distToResource;
            } else if (!inRange) {
            } else {
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

    createBullet(origin, target) {
        this.bullets.push(this.factory.createBullet(origin, target));
    }

    createMissile(origin, target) {
        this.bullets.push(this.factory.createMissile(origin, target));
    }
}


