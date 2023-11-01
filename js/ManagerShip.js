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
        }
    }
    doRefineryAI(timepassed, data, ship) {
        this.selection(ship, REFINERY_BINDING);
        this.mouseControls(ship);
    }

    returnToRefinery(data,ship) {
        //TODO: ADD STATE MACHINE OF ROTATION TOWARDS REFINERY
        //ship.rotateTo(data.refinery);
        
        
        if (dist(ship.x,ship.y,data.refinery.x,data.refinery.y) 
                > Math.min(
                    data.refinery.width, 
                    (ship.targetResource ? dist(ship.x,ship.y,ship.targetResource.x,ship.targetResource.y) 
                        : data.refinery.width)
                    )
            )
        {
            ship.moveTowards(data.refinery, 0.1);
            ship.rotation = ship.direction;
            stroke(0,0,255);
            line(ship.x,ship.y,data.refinery.x,data.refinery.y);
        } else if (ship.metal > 0) {
            data.metals += ship.metal;
            ship.metal = 0;
        } else {
            ship.vel = {x:0,y:0};
            ship.rotation = data.refinery.rotation;
            //ship.attractTo(data.refinery, 5);
        }
        ship.targetResource = data.getClosestResource(ship.x, ship.y);
    }


    doDroneAI(timepassed, data, ship) {
        if (ship.metal <= 0) {
            if (ship.targetResource) {
                stroke(255,255,0);
                line(ship.x,ship.y,ship.targetResource.x,ship.targetResource.y);
                ship.rotation = ship.direction;
                ship.moveTowards(ship.targetResource, 0.1);
                if (ship.overlaps(ship.targetResource)) {
                    if (ship.targetResource.metal > 0) {
                        ship.targetResource.metal--;
                        ship.metal++;
                        ship.targetResource.text = ship.targetResource.metal;
                        ship.text = ship.metal;
                        if (ship.targetResource.metal <= 0) {
                            ship.targetResource.remove();
                            this.returnToRefinery(data,ship);
                            ship.targetResource = data.getClosestResource(ship.x, ship.y);
                        }
                    } 
                }
            } else {
                ship.targetResource = data.getClosestResource(ship.x, ship.y);
                if (
                        ship.targetResource == null ||
                        ship.targetResource == undefined ||
                        ship.targetResource.removed
                ) {
                    ship.targetResource = data.getClosestResource(ship.x, ship.y);
                    this.returnToRefinery(data,ship);
                }
            }

            /*have to check for at least null and .removed, 
            otherwise can end up in states where drone never 
            fetches a new resource if another drone finished off the same target resource*/
            // if (
            //         ship.targetResource == null ||
            //         ship.targetResource == undefined ||
            //         ship.targetResource.removed
            //     ) {
            //     ship.targetResource = data.getClosestResource(ship.x, ship.y);
            // }
        } else {
            this.returnToRefinery(data,ship);
        }
        //timed action code
        ship.moveTimer += timepassed;
        // if (ship.moveTimer > 2000) {
        //     ship.moveTimer -= 2000;
        // }
        // if (ship.moveTimer < 1000) { //
        //     this.returnToRefinery(data,ship);
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

        if (ship.selected) {
            noStroke();
            fill("white");
            ellipse(ship.x, ship.y, ship.img.width * 1.5);
        }
    }
    mouseControls(ship) {
        if (mouse.pressed("left") && ship.selected) {
            ship.targetPos = {x:mouseX, y:mouseY};
        }
        ship.rotation = ship.direction;
        //if (ship.selected) {
            if (dist(ship.x,ship.y,ship.targetPos.x,ship.targetPos.y) > (ship.img.width)) {
                ship.moveTowards(ship.targetPos, 0.01);
            } else {
                ship.vel = {x:0,y:0};
            }
        //} 
                
        //  else if (ship.selected && 
        //     dist(ship.x,ship.y,ship.targetPos.x,ship.targetPos.y) <=> (ship.img.width * ship_counter)) {
        //         ship.vel = {x:0,y:0};
        // }
    }
}
