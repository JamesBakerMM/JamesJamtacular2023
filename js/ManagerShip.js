const REFINERY_BINDING = 1;
const LASER_BINDING = 2;
const GUN_BINDING = 3;
const TORPEDO_BINDING = 4;

let ship_counter = 0;

class ManagerShip {
    constructor() {}

    preload() {}

    update(timepassed, data) {
        for (let ship of data.ships) {
            if (ship.type === "refinery") {
                this.doRefineryAI(timepassed, data, ship);
            }
            if (ship.type === "drone") {
                this.doDroneAI(timepassed, data, ship);
            }
            if (ship.type === "enemy drone") {
                this.doDroneAI(timepassed, data, ship);
            }
            if (ship.type === "laser") {
                this.doLaserAI(timepassed, data, ship);
            }
            if (ship.type === "torpedo") {
                this.doTorpedoAI(timepassed, data, ship);
            }
            if (ship.type === "gun") {
                this.doGunAI(timepassed, data, ship);
            }
            if (ship.type === "enemy torpedo") {
                this.doTorpedoAI(timepassed, data, ship);
            }

            if(ship.selected){
                this.drawRange(ship);
            }
        }
    }
    doRefineryAI(timepassed, data, ship) {
        this.selection(ship, REFINERY_BINDING);
        this.mouseControls(ship);
    }

    returnToRefinery(timepassed, data, ship) {
        let distanceToRefinery = dist(ship.x,ship.y,ship.refinery.x,ship.refinery.y);
        if (distanceToRefinery > Math.min(
                ship.refinery.width, 
                (ship.targetResource ? 
                        dist(ship.x,ship.y,ship.targetResource.x,ship.targetResource.y) 
                        : ship.refinery.width)
                )
            ) {
                ship.moveTowards(ship.refinery, ship.speedFactor/distanceToRefinery);
                ship.rotation = ship.direction;
                stroke(0,0,255);
                line(ex(ship.x),why(ship.y),ex(ship.refinery.x),why(ship.refinery.y));
            } else if (ship.metal > 0) {
                data.metals += ship.metal;
                ship.metal = 0;
            } else {
                ship.vel = {x:0,y:0};
                ship.rotation = ship.refinery.rotation;
            }
            ship.targetResource = data.getClosestResource(ship);
        // }
    }

    doDroneAI(timepassed, data, ship) {
        ship.moveTimer += timepassed;
        if (ship.metal <= 0) {
            if (ship.targetResource) {
                ship.rotation = ship.direction;
                ship.moveTowards(ship.targetResource, 
                        ship.speedFactor/dist(ship.x,ship.y,ship.targetResource.x,ship.targetResource.y));
                if (ship.overlapping(ship.targetResource)) {
                    //ship.vel.x = 0;
                    //ship.vel.y = 0;
                    //ship.speed = 0;
                    ship.rotationSpeed = 0;
                    if (ship.targetResource.metal > 0 && ship.moveTimer > 2000) {
                        data.universe.damage(ship.targetResource);
                        ship.metal++;
                        ship.text = ship.metal;
                        if (ship.targetResource.removed || ship.targetResource.metal <= 0) {
                            this.returnToRefinery(timepassed,data,ship);
                        }
                        
                    } 
                }
            } else {
                ship.targetResource = data.getClosestResource(ship);
            }
            if (
                    ship.targetResource == null ||
                    ship.targetResource == undefined ||
                    ship.targetResource.removed
            ) {
                ship.targetResource = data.getClosestResource(ship);
                this.returnToRefinery(timepassed,data,ship);
            }
        } else {
            this.returnToRefinery(timepassed,data,ship);
        }

        if (ship.moveTimer > 2000) {
            ship.moveTimer -= 2000;
        }
        
    }
    doLaserAI(timepassed, data, ship) {

        ship.shooting.update(timepassed);

        if (ship.shooting.canShoot()) {
            ship.shooting.target = this.getNearestShip(ship, data, ship.shooting.getRange());
            ship.shooting.reset();
        }
        
        if (ship.shooting.target != null) {
            let distance = dist(ship.x, ship.y, ship.shooting.target.x, ship.shooting.target.y);
            if (distance < ship.shooting.getRange()) {
                ship.rotateTo(ship.shooting.target, 100, 0);
                //draw laser
                push();
                stroke(255, 0, 0, 255);
                strokeWeight(10);
                line(ex(ship.x),why(ship.y),ex(ship.shooting.target.x),why(ship.shooting.target.y));
                pop();
            } else {
                ship.shooting.target = null;
            }
        }

        if (ship.faction == 0) {
            this.selection(ship, LASER_BINDING);
            this.mouseControls(ship);
        }
    }
    doTorpedoAI(timepassed, data, ship) {

        ship.shooting.update(timepassed);

        if (ship.shooting.canShoot()) {
            let target = this.getNearestShip(ship, data, ship.shooting.getRange());
            if (target != null) {
                ship.shooting.reset(target);
                data.createMissile(ship, target, 20);
                data.createMissile(ship, target, -20);
            }
        }

        if (ship.faction == 0) {
            //Needs to move away from target if too close
            this.selection(ship, TORPEDO_BINDING);
            this.mouseControls(ship);
        }
    }
    
    doGunAI(timepassed, data, ship) {
        this.selection(ship, GUN_BINDING);
        this.mouseControls(ship);
    }

    doTorpedoAI(timepassed, data, ship) {
        ship.timerShoot -= timepassed;
        if (ship.timerShoot < 0) {
            ship.timerShoot += ship.timerShootStart;
            let target = this.getNearestShip(ship, data);
            if (target != null) {
                data.createBullet(ship, target);
                ship.rotation = ship.angleTo(target.x, target.y);
            }
        }
    }

    getNearestShip(ship, data, maxDistance) {
        let closestTarget = null;
        let distance = 0;
        for (let i = 0; i < data.ships.length; i++) {
            let s = data.ships[i]
            if (ship.faction != s.faction) {
                let d = dist(ship.x, ship.y, s.x, s.y);
                if (d < maxDistance) {
                    if (closestTarget == null || d < distance) {
                        closestTarget = s;
                        distance = d;
                    }
                }
            }
        }
        return closestTarget;
    }

    selection(ship, binding) {
        
        if (kb.pressing(binding)) {
            for (let shipToBeDeselected of data.ships) {
                if (shipToBeDeselected.type !== ship.type) {
                    shipToBeDeselected.selected = false;
                    ship_counter--;
                } else {
                    ship_counter++;
                }
            }
            ship.selected = true;
        }
    }
    mouseControls(ship) {
        if (Utility.safePressed("right") && ship.selected) {
            ship.targetPos = {x:exReverse(mouseX), y:whyReverse(mouseY)};
        }
        if (ship.type == "laser") {
            if (ship.shooting.target == null) {
                ship.rotation = ship.direction;
            }
        } else {
            ship.rotation = ship.direction;
        }
        
        let distanceToTravel = dist(ship.x,ship.y,ship.targetPos.x,ship.targetPos.y);
        if (distanceToTravel > (ship.img.width)) {
            ship.moveTowards(ship.targetPos, ship.speedFactor/distanceToTravel);
        } else {
            ship.vel = {x:0,y:0};
        }
    }
    drawRange(ship){

    }
}
