"use strict";

class GUI {
    static YELLOW = [245,187,0,255];
    static HALF_YELLOW = [245,187,0,100];
    static RED = "#b14c54";
    static BLUE = "#60bef1";
    static BLACK = "#030219";
    static GREY = "#221e20";
    static GREEN = "#00FF00";
    static GRAY = GUI.GREY;
    static visuals = {};
    static FONT;
    static FAC_COLOURS=[
        GUI.YELLOW,
        GUI.BLUE,
        GUI.RED,
        GUI.GREEN
    ];

    static HP = {
        W: 100,
        H: 20,
    };

    constructor(menu) {
        this.minimap = new Minimap();
        this.menu = menu;
        this.visuals = {};
    }

    preload() {
        GUI.FONT = loadFont("./assets/fonts/VT323-Regular.ttf");
        GUI.visuals.mapFrame = loadImage("./assets/img/miniMapframe.png");
    }

    setup() {
        textFont(GUI.FONT);
    }

    createGuiSprite(x, y) {
        let obj = new Sprite(x, y);
        obj.type = "gui";
        obj.collider = "none";
        obj.debug = true;
        obj.width = this.minimap.width;
        obj.height = this.minimap.height;
        return obj1;
    }

    updatePre(data) {
        push();
        for (let ship of data.ships) {
            if(ship.type.includes("refinery")){
                this.shipRange(ship);
            }
            this.shipMotion(ship);
            this.shipSelection(ship);
            if(ship.visible===false){
                this.drawMetalPing(ship.x,ship.y);
            }
        }
        for(let resource of data.universe.resources){
            
            if(resource.visible===false && resource.type==="wreckage"){
                this.drawMetalPing(resource.x,resource.y);
            }
            if(resource.visible===false && resource.type==="metal"){
                this.drawRockPing(resource.x,resource.y,resource.diameter);
            }
        }
        pop();
    }

    updatePost(data) {
        this.minimap.update(data);
        push();
        for (let ship of data.ships) {
            this.hpBar(ship);
        }
        pop();
    }

    superDraw(data) {
        this.minimap.draw(data);
    }

    hpBar(ship) {
        if (ship.hp !== undefined && ship.visible) {
            const current = ship.hp.getHealth();
            const max = ship.hp.getMaxHealth();
            noStroke();
            fill(GUI.BLACK);
            let rectH=GUI.HP.H/2;
            let rectW=GUI.HP.W/2;
            if(ship.type.includes("refinery")) {
                rectH=GUI.HP.H;
                rectW=GUI.HP.W;
            }
            rect(
                ex(ship.x - ship.img.w / 2),
                why(ship.y + ship.img.h),
                rectW,
                rectH
            );
            let rectSize = map(current, 0, max, 0, rectW);
            fill(GUI.FAC_COLOURS[ship.faction]);
            rect(
                ex(ship.x - ship.img.w / 2),
                why(ship.y + ship.img.h),
                rectSize,
                rectH
            );
        }
    }

    shipRange(ship) {
        if(ship.visible){
            noFill();
            stroke(255, 255, 255, 100);
            ellipse(ex(ship.x), why(ship.y), ship.range);
        }
    }

    shipMotion(ship) {
        if (ship.faction !== 0) {
            return null;
        }
        noFill();
        if (ship.targetResource) {
            push();
            let pos = Utility.getCircleEdge(
                ship.x,
                ship.y,
                ship.targetResource.x,
                ship.targetResource.y,
                ship.targetResource.radius
            );
            stroke(GUI.HALF_YELLOW);
            strokeWeight(2);
            line(ex(ship.x), why(ship.y), ex(pos.x), why(pos.y));
            stroke(GUI.YELLOW);
            fill(0, 0, 0, 200);
            ellipse(
                ex(ship.targetResource.x),
                why(ship.targetResource.y),
                ship.targetResource.diameter
            );
            fill(GUI.YELLOW);
            noStroke();

            const jobTagX=ex(ship.targetResource.x + ship.targetResource.diameter / 2 + 20)

            text(
                `Job #${ship.targetResource.idNum}\nReturns: ${int(ship.targetResource.metal)}`,
                jobTagX,
                why(ship.targetResource.y)
            );
            fill(GUI.BLACK);
            rectMode(CORNER)
            rect(
                ex(ship.x+20),
                why(ship.y-9),
                20,
                10
            );
            fill(GUI.YELLOW);
            text(`#${ship.targetResource.idNum}`, ex(ship.x + 20), why(ship.y));
            pop();
            return;
        }
        if (ship.targetPos) {
            push();

            let pos = Utility.getCircleEdge(
                ship.x,
                ship.y,
                ship.targetPos.x,
                ship.targetPos.y,
                30
            );
            stroke(GUI.HALF_YELLOW);
            strokeWeight(3);
            line(ex(ship.x), why(ship.y), ex(pos.x), why(pos.y));
            stroke(GUI.YELLOW);
            fill(0,0,0,210);
            ellipse(ex(ship.targetPos.x), why(ship.targetPos.y), 60);
            textAlign(CENTER,CENTER);
            noStroke();
            fill(GUI.HALF_YELLOW);
            let distFeedback=int(dist(ex(ship.x),why(ship.y),ex(ship.targetPos.x),why(ship.targetPos.y)));
            text(distFeedback,ex(ship.targetPos.x), why(ship.targetPos.y));
            pop();
        }
    }

    drawMotionTarget(msg, x, y, diameter) {
        stroke(GUI.YELLOW);
        fill(0, 0, 0, 200);
        ellipse(ex(x), why(y), diameter + 20);
        fill(GUI.YELLOW);
        noStroke();
        text(msg, x, y);
    }

    shipSelection(ship) {
        if (ship.selected) {
            ``;
            noStroke();
            fill("white");
            ellipse(ex(ship.x), why(ship.y), ship.img.width * 1.5);
        }
    }

    drawRockPing(x,y,size){
        push();
        fill(GUI.HALF_YELLOW);
        const pulse = abs(frameCount%100);
        const pulse_inner = abs(frameCount%112.5);
        noFill();
        stroke(GUI.YELLOW);
        fill(GUI.HALF_YELLOW);
        ellipse(ex(x),why(y),size);
        pop();
    }

    drawMetalPing(x,y){
        push();
            const pulse = abs(frameCount%100);
            const pulse_inner = abs(frameCount%112.5);
            noFill();
            stroke(Minimap.BLUE_PING);
            ellipse(ex(x),why(y),-50+pulse);
            ellipse(ex(x),why(y),-56.25+pulse_inner);
            fill(Minimap.BLUE_PING);
            ellipse(ex(x),why(y),40);
        pop();
    }
}
