class Minimap {
    
    constructor() {

        this.borderPadding = 6;
        this.halfBorder = this.borderPadding/2;

        this.worldX = 0 + this.halfBorder;
        this.worldXEnd = 5000 + this.halfBorder;
        this.worldY = 0 + this.halfBorder;
        this.worldYEnd = 5000 + this.halfBorder;

        this.positionX = 0 + this.halfBorder;
        this.positionXEnd = 300 + this.halfBorder;
        this.positionY = 600 - this.halfBorder;
        this.positionYEnd = 900 - this.halfBorder;

        this.width = Utility.getDifference(this.positionX, this.positionXEnd);
        this.height = Utility.getDifference(this.positionY, this.positionYEnd);
    }

    update(data) {
        push();
        noStroke();

        //do mouse handling here
        if (mouse.pressing('left')) {
            if (mouseX > this.positionX && mouseX < this.positionXEnd &&
                mouseY > this.positionY && mouseY < this.positionYEnd) {
                    cameraGood.x = this.minimapToWorldPixelX(mouseX);
                    cameraGood.y = this.minimapToWorldPixelY(mouseY);
            }
        }

        //background
        fill(0, 0, 0, 255);
        rect(this.positionX, this.positionY, this.width, this.height);

        //resources
        fill(255, 0, 255, 255);
        for(let i = 0; i < data.resources.length; i++) {
            let res = data.resources[i];
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
                x = this.positionX;
            }
            if (y == null) {
                y = this.positionY;
            }
            if (x2 == null) {
                x2 = this.positionXEnd;
            }
            if (y2 == null) {
                y2 = this.positionYEnd;
            }
    
            rect(x, y, x2-x, y2-y);
        }

        //frame
        stroke(255,255,255,255);
        strokeWeight(this.borderPadding);
        noFill();
        rect(this.positionX, this.positionY, this.width, this.height);

        pop();
    }

    worldToMinimapPixelX(value) {
        if (value < this.worldX || value > this.worldXEnd) {
            return null;
        }

        let difference = Utility.getDifference(this.worldX, this.worldXEnd);
        let difference2 = Utility.getDifference(this.worldX, value);
        let percentage = difference2 / difference;

        let miniX = (this.positionX) + (percentage * this.width);
        return miniX;
    }

    worldToMinimapPixelY(value) {
        if (value < this.worldY || value > this.worldYEnd) {
            return null;
        }

        let difference = Utility.getDifference(this.worldY, this.worldYEnd);
        let difference2 = Utility.getDifference(this.worldY, value);
        let percentage = difference2 / difference;

        let miniY = (this.positionY) + (percentage * this.height);
        return miniY;
    }

    minimapToWorldPixelX(value) {
        let difference = Utility.getDifference(this.positionX, value);
        let percentage = difference / this.width;
        let newX = this.worldX + (percentage * Utility.getDifference(this.worldX, this.worldXEnd));
        newX = newX - (width/2);
        return newX;
    }

    minimapToWorldPixelY(value) {
        let difference = Utility.getDifference(this.positionY, value);
        let percentage = difference / this.height;
        let newY = this.worldY + (percentage * Utility.getDifference(this.worldY, this.worldYEnd));
        newY = newY - (height/2);
        return newY
    }
}