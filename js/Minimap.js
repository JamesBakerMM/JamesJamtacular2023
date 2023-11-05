class Minimap {
    
    static borderPadding = 6;
    static halfBorder = Minimap.borderPadding/2;
    static positionX = 0 + Minimap.halfBorder;
    static positionXEnd = 300 + Minimap.halfBorder;
    static positionY = 600 - Minimap.halfBorder;
    static positionYEnd = 900 - Minimap.halfBorder;

    constructor() {        

        this.worldX = 0 + Minimap.halfBorder;
        this.worldXEnd = 5000 + Minimap.halfBorder;
        this.worldY = 0 + Minimap.halfBorder;
        this.worldYEnd = 5000 + Minimap.halfBorder;

        this.width = Utility.getDifference(Minimap.positionX, Minimap.positionXEnd);
        this.height = Utility.getDifference(Minimap.positionY, Minimap.positionYEnd);
    }

    update(data) {
        push();
        noStroke();

        //do mouse handling here
        if (mouseX > Minimap.positionX && mouseX < Minimap.positionXEnd &&
            mouseY > Minimap.positionY && mouseY < Minimap.positionYEnd) {
            if (mouse.pressing('left')) {
                cameraGood.x = this.minimapToWorldPixelX(mouseX) - (width/2);
                cameraGood.y = this.minimapToWorldPixelY(mouseY) - (height/2);
            }
            if (mouse.pressing('right')) {
                for(let i = 0; i < data.ships.length; i++) {
                    let ship = data.ships[i];
                    if (ship.selected) {
                        ship.targetPos = {x:this.minimapToWorldPixelX(mouseX), y:this.minimapToWorldPixelY(mouseY)};
                    }
                }
            }
        }

        //background
        fill(0, 0, 0, 255);
        rect(Minimap.positionX, Minimap.positionY, this.width, this.height);

        //resources
        fill(255, 0, 255, 255);
        for(let i = 0; i < data.universe.resources.length; i++) {
            let res = data.universe.resources[i];
            let x = this.worldToMinimapPixelX(res.x);
            let y = this.worldToMinimapPixelY(res.y);
            if (x != null && y != null) {
                let scale = res.scale;
                circle(x, y, 1.5 * scale);
            }
        }

        //ships
        for(let i = 0; i < data.ships.length; i++) {
            let ship = data.ships[i];
            let x = this.worldToMinimapPixelX(ship.x);
            let y = this.worldToMinimapPixelY(ship.y);
            if (x != null && y != null) {

                if (ship.faction == 0) {
                    fill(255, 255, 0, 255);
                } else {
                    fill(255, 0, 0, 255);
                }

                if (ship.selected) {
                    fill(255, 255, 255, 255);
                }

                let scale = ship.width / 20;
                rect(x, y, 2 * scale, 2 * scale);
            }
        }

        //screen pos
        stroke(255,255,255,255);
        strokeWeight(2);
        noFill();

        let x = this.worldToMinimapPixelX(cameraGood.x);
        let y = this.worldToMinimapPixelY(cameraGood.y);
        let x2 = this.worldToMinimapPixelX(cameraGood.x + width);
        let y2 = this.worldToMinimapPixelY(cameraGood.y + height);

        if ((x != null || x2 != null) && (y != null || y2 != null)) {
            if (x == null) {
                x = Minimap.positionX;
            }
            if (y == null) {
                y = Minimap.positionY;
            }
            if (x2 == null) {
                x2 = Minimap.positionXEnd;
            }
            if (y2 == null) {
                y2 = Minimap.positionYEnd;
            }
    
            rect(x, y, x2-x, y2-y);
        }

        //frame
        stroke(255,255,255,255);
        strokeWeight(Minimap.borderPadding);
        noFill();
        rect(Minimap.positionX, Minimap.positionY, this.width, this.height);

        pop();
    }

    worldToMinimapPixelX(value) {
        if (value < this.worldX || value > this.worldXEnd) {
            return null;
        }

        let difference = Utility.getDifference(this.worldX, this.worldXEnd);
        let difference2 = Utility.getDifference(this.worldX, value);
        let percentage = difference2 / difference;

        let miniX = (Minimap.positionX) + (percentage * this.width);
        return miniX;
    }

    worldToMinimapPixelY(value) {
        if (value < this.worldY || value > this.worldYEnd) {
            return null;
        }

        let difference = Utility.getDifference(this.worldY, this.worldYEnd);
        let difference2 = Utility.getDifference(this.worldY, value);
        let percentage = difference2 / difference;

        let miniY = (Minimap.positionY) + (percentage * this.height);
        return miniY;
    }

    minimapToWorldPixelX(value) {
        let difference = Utility.getDifference(Minimap.positionX, value);
        let percentage = difference / this.width;
        return this.worldX + (percentage * Utility.getDifference(this.worldX, this.worldXEnd));
    }

    minimapToWorldPixelY(value) {
        let difference = Utility.getDifference(Minimap.positionY, value);
        let percentage = difference / this.height;
        return this.worldY + (percentage * Utility.getDifference(this.worldY, this.worldYEnd));
    }
}