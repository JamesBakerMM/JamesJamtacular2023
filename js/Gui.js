class GUI {
    static HP={
        W:100,
        H:20
    }
    constructor() {}
    preload() {}
    setup() {}
    update(data) {
        push();
        for(let ship of data.ships){
            this.shipRange(ship);
            this.shipSelection(ship);
            this.hpBar(ship);1
        }
        pop();
    }
    hpBar(ship) {
        if(ship.hp!==undefined){
            const current = ship.hp.getHealth();
            const max = ship.hp.getMaxHealth();
            let rectSize=map(current,0,max,0,GUI.HP.W)
            stroke("black")
            fill("red");
            rect(ex(ship.x-ship.img.w/2),why(ship.y+ship.img.h),GUI.HP.W,GUI.HP.H)
            fill("yellow");
            rect(ex(ship.x-ship.img.w/2),why(ship.y+ship.img.h),rectSize,GUI.HP.H)

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
