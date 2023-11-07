"use strict"

class GUI {
    static YELLOW="#f5bb00";
    static BLACK="#030219";
    static GREY="#221e20";
    static GRAY=GUI.GREY;
    static visuals={};
    static FONT;

    static HP={
        W:100,
        H:20
    }

    constructor(menu) {
        this.minimap = new Minimap();
        this.menu=menu;
        this.visuals={}
    }

    preload() {
        GUI.FONT=loadFont("./assets/fonts/VT323-Regular.ttf");
        GUI.visuals.mapFrame=loadImage("./assets/img/miniMapframe.png");
    }

    setup() {
        textFont(GUI.FONT);
    }

    createGuiSprite(x,y){
        let obj = new Sprite(x,y);
        obj.type="gui"
        obj.collider="none";
        obj.debug=true;
        obj.width=this.minimap.width;
        obj.height=this.minimap.height;
        return obj1
    }

    updatePre(data) {
        push();
        for(let ship of data.ships){
            this.shipRange(ship);
            this.shipSelection(ship);
        }
        pop();
    }

    updatePost(data) {
        this.minimap.update(data);
        push();
        for(let ship of data.ships){
            this.hpBar(ship);
        }
        pop();
    }

    superDraw(data) {
        this.minimap.draw(data);
    }

    hpBar(ship) {
        if(ship.hp!==undefined){
            const current = ship.hp.getHealth();
            const max = ship.hp.getMaxHealth();
            let rectSize=map(current,0,max,0,GUI.HP.W);
            stroke("black");
            fill("red");
            rect(ex(ship.x-ship.img.w/2),why(ship.y+ship.img.h),GUI.HP.W,GUI.HP.H);
            fill("yellow");
            rect(ex(ship.x-ship.img.w/2),why(ship.y+ship.img.h),rectSize,GUI.HP.H);

        } else {
            fill("red");
            rect(ex(ship.x),why(ship.y+ship.img.h),GUI.HP.W,GUI.HP.H);
        }
    }

    shipRange(ship) {
        noFill();
        stroke(255, 255, 255, 100);
        ellipse(ex(ship.x), why(ship.y), ship.range);
    }

    shipSelection(ship) {
        if (ship.selected) {
            noStroke();
            fill("white");
            ellipse(ex(ship.x), why(ship.y), ship.img.width * 1.5);
        }
    }
}
