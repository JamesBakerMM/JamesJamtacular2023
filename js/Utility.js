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