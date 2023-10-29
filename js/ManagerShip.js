class ManagerShip {
    constructor() {
    }

    preload() {
    }

    update(timepassed, data) {

        for(let ship of data.ships) {
            if (ship.type === "drone") {
                this.doDroneAI(timepassed, data, ship);
            }
        }
    }

    doDroneAI(timepassed, data, ship) {
        //Insert Code or function here to handle drones each frame
        if (ship.targetResource == null) {
            ship.targetResource = data.getClosestResource(ship.x, ship.y);
            console.log("new target resource is",ship.targetResource)
        }
        //check if is overlapping targetResource
            //if it is decrement resource by 1
        ship.moveTimer += timepassed;
        if (ship.moveTimer > 2000) {
            ship.moveTimer -= 2000;
        }
        if (ship.moveTimer < 1000) {
            ship.x = ship.originalPosition.x;
            ship.y = ship.originalPosition.y;
        } else {
            console.log("going to",ship.targetResource.idNum)
            ship.x = ship.targetResource.x;
            ship.y = ship.targetResource.y;
        }

        //has to be at end as could remove the target resource
        if(ship.overlaps(ship.targetResource)){
            if(ship.targetResource.metal>0){
                ship.targetResource.metal--
                data.metals++;
            } else {
                ship.targetResource.remove();
                ship.targetResource = data.getClosestResource(ship.x, ship.y); //new target
            }
        }
    }
}