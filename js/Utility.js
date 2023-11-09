class Utility {
    constructor() {}

    static getMidPoint(p1, p2) {
        let diffX = Utility.getDifference(p1.x, p2.x);
        let x = 0;
        if (p1.x < p2.x) {
            x = p1.x + (diffX / 2);
        } else {
            x = p2.x + (diffX / 2);
        }

        let diffY = Utility.getDifference(p1.y, p2.y);
        let y = 0;
        if (p1.y < p2.y) {
            y = p1.y + (diffY / 2);
        } else {
            y = p2.y + (diffY / 2);
        }
        return {x: x, y: y};
    }

    static getDifference(v1, v2) {
        if (v1 > v2) {
            return v1 - v2;
        } else {
            return v2 - v1;
        }
    }

    static turnTowards(angle1, angle2, amount) {

        let a1 = angle1;
        while(a1 < 0) {
            a1 += 360;
        }
        while(a1 >= 360) {
            a1 -= 360;
        }

        let a2 = angle2;
        while(a2 < 0) {
            a2 += 360;
        }
        while(a2 >= 360) {
            a2 -= 360;
        }
        
        let turnLeft = true;
        if (a1 > a2 && Utility.getDifference(a1, a2) > 180) {
            turnLeft = false;
        } else if (a1 < a2 && Utility.getDifference(a1, a2) < 180) {
            turnLeft = false;
        }
        let angle = a1;
        if (turnLeft) {
            angle -= amount;
        } else {
            angle += amount;
        }
        if (angle >= 360) {
            angle -= 360;
        } else if (angle < 0) {
            angle += 360;
        }
        
        return angle;
    }

    static distManhatten(v1, v2) {
        return getDifference(v1.x, v2.x) + getDifference(v1.y, v2.y);
    }

    static normaliseVector(x, y) {
        let length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return {x: x/length, y: y/length};
    }

    static getCircleEdge(x1, y1, x2, y2, radius) {
        let distance = dist(x1, y1, x2, y2);
        let percentage = radius/distance;
        let diffX = x1 - x2;
        let diffY = y1 - y2;
        return {x: x2 + (diffX * percentage), y: y2 + (diffY * percentage)};
    }

    static safePressing(button = "left") {
        //calculate if mouse within the menu
        const mouseIsRightOfLeftEdge = mouseX > menu.x;
        const mouseIsLeftOfRightEdge = mouseX < menu.x + menu.w;
        const mouseIsBelowTopEdge = mouseY > menu.y;
        const mouseIsAboveBottomEdge = mouseY < menu.y + menu.h;
    
        const mouseIsInside =
            mouseIsRightOfLeftEdge &&
            mouseIsLeftOfRightEdge &&
            mouseIsBelowTopEdge &&
            mouseIsAboveBottomEdge;
        if (mouseIsInside) {
            return false;
        }
        return mouse.pressing(button);
    }
    static safePresses(button = "left") {
        //calculate if mouse within the menu
        const mouseIsRightOfLeftEdge = mouseX > menu.x;
        const mouseIsLeftOfRightEdge = mouseX < menu.x + menu.w;
        const mouseIsBelowTopEdge = mouseY > menu.y;
        const mouseIsAboveBottomEdge = mouseY < menu.y + menu.h;
    
        const mouseIsInside =
            mouseIsRightOfLeftEdge &&
            mouseIsLeftOfRightEdge &&
            mouseIsBelowTopEdge &&
            mouseIsAboveBottomEdge;
        if (mouseIsInside) {
            return false;
        }
        return mouse.presses(button);
    }
    static safePressed(button = "left") {
        //calculate if mouse within the menu
        const mouseIsRightOfLeftEdge = mouseX > menu.x;
        const mouseIsLeftOfRightEdge = mouseX < menu.x + menu.w;
        const mouseIsBelowTopEdge = mouseY > menu.y;
        const mouseIsAboveBottomEdge = mouseY < menu.y + menu.h;

        const mouseOnMinimapLeftEdge = mouseX > Minimap.positionX;
        const mouseOnMinimapRightEdge = mouseX < Minimap.positionXEnd;
        const mouseOnMinimapTopEdge = mouseY > Minimap.positionY;
        const mouseOnMinimapBottomEdge = mouseY < Minimap.positionYEnd;
    
        const mouseIsInside =
            mouseIsRightOfLeftEdge &&
            mouseIsLeftOfRightEdge &&
            mouseIsBelowTopEdge &&
            mouseIsAboveBottomEdge;

        const mouseIsInsideMinimap =
            mouseOnMinimapLeftEdge &&
            mouseOnMinimapRightEdge &&
            mouseOnMinimapTopEdge &&
            mouseOnMinimapBottomEdge;
            
        if (mouseIsInside || mouseIsInsideMinimap) {
            return false;
        }
        return mouse.pressed(button);
    }
}