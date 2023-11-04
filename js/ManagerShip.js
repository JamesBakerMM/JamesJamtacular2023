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
            if (ship.type === "laser") {
                this.doLaserAI(timepassed, data, ship);
            }
            if (ship.type === "torpedo") {
                this.doTorpedoAI(timepassed, data, ship);
            }
            if (ship.type === "gun") {
                this.doGunAI(timepassed, data, ship);
            }
            if (ship.type === "turret") {
                this.doTurretAI(timepassed, data, ship);
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

    returnToRefinery(timepassed,data,ship) {
        let distanceToRefinery = dist(ship.x,ship.y,data.refinery.x,data.refinery.y);
        if (distanceToRefinery > Math.min(
                data.refinery.width, 
                (ship.targetResource ? 
                dist(ship.x,ship.y,ship.targetResource.x,ship.targetResource.y) 
                : data.refinery.width)
                )
            ) {
                ship.moveTowards(data.refinery, ship.speedFactor/distanceToRefinery);
                ship.rotation = ship.direction;
                stroke(0,0,255);
                line(ex(ship.x),why(ship.y),ex(data.refinery.x),why(data.refinery.y));
            } else if (ship.metal > 0) {
                data.metals += ship.metal;
                ship.metal = 0;
            } else {
                ship.vel = {x:0,y:0};
                ship.rotation = data.refinery.rotation;
                //ship.attractTo(data.refinery, 5);
            }
            ship.targetResource = data.getClosestResource(ship.x, ship.y);
        // }
    }


    doDroneAI(timepassed, data, ship) {
        if (ship.metal <= 0) {
            if (ship.targetResource) {
                stroke(255,255,0);
                line(ex(ship.x),why(ship.y),ex(ship.targetResource.x),why(ship.targetResource.y));
                ship.rotation = ship.direction;
                ship.moveTowards(ship.targetResource, ship.speedFactor/dist(ship.x,ship.y,ship.targetResource.x,ship.targetResource.y));
                if (ship.overlaps(ship.targetResource)) {
                    if (ship.targetResource.metal > 0) {
                        ship.targetResource.ani.nextFrame();
                        ship.targetResource.metal--;
                        ship.metal++;
                        ship.targetResource.text = ship.targetResource.metal;
                        ship.text = ship.metal;
                        if (ship.targetResource.metal <= 0) {
                            ship.targetResource.remove();
                            this.returnToRefinery(timepassed,data,ship);
                            ship.targetResource = data.getClosestResource(ship.x, ship.y);
                        }
                    } 
                }
            } else {
                ship.targetResource = data.getClosestResource(ship.x, ship.y);
            }
            if (
                    ship.targetResource == null ||
                    ship.targetResource == undefined ||
                    ship.targetResource.removed
            ) {
                ship.targetResource = data.getClosestResource(ship.x, ship.y);
                this.returnToRefinery(timepassed,data,ship);
            }
        } else {
            this.returnToRefinery(timepassed,data,ship);
        }
        //timed action code
        ship.moveTimer += timepassed;
        // if (ship.moveTimer > 2000) {
        //     ship.moveTimer -= 2000;
        // }
        // if (ship.moveTimer < 1000) { //
        //     this.returnToRefinery(timepassed,data,ship);
        // } else {
        //     //ship.x = ship.targetResource.x;
        //     //ship.y = ship.targetResource.y;
        //     //TODO: MAKE SHIP ROTATE FULLY BEFORE MOVING
        //     ship.rotation = ship.direction;
        //     //ship.rotateTo(ship.targetResource);
        //     ship.moveTowards(ship.targetResource, 0.1);
        // }

        //has to be at end as could remove the target resource
        
    }
    doLaserAI(timepassed, data, ship) {
        this.selection(ship, LASER_BINDING);
        this.mouseControls(ship);
    }
    doTorpedoAI(timepassed, data, ship) {
        this.selection(ship, TORPEDO_BINDING);
        this.mouseControls(ship);
    }
    doGunAI(timepassed, data, ship) {
        this.selection(ship, GUN_BINDING);
        this.mouseControls(ship);
    }

    doTurretAI(timepassed, data, ship) {
        ship.timerShoot -= timepassed;
        if (ship.timerShoot < 0) {
            ship.timerShoot += ship.timerShootStart;
            let closestTarget = null;
            let distance = 0;
            for (let i = 0; i < data.ships.length; i++) {
                let s = data.ships[i]
                if (ship.faction != s.faction) {
                    if (closestTarget == null || dist(ship.x, ship.y, s.x, s.y) < distance) {
                        closestTarget = s;
                    }
                }
            }
            if (closestTarget != null) {
                data.createMissile(ship, closestTarget)
                ship.rotation = ship.angleTo(closestTarget.x, closestTarget.y);
            }
        }
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
        if (Utility.safePressed("left") && ship.selected) {
            ship.targetPos = {x:exReverse(mouseX), y:whyReverse(mouseY)};
        }
        ship.rotation = ship.direction;
        let distanceToTravel = dist(ship.x,ship.y,ship.targetPos.x,ship.targetPos.y);
        if (distanceToTravel > (ship.img.width)) {
            ship.moveTowards(ship.targetPos, ship.speedFactor/distanceToTravel);
        } else {
            ship.vel = {x:0,y:0};
            ship.rotationLock = true;
        }
        //} 
                
        //  else if (ship.selected && 
        //     dist(ship.x,ship.y,ship.targetPos.x,ship.targetPos.y) <=> (ship.img.width * ship_counter)) {
        //         ship.vel = {x:0,y:0};
        // }
    }
    drawRange(ship){

    }
}
