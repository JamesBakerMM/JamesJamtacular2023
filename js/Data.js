class Data {
    constructor() {
        this.factory = new ObjectFactory();
        this.metals = [0, 0, 0]; // move to player later
        this.ships; //will be group in setup
        this.drones;
        this.laser;
        this.gun;
        this.torpedo;
        this.effects;
        this.bullets = new Array();
        this.refinery = null;
        this.enemyRefinery1 = null;
        this.enemyRefinery2 = null;
        this.resources;
        this.universe = new Universe();
        this.background = new Background();

        this.managerShip = new ManagerShip();
    }

    preload() {
        this.universe.preload();
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
        this.effects.collider = "none";

        this.refinery = this.factory.createRefinery(800, 450);
        //this.refinery.mass = 300;
        this.refinery.overlaps(this.ships);
        this.ships.push(this.refinery);
        this.drones.push(this.factory.createDrone(900, 450, this.refinery));
        //this.drones.push(this.factory.createDrone(700, 450, this.refinery));

        let enemyRefineryX = random(5000);
        let enemyRefineryY = random(5000);
        this.enemyRefinery1 = this.factory.createEnemyRefinery(
            enemyRefineryX,
            enemyRefineryY,
            1
        );
        this.enemyRefinery1.overlaps(this.ships);
        this.ships.push(this.enemyRefinery1);
        this.drones.push(
            this.factory.createEnemyDrone(
                enemyRefineryX + random(-50, 50),
                enemyRefineryY + random(-50, 50),
                this.enemyRefinery1.faction,
                this.enemyRefinery1
            )
        );
        this.drones.push(
            this.factory.createEnemyDrone(
                enemyRefineryX + random(-50, 50),
                enemyRefineryY + random(-50, 50),
                this.enemyRefinery1.faction,
                this.enemyRefinery1
            )
        );

        enemyRefineryX = random(5000);
        enemyRefineryY = random(5000);
        this.enemyRefinery2 = this.factory.createEnemyRefinery(
            enemyRefineryX,
            enemyRefineryY,
            2
        );
        this.enemyRefinery2.overlaps(this.ships);
        this.ships.push(this.enemyRefinery2);
        this.drones.push(
            this.factory.createEnemyDrone(
                enemyRefineryX + random(-50, 50),
                enemyRefineryY + random(-50, 50),
                this.enemyRefinery2.faction,
                this.enemyRefinery2
            )
        );
        this.drones.push(
            this.factory.createEnemyDrone(
                enemyRefineryX + random(-50, 50),
                enemyRefineryY + random(-50, 50),
                this.enemyRefinery2.faction,
                this.enemyRefinery2
            )
        );
        this.drones.push(
            this.factory.createEnemyDrone(
                enemyRefineryX + random(-50, 50),
                enemyRefineryY + random(-50, 50),
                this.enemyRefinery2.faction,
                this.enemyRefinery2
            )
        );

        this.ships.push(this.factory.createTorpedo(1300, 600, 0));
        this.ships.push(this.factory.createGun(1400, 700, 1));

        this.background.setup();
        this.universe.setup(this.factory);
    }

    updateBackground(timepassed) {
        this.background.update();
    }

    /*
     * This is called each frame to update all our objects
     */
    update(timepassed) {
        this.managerShip.update(timepassed, this);
        
        push();
        stroke('white');
        strokeWeight(4);
        for (let i = 0; i < this.bullets.length; i++) {
            let bullet = this.bullets[i];
            bullet.life -= timepassed;
            if (bullet.life < 0) {
                bullet.dead = true;
                if (bullet.type === "torpedo") {
                    this.factory.createCleanExplosion(bullet.x, bullet.y);
                }
            } else {
                let p = {x: 0, y: 0}

                if (bullet.type === "bullet") {
                    bullet.x += bullet.vx * (timepassed/1000);
                    bullet.y += bullet.vy * (timepassed/1000);

                    p = {x: ex(bullet.x), y: why(bullet.y)};
                    
                    point(p.x, p.y);
                } else if (bullet.type === "torpedo") {
                    if (bullet.target.hp.isDead()) {
                        bullet.life -= timepassed * 2;
                    }
                    bullet.tracking += bullet.trackingChange * (timepassed/1000);

                    let angle = atan2(bullet.y - bullet.target.y, bullet.x - bullet.target.x);
                    bullet.rotation = Utility.turnTowards(bullet.rotation, angle, bullet.tracking * (timepassed/1000));

                    let offsetX = cos(bullet.rotation);
                    let offsetY = sin(bullet.rotation);

                    bullet.x += -offsetX * (timepassed/1000) * bullet.speed;
                    bullet.y += -offsetY * (timepassed/1000) * bullet.speed;
                    p = {x: ex(bullet.x)-12, y: why(bullet.y)-12};
                    translate(p.x , p.y);
                    rotate(bullet.rotation);
                    image(bullet.image, 0, 0);
                    rotate(-bullet.rotation);
                    translate(-p.x, -p.y);
                }

                //COLLISION
                let hit = false;
                for(let j = 0; j < this.ships.length; j++) {
                    let ship = this.ships[j];
                    if (ship.faction != bullet.faction) {
                        let d = dist(ship.x, ship.y, bullet.x, bullet.y);
                        if (d < ship.radius) {
                            hit = true;
                            ship.hp.doDamage(bullet.damage);
                        }
                    }
                }
                for(let j = 0; j < this.universe.resources.length; j++) {
                    let res = this.universe.resources[j];
                    let d = dist(res.x, res.y, bullet.x, bullet.y);
                    if (d < res.radius) {
                        hit = true;
                        this.universe.damage(res, bullet.damage);
                    }
                }
                for(let j = 0; j < this.bullets.length; j++) {
                    let b = this.bullets[j];
                    if (b.faction != bullet.faction) {
                        let d = dist(b.x, b.y, bullet.x, bullet.y);
                        let radius = 6;
                        if (b.type === "torpedo" || bullet.type === "torpedo") {
                            radius = 24;
                        }
                        if (d < radius) {
                            hit = true;
                            b.dead = true;
                        }
                    }
                }
                if (hit == true) {
                    this.factory.createDirtyExplosion(bullet.x, bullet.y, 0.5);
                    bullet.dead = true;
                }
            }        
        }
        pop();
        for (let i = this.bullets.length-1; i >= 0; i--) {
            if (this.bullets[i].dead) {
                this.bullets.splice(i, 1);
            }
        }


        for (let ship of this.ships) {
            //MOVE LATER TO SOMEWHERE BETTER
            if (kb.pressing("d")) {
                ship.selected = false;
            }

            //selections
            this.selection(ship, REFINERY_BINDING);
            this.selection(ship, LASER_BINDING);
            this.selection(ship, GUN_BINDING);
            this.selection(ship, TORPEDO_BINDING);

            if (ship.hp.isDead()) {
                if (ship.type.includes("refinery")) {
                    this.universe.resources.push(
                        this.factory.createWreckage(
                                ship.x + random(-5,5), ship.y + random(-5,5))
                        );
                    this.universe.resources.push(
                        this.factory.createWreckage(
                                ship.x + random(-5,5), ship.y + random(-5,5))
                        );
                } else {
                    this.universe.resources.push(
                        this.factory.createWreckage(ship.x, ship.y)
                        );
                }
                ship.remove();
                cameraGood.addScreenShake();
            }
        }
    }

    getClosestResource(ship) {
        let index = -1;
        let distance = Number.MAX_VALUE;
        let targetX, targetY, maxRange;
        if (ship.refinery) {
            targetX = ship.refinery.x;
            targetY = ship.refinery.y;
            maxRange = ship.refinery.range / 2;
        } else {
            targetX = ship.x;
            targetY = ship.y;
            maxRange = 5000;
        }
        for (let i = 0; i < this.universe.resources.length; i++) {
            let res = this.universe.resources[i];
            
            let distToResource = dist(targetX, targetY, res.x, res.y);
            if (distToResource <= maxRange) {
                
                let droneCount = 0;
                for (let j = 0; j < this.drones.length; j++) {
                    let d = this.drones[j];
                    if (d.targetResource == res && d.faction == ship.faction) {
                        droneCount += 1;
                    }
                }
                if (droneCount < 3) {
                    if (distToResource < distance) {
                        index = i;
                        distance = distToResource;
                    }
                } 
            }
        }
        if (index < 0) {
            return null;
        } else {
            return this.universe.resources[index];
        }
        
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

    createMissile(origin, target, offset) {
        this.bullets.push(this.factory.createMissile(origin, target, offset));
    }

    doCometAI(comet) {
        if (comet.vel.x < comet.minVal.x) comet.vel.x = comet.minVal.x;
        if (comet.vel.y < comet.minVal.y) comet.vel.y = comet.minVal.y;
    }

    selection(s, binding) {
        if (kb.pressing(binding)) {
            if (s.type == this.bindingToType(binding) && s.faction == 0) {
                s.selected = true;
            } else {
                s.selected = false;
            }
        }
    }

    bindingToType(value) {
        if (value == REFINERY_BINDING) {
            return "refinery";
        } else if (value == LASER_BINDING) {
            return "laser";
        } else if (value == GUN_BINDING) {
            return "gun";
        } else if (value == TORPEDO_BINDING) {
            return "torpedo";
        }
    }
}
