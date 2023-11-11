const REFINERY_BINDING = 1;
const LASER_BINDING = 2;
const GUN_BINDING = 3;
const TORPEDO_BINDING = 4;

class ManagerShip {
    constructor() {}

    preload() {}

    update(timepassed, data) {
        for (let ship of data.ships) {
            if (ship.type === "refinery") {
                this.doRefineryAI(timepassed, data, ship);
            }
            if (ship.type === "enemy refinery") {
                this.doEnemyRefineryAI(timepassed, data, ship);
            }
            if (ship.type === "drone" || ship.type === "enemy drone") {
                this.doDroneAI(timepassed, data, ship);
            }
            if (ship.type === "laser" || ship.type === "enemy laser") {
                this.doLaserAI(timepassed, data, ship);
            }
            if (ship.type === "torpedo") {
                this.doTorpedoAI(timepassed, data, ship);
            }
            if (ship.type === "gun") {
                this.doGunAI(timepassed, data, ship);
            }

            if(ship.selected){
                this.drawRange(ship);
            }
        }
    }
    doRefineryAI(timepassed, data, ship) {
        this.mouseControls(ship);
    }

    returnToRefinery(timepassed, data, ship) {
        let targetRange = LONG_RANGE / 2;
        switch (ship.type) {
            case "torpedo": // Torpedo should stay closest to refinery
                targetRange += ship.height;
                break;
            case "gun": // Guns should be next closest
                targetRange += MIN_RANGE / 3;
                break;
            case "laser": // Lasers should be furthest out
                targetRange += MIN_RANGE / 2;
                break;
        }
        let distanceToRefinery = dist(ship.x, ship.y, ship.refinery.x, ship.refinery.y);
        if (distanceToRefinery > targetRange) {
            ship.moveTowards(ship.refinery, ship.speedFactor/distanceToRefinery);
            ship.rotation = ship.direction;
        } else {
            let angle = atan2(ship.y - ship.refinery.y, ship.x - ship.refinery.x);
            angle += 2;
            let range = targetRange;
            let distance = dist(ship.x, ship.y, ship.refinery.x, ship.refinery.y);
            let pos = {x: ship.refinery.x + (cos(angle)*(range)), y: ship.refinery.y + (sin(angle)*(range))};
            if (Utility.getDifference(range, distance) < 10) {
                ship.rotateTo(ship.refinery, 100);
                ship.rotation -= 90;
            } else {
                ship.rotateTo(pos, 100);
            }
            ship.moveTo(pos, ship.speedFactor);
        }
        // if (distanceToRefinery > Math.min(
        //         ship.refinery.width, 
        //         (ship.targetResource ? 
        //                 dist(ship.x,ship.y,ship.targetResource.x,ship.targetResource.y) 
        //                 : ship.refinery.width)
        //         )
        //     ) {
        //         ship.moveTowards(ship.refinery, ship.speedFactor/distanceToRefinery);
        //         ship.rotation = ship.direction;
        //     } else if (ship.metal > 0) {
        //         data.metals[ship.faction] += ship.metal;
        //         ship.metal = 0;
        //     } else {
        //         ship.vel = {x:0,y:0};
        //         ship.rotation = ship.refinery.rotation;
        //     }
        // ship.targetResource = data.getClosestResource(ship);
    }

    doEnemyRefineryAI(timepassed, data, ship) {
        if (
                !ship.targetResource ||
                ship.targetResource === null ||
                ship.targetResource === undefined ||
                ship.targetResource.removed
                ) {
            ship.targetResource = data.getClosestResource(ship);
        } else {
            if (dist(ship.x, ship.y, ship.targetResource.x, ship.targetResource.y) 
                    <= ship.range/3) {
                ship.speed = 0;
            } else {
                ship.rotation = ship.direction;
                ship.moveTowards(ship.targetResource, 
                ship.speedFactor/dist(ship.x,ship.y,ship.targetResource.x,ship.targetResource.y));
            }
        }
        let approachingShip = this.detectEnemies(data, ship);
        if (approachingShip && frameCount % 30 == 0) {
            if (data.factory.ship_counter[ship.faction] < data.POP_CAP[ship.faction]) {
                let newShip;
                let directionVector = {x: approachingShip.x - ship.x,
                        y: approachingShip.y - ship.y};
                console.log(directionVector);
                let closeness = min(MED_RANGE,
                        dist(ship.x, ship.y,
                            approachingShip.x, 
                            approachingShip.y));
                let newX;
                if (directionVector.x < 0) {
                    newX = random(-1 * closeness, 0);
                } else if (directionVector.x > 0) {
                    newX = random(0, closeness);
                } else {
                    newX = random(-1 * closeness, closeness);
                }
                let newY;
                if (directionVector.y < 0) {
                    newY = random(-1* closeness, 0);
                } else if (directionVector.y > 0) {
                    newY = random(0, closeness);
                } else {
                    newY = random(-1 * closeness, closeness);
                }
                switch (random([1,2,3])) {
                    case 1:
                        newShip = data.factory.createTorpedo(
                            ship.x + newX,
                            ship.y + newY,
                            ship.faction,
                            ship
                            );
                        break;
                    case 2:
                        newShip = data.factory.createLaser(
                            ship.x + newX, 
                            ship.y + newY,
                            ship.faction,
                            ship
                            );
                        break;
                    case 3:
                        newShip = data.factory.createGun(
                            ship.x + newX, 
                            ship.y + newY,
                            ship.faction,
                            ship
                            );
                        break;
                }
                data.ships.push(newShip);
            }
        }
    }

    detectEnemies(data, ship) {
        for (let otherShip of data.ships) {
            if (otherShip.faction != ship.faction && 
                    dist(ship.x, ship.y, otherShip.x, otherShip.y) <= ship.range) {
                return otherShip;
            }
        }
        return null;
    }

    doDroneAI(timepassed, data, ship) {
        ship.moveTimer += timepassed;
        if (ship.waypoint != null) {
            if (dist(ship.x, ship.y, ship.waypoint.x, ship.waypoint.y) < 20) {
                ship.waypoint = null;
            } else {
                ship.rotateTo(ship.waypoint, timepassed);
                ship.moveTo(ship.waypoint, ship.speedFactor);
            }
        } else if (ship.metal < 1) {
            if (ship.targetResource == null || ship.targetResource.removed || ship.targetResource.metal <= 0) {
                ship.targetResource = data.getClosestResource(ship);
            }
            if (ship.targetResource != null) {
                ship.rotateTo(ship.targetResource, timepassed);
                if (ship.overlapping(ship.targetResource)) {
                    ship.velocity.x = 0;
                    ship.velocity.y = 0;
                    data.universe.damage(ship.targetResource, (timepassed / 1000));

                    ship.metal += (timepassed / 1000);
                    ship.tech += (timepassed / 1000);
                    if (ship.metal >= 1) {
                        ship.waypoint = Utility.getMidPoint(ship, ship.refinery);
                        let angle = atan2(ship.refinery.y - ship.y, ship.refinery.x - ship.x)  + 90;
                        ship.waypoint.x += 75 * cos(angle)
                        ship.waypoint.y += 75 * sin(angle);
                    }
                } else {
                    ship.moveTo(ship.targetResource, ship.speedFactor);
                }
            } else {
                let angle = atan2(ship.y - ship.refinery.y, ship.x - ship.refinery.x);
                angle += 2;
                let range = MIN_RANGE/2;
                let distance = dist(ship.x, ship.y, ship.refinery.x, ship.refinery.y);
                let pos = {x: ship.refinery.x + (cos(angle)*(range)), y: ship.refinery.y + (sin(angle)*(range))};
                if (Utility.getDifference(range, distance) < 10) {
                    ship.rotateTo(ship.refinery, 100);
                    ship.rotation -= 90;
                } else {
                    ship.rotateTo(pos, 100);
                }
                ship.moveTo(pos, ship.speedFactor);
            }
        } else {
            ship.rotateTo(ship.refinery, timepassed);
            if (dist(ship.x, ship.y, ship.refinery.x, ship.refinery.y) > 60) {
                ship.moveTo(ship.refinery, ship.speedFactor);
            } else {
                ship.velocity.x = 0;
                ship.velocity.y = 0;
                data.metals[ship.faction] += ship.metal;
                if(ship.tech && ship.faction===0){
                    console.log(ship.tech)
                    data.tech[ship.faction] += ship.tech;
                }
                ship.metal = 0;
                ship.tech = 0;
                ship.targetResource = data.getClosestResource(ship);
                if (ship.targetResource != null) {
                    ship.waypoint = Utility.getMidPoint(ship, ship.targetResource);
                    let angle = atan2(ship.targetResource.y - ship.y, ship.targetResource.x - ship.x) + 90;
                    ship.waypoint.x += 75 * cos(angle)
                    ship.waypoint.y += 75 * sin(angle);
                }
            }
        }        
    }

    doLaserAI(timepassed, data, ship) {

        if (ship.faction == 0) {
            this.mouseControls(ship);
        }
        ship.shooting.update(timepassed);

        if (ship.shooting.canShoot()) {
            let prevTarget = ship.shooting.target;
            ship.shooting.target = null;
            ship.shooting.target = this.getNearestShip(ship, data, ship.shooting.getRange(), false);
            if (prevTarget != ship.shooting.target) {
                ship.shooting.charge = 0;
            }
            ship.shooting.reset();
        }
        ship.velocity = {x: 0, y: 0};
        if (ship.shooting.target != null && ship.targetPos == null) {
            let distance = dist(ship.x, ship.y, ship.shooting.target.x, ship.shooting.target.y);
            if (distance < ship.shooting.getRange()) {
                //draw laser
                if (ship.shooting.charge < 1000) {
                    ship.shooting.charge += timepassed;
                } else {
                    ship.shooting.charge = 500;
                }
                let xOffset = 0;
                let yOffset = 0;
                if (ship.shooting.charge > 400) {
                    ship.shooting.target.hp.doDamage(1 * (timepassed/1000));
                    ship.shooting.aimOffset += timepassed;
                    if (ship.shooting.aimOffset < 360) {
                        ship.shooting.aimOffset -= 360;
                    }
                    xOffset = cos(ship.shooting.aimOffset) * 3;
                    yOffset = sin(ship.shooting.aimOffset) * 2;
                }
                let aim = {x: ship.shooting.target.x + xOffset, y: ship.shooting.target.y + yOffset};
                ship.rotateTo(aim, 100, 0);
                push();
                if (ship.faction == 0) {
                    stroke("#dd7ceb");
                } else {
                    stroke("#7ceb88");
                }
                strokeWeight(Math.floor(ship.shooting.charge/200));
                line(ex(ship.x),why(ship.y),ex(aim.x),why(aim.y));
                pop();

                let angle = atan2(ship.y - ship.shooting.target.y, ship.x - ship.shooting.target.x);
                angle += 4;
                let pos = {x: ship.shooting.target.x + (cos(angle)*(MIN_RANGE/2)), y: ship.shooting.target.y + (sin(angle)*(MIN_RANGE/2))};
                ship.moveTo(pos, ship.speedFactor);
                
            }
        }
        if (ship.faction > 0) {
            if (ship.shooting.target === null || ship.shooting.target.removed) {
                this.returnToRefinery(timepassed, data, ship);
            }
        }
    }

    doTorpedoAI(timepassed, data, ship) {

        if (ship.faction == 0) {
            this.mouseControls(ship);
        }
        ship.shooting.update(timepassed);

        if (ship.shooting.canShoot()) {
            ship.shooting.target = null;
            let target = this.getNearestShip(ship, data, ship.shooting.getRange(), false);
            if (target != null) {
                ship.shooting.target = target;
                ship.shooting.reset();
                data.createMissile(ship, target, 20);
                data.createMissile(ship, target, -20);
            }
        }

        if (ship.targetPos == null && ship.shooting.target != null) {
            let angle = Math.atan2(ship.y - ship.shooting.target.y, ship.x - ship.shooting.target.x);
            let pos = {x: ship.shooting.target.x + (Math.cos(angle)*(LONG_RANGE*0.75)), y: ship.shooting.target.y + (Math.sin(angle)*(LONG_RANGE*0.75))};
            if (dist(pos.x, pos.y, ship.x, ship.y) > 6) {
                ship.rotateTo(pos, 100, 0);
                ship.moveTo(pos, ship.speedFactor);
            } else {
                ship.vel = {x:0,y:0};
            }
            
        } else {
            ship.velocity = {x: 0, y: 0};
        }

        if (ship.faction > 0) {
            if (ship.shooting.target === null || ship.shooting.target.removed) {
                this.returnToRefinery(timepassed, data, ship);
            }
        }
    }
    
    doGunAI(timepassed, data, ship) {

        if (ship.faction == 0) {
            this.mouseControls(ship);
        }

        ship.shooting.update(timepassed);
        
        if (ship.targetPos == null) {
            ship.rotationSpeed = 0;
            ship.velocity = {x: 0, y: 0};
        }

        let gunPosX = ship.x - (cos(ship.rotation)) * 8;
        let gunPosY = ship.y - (sin(ship.rotation)) * 8;

        ship.gun.x = gunPosX;
        ship.gun.y = gunPosY;
        
        if (ship.shooting.canShoot()) {
            let prevTarget = ship.shooting.target;
            ship.shooting.target = this.getNearestShip(ship, data, ship.shooting.getRange(), true);
            ship.shooting.reset();

            if (ship.shooting.target != null) {
                ship.shooting.charge = 2;
            }

        }
        if (ship.shooting.target != null) {
            ship.gun.rotateTo(ship.shooting.target, 100);
            if (ship.shooting.charge > 0) {
                let prevCharge = ship.shooting.charge;
                ship.shooting.charge -= (timepassed/50);
                if (Math.ceil(ship.shooting.charge) != Math.ceil(prevCharge)) {
                    data.createBullet({x: gunPosX, y:gunPosY, faction:ship.faction}, ship.shooting.target);
                }
            }
        } else {
            ship.gun.rotation = ship.rotation;
        }

        if (ship.faction > 0) {
            if (ship.shooting.target === null || ship.shooting.target.removed) {
                this.returnToRefinery(timepassed, data, ship);
            }
        }
        
    }

    getNearestShip(ship, data, maxDistance, targetTorpedos) {
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
        if (targetTorpedos) {
            for (let i = 0; i < data.bullets.length; i++) {
                let torpedo = data.bullets[i]
                if (ship.faction != torpedo.faction) {
                    if (torpedo.type === "torpedo") {
                        let d = dist(ship.x, ship.y, torpedo.x, torpedo.y);
                        if (d < maxDistance) {
                            if (closestTarget == null || d < distance) {
                                closestTarget = torpedo;
                                distance = d;
                            }
                        }
                    }
                }
            }
        }
        return closestTarget;
    }

    mouseControls(ship) {
        if (Utility.safePressed("right") && ship.selected) {
            ship.targetPos = {x:exReverse(mouseX), y:whyReverse(mouseY)};
        }
        if (ship.targetPos != null) {
            if (ship.type == "laser") {
                if (ship.shooting.target == null) {
                    ship.rotation = ship.direction;
                }
            } else {
                ship.rotation = ship.direction;
            }
            
            let distanceToTravel = dist(ship.x,ship.y,ship.targetPos.x,ship.targetPos.y);
            if (distanceToTravel > (ship.img.width)) {
                ship.rotateTo(ship.targetPos, 10);
                ship.moveTo(ship.targetPos, ship.speedFactor);
            } else {
                ship.targetPos = null;
                ship.vel = {x:0,y:0};
            }
        } else {
            if (ship.type == "laser") {
                if (ship.shooting.target == null) {
                    ship.vel = {x:0,y:0};
                }
            } else if (ship.type == "torpedo") {
                if (ship.shooting.target == null) {
                    ship.vel = {x:0,y:0};
                }
            } else {
                ship.vel = {x:0,y:0};
            }
        }
    }

    drawRange(ship){

    }
}
