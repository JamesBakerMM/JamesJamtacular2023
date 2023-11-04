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
            const current = ship.hp.getCurrent();
            const max = ship.hp.getMax();
            fill("red");
            rect(ship.x,ship.y,GUI.HP.W,GUI.HP.H)
        } else {
            fill("red");
            stroke("black")
            rectMode(CENTER);
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
