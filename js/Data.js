class Data {


    constructor() {
        this.factory = new ObjectFactory();
        this.metals = [0, 0, 0, 0];
        this.tech = [0, 0, 0, 0];
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
        this.universe = new Universe();
        this.background = new Background();

        //drag selection controls
        this.dragStart = null;

        this.managerShip = new ManagerShip();

        this.POP_CAP = [24, 10, 10, 10];
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

        this.refinery = this.factory.createRefinery(800, 450, 0);
        //this.refinery.mass = 300;
        this.refinery.overlaps(this.ships);
        this.ships.push(this.refinery);
        this.drones.push(this.factory.createDrone(900, 450, this.refinery));
        //this.drones.push(this.factory.createDrone(700, 450, this.refinery));

        let enemyRefineryX = random(Universe.SIZE/2, Universe.SIZE);
        let enemyRefineryY = random(Universe.SIZE/2);
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

        enemyRefineryX = random(Universe.SIZE/2, Universe.SIZE);
        enemyRefineryY = random(Universe.SIZE/2, Universe.SIZE);
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

        enemyRefineryX = random(Universe.SIZE/2);
        enemyRefineryY = random(Universe.SIZE/2, Universe.SIZE);
        this.enemyRefinery3 = this.factory.createEnemyRefinery(
            enemyRefineryX,
            enemyRefineryY,
            3
        );
        this.enemyRefinery3.overlaps(this.ships);
        this.ships.push(this.enemyRefinery3);
        this.drones.push(
            this.factory.createEnemyDrone(
                enemyRefineryX + random(-50, 50),
                enemyRefineryY + random(-50, 50),
                this.enemyRefinery3.faction,
                this.enemyRefinery3
            )
        );
        this.drones.push(
            this.factory.createEnemyDrone(
                enemyRefineryX + random(-50, 50),
                enemyRefineryY + random(-50, 50),
                this.enemyRefinery3.faction,
                this.enemyRefinery3
            )
        );

        this.background.setup();
        this.universe.setup(this.factory);
    }

    updateBackground(timepassed) {
        this.background.update();
    }


    refineryIsDead(refinery){
        return refinery.removed ||refinery===undefined ||refinery.null
    }
    /*
     * This is called each frame to update all our objects
     */
    update(timepassed) {
        this.managerShip.update(timepassed, this);
        if(this.refineryIsDead(this.refinery)){
            alert('GAME OVER MAN, GAME OVER');
            window.location.replace("./index.html");
        }
        if(
            this.refineryIsDead(this.enemyRefinery1) && this.refineryIsDead(this.enemyRefinery2) && this.refineryIsDead(this.enemyRefinery3) || 
            this.universe.resources.length<10
        ){
            alert('All Rivals Liquidated! You win!');
            window.location.replace("./index.html");
        }
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
                    
                    if(bullet.visible){
                        point(p.x, p.y);
                    }
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
                    if(bullet.visible){
                        image(bullet.image, 0, 0);
                    }
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
                            if (ship.type == "laser") {
                                ship.targetPos = null;
                            }
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
                                ship.x + random(-5,5), ship.y + random(-5,5), ship.faction)
                        );
                    this.universe.resources.push(
                        this.factory.createWreckage(
                                ship.x + random(-5,5), ship.y + random(-5,5), ship.faction)
                        );
                    this.POP_CAP[ship.faction] = 0;
                    this.createPatrol();
                    if (ship.type === "refinery") {
                        //Game over here
                    }
                } else if (ship.type.includes("enemy drone")) {
                    this.universe.resources.push(
                        this.factory.createWreckage(ship.x, ship.y, ship.faction)
                        );
                    //CREATE NEW DRONE TO REPLACE IT
                    if (this.POP_CAP[ship.faction] > 0) {

                        this.drones.push(
                            this.factory.createEnemyDrone(
                                ship.refinery.x + random(-50, 50),
                                ship.refinery.y + random(-50, 50),
                                ship.faction,
                                ship.refinery
                                )
                            );
                    }
                } else {
                    this.universe.resources.push(
                        this.factory.createWreckage(ship.x, ship.y, ship.faction)
                        );
                }
                this.factory.ship_counter[ship.faction] -= 1;
                if(ship.gun){
                    ship.gun.remove();
                }
                ship.remove();
                if(ship.faction===0){
                    cameraGood.addScreenShake();
                }
            } else {
                if(ship.faction===0){ //SENSOR CODE
                    for(let otherShip of this.ships) {
                        if(otherShip.faction !== 0 && otherShip.visible===false){
                            const distance = dist(ex(ship.x),why(ship.y),ex(otherShip.x),why(otherShip.y));
                            if(distance<=ship.sensor){
                                otherShip.visible=true;
                                if(otherShip.gun){
                                    otherShip.gun.visible=true;
                                }
                            }
                        }
                    }
                    for(let resource of this.universe.resources) {
                        const distance = dist(ex(ship.x),why(ship.y),ex(resource.x),why(resource.y));
                        if(resource.visible===false && distance<=ship.sensor){
                            resource.visible=true;
                        }
                    }
                    for(let bullet of this.bullets){
                        const distance = dist(ex(ship.x),why(ship.y),ex(bullet.x),why(bullet.y));
                        if(bullet.visible===false && distance<=ship.sensor) {
                            bullet.visible=true;
                        }
                    } 
                }
            }
        }

        this.doDragSelection();
    }

    createPatrol() {
        this.ships.push(this.factory.createGun(0, 0, random([1, 2, 3]), this.refinery)); // X, Y, FACTION, REFINERY
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

    doDragSelection() {

        if (this.dragStart == null) {
            if (Utility.safePressing("left")) {
                this.dragStart = {x: mouseX, y: mouseY};
            }
        } else {

            let xLower = this.dragStart.x;
            let xHigher = mouseX;
            if (mouseX < this.dragStart.x) {
                xLower = mouseX;
                xHigher = this.dragStart.x;
            }
            let width = Utility.getDifference(xLower, xHigher);

            let yLower = this.dragStart.y;
            let yHigher = mouseY;
            if (mouseY < this.dragStart.y) {
                yLower = mouseY;
                yHigher = this.dragStart.y;
            }
            let height = Utility.getDifference(yLower, yHigher);

            if (mouse.released('left')) {
                xLower = exReverse(xLower);
                xHigher = exReverse(xHigher);
                yLower = whyReverse(yLower);
                yHigher = whyReverse(yHigher);

                let click = 75;
                let wasClick = false;
                if (width < click) {
                    xLower -= click/2;
                    xHigher += click/2;
                    wasClick = true;
                }
                if (height < click) {
                    yLower -= click/2;
                    yHigher += click/2;
                    wasClick = true;
                }

                let count = 0;
                for (let i = this.ships.length-1; i >= 0; i--) {
                    let ship = this.ships[i];
                    ship.selected = false;
                    if (!wasClick || (wasClick && count == 0)) {
                        if (ship.faction == 0 && ship.type !== "drone") {
                            if (ship.x > xLower && ship.x < xHigher && ship.y > yLower && ship.y < yHigher) {
                                count += 1;
                                ship.selected = true;
                            }
                        }
                    }
                }
                this.dragStart = null;
            } else {
                push();
                stroke(GUI.YELLOW);
                strokeWeight(3);
                noFill();
                rect(xLower, yLower, width, height);
                pop();
            }
        }
    }
}