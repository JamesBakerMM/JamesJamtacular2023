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
        }
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
    }
}