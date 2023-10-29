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
        //have to check for at least null and .removed, otherwise can end up in states where drone never fetches a new resource if another drone finished off the same target resource
        if (ship.targetResource == null || ship.targetResource==undefined || ship.targetResource.removed) {
            ship.targetResource = data.getClosestResource(ship.x, ship.y);
        }
        //timed action code
        ship.moveTimer += timepassed;
        if (ship.moveTimer > 2000) {
            ship.moveTimer -= 2000;
        }
        if (ship.moveTimer < 1000) {
            ship.x = ship.originalPosition.x;
            ship.y = ship.originalPosition.y;
        } else {
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