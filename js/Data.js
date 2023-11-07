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
        this.bullets;
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

        this.bullets = new Group();

        this.refinery = this.factory.createRefinery(800, 450);
        //this.refinery.mass = 300;
        this.refinery.overlaps(this.ships);
        this.ships.push(this.refinery);
        this.drones.push(this.factory.createDrone(900, 450, this.refinery));
        this.drones.push(this.factory.createDrone(700, 450, this.refinery));

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

        this.ships.push(this.factory.createTorpedo(800, 300, 0));
        this.ships.push(this.factory.createTorpedo(1500, 800, 1));

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

        let bulletsToRemove = new Array();
        for (let i = 0; i < this.bullets.length; i++) {
            let bullet = this.bullets[i];
            bullet.lifetime -= timepassed;

            if (bullet.life === 1) {
                this.factory.createCleanExplosion(bullet.x, bullet.y);
            } else {
                //IF bullet colides code here
                let hasHitShip = false;
                let hasHitAsteroid = false;
                for (let ship of this.ships) {
                    if (
                        ship.overlaps(bullet) &&
                        ship.faction !== bullet.faction
                    ) {
                        this.factory.createDirtyExplosion(
                            bullet.x,
                            bullet.y,
                            0.5
                        );
                        bulletsToRemove.push(bullet);
                        ship.hp.doDamage(bullet.damage);
                    }
                }
                // this.factory.createDirtyExplosion(bullet.x,bullet.y,0.15);
                if (hasHitShip === false) {
                    for (let resource of this.universe.resources) {
                        if (resource.collides(bullet)) {
                            hasHitAsteroid = true;
                            this.universe.damage(resource);
                            this.factory.createDirtyExplosion(
                                bullet.x,
                                bullet.y,
                                0.5
                            );
                            bulletsToRemove.push(bullet);
                        }
                    }
                }

                if (hasHitShip === false && hasHitAsteroid === false) {
                    for (let otherBullet of this.bullets) {
                        if (
                            bullet.overlaps(otherBullet) &&
                            bullet.faction !== otherBullet.faction
                        ) {
                            this.factory.createCleanExplosion(
                                bullet.x,
                                bullet.y
                            );
                            bulletsToRemove.push(bullet);
                            this.factory.createCleanExplosion(
                                otherBullet.x,
                                otherBullet.y
                            );
                            bulletsToRemove.push(otherBullet);
                        }
                    }
                }
            }
            if (bullet.target != null) {
                //is missile
                bullet.tracking +=
                    (timepassed / 1000.0) * bullet.trackingChange;
                bullet.rotateTowards(bullet.target, bullet.tracking, 0);
                bullet.vel.x = cos(bullet.rotation) * 4;
                bullet.vel.y = sin(bullet.rotation) * 4;

                for (let res of this.universe.resources) {
                    if (res.collides(bullet)) {
                        this.factory.createDirtyExplosion(
                            bullet.x,
                            bullet.y,
                            0.5
                        );
                        bulletsToRemove.push(bullet);
                    }
                }
            }
        }

        for (let i = 0; i < bulletsToRemove.length; i++) {
            this.bullets.remove(bulletsToRemove[i]);
            bulletsToRemove[i].remove();
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
            
            let distToResource = dist(
                targetX,
                targetY,
                res.x,
                res.y
            );
            let closest = distToResource < distance;
            let inRange = distToResource <= maxRange;
            if (closest && inRange) {
                index = i;
                distance = distToResource;
            }
        }
        return this.universe.resources[index];
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
