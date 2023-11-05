const COST = {
    DRONE: 1,
    LASER: 3,
    TORPEDO: 4,
    GUN: 3,
};

const MAIN_MENU = 0;
const SIDE_MENU = 1;
const OTHER_SIDE_MENU = 2;

class Menu {

    static BTN={
        h:50
    }

    constructor(x = 0, y = 0, w = 200, h = 240) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.current = MAIN_MENU;
        //prep the properties
        this.btns = {
            // control: {
            //     main: null,
            // },
            main: [],
        };
    }

    preload() {}

    setup(data) {
        // this.makeControlButtons();
        this.makeMainButtons(data);
    }

    costCheck(res, cost) {
        const debug = false;
        if (debug) {
            return true;
        }
        if (res >= cost) {
            return true;
        }
        return false
    }

    makeMainButtons() {
        //main buttons
        let offset_y = this.y + 40;
        this.btns.main.push(
            this.makeButton(this.x, offset_y, `> drone ${COST.DRONE}`, () => {
                if (this.costCheck(data.metals, COST.DRONE) === false) {
                    return false
                }
                data.metals -= COST.DRONE;
                data.drones.push(
                    data.factory.createDrone(
                        data.refinery.x + random(-180, 180),
                        data.refinery.y + random(-180, 180)
                    )
                );
            })
        );
        offset_y += Menu.BTN.h;

        this.btns.main.push(
            this.makeButton(this.x, offset_y, `> laser ${COST.LASER}`, () => {
                if (this.costCheck(data.metals, COST.LASER) === false) {
                    return false
                }
                data.metals -= COST.LASER;
                data.laser.push(
                    data.factory.createLaser(
                        data.refinery.x + random(-180, 180),
                        data.refinery.y + random(-180, 180)
                    )
                );
            })
        );
        offset_y += Menu.BTN.h;
        this.btns.main.push(
            this.makeButton(this.x, offset_y, `> torpedo ${COST.TORPEDO}`, () => {
                if (this.costCheck(data.metals, COST.TORPEDO) === false) {
                    return false
                }
                data.metals -= COST.TORPEDO;
                data.torpedo.push(
                    data.factory.createTorpedo(
                        data.refinery.x + random(-180, 180),
                        data.refinery.y + random(-180, 180)
                    )
                );
            })
        );
        offset_y += Menu.BTN.h;
        this.btns.main.push(
            this.makeButton(this.x, offset_y, `> gun ${COST.GUN}`, () => {
                if (this.costCheck(data.metals, COST.GUN) === false) {
                    return false
                }
                data.metals -= COST.GUN;
                data.gun.push(
                    data.factory.createGun(
                        data.refinery.x + random(-180, 180),
                        data.refinery.y + random(-180, 180)
                    )
                );
            })
        );
        offset_y += Menu.BTN.h;
    }

    makeButton(
        x = 0,
        y = 0,
        label,
        func = () => {
            console.log(`${label}`);
        }
    ) {
        let tempButton = createButton(label);
        tempButton.position(x, y);
        tempButton.mouseClicked(func);
        return tempButton;
    }

    hide(btns) {
        for (let btn of btns) {
            btn.hide();
        }
    }

    show(btns) {
        for (let btn of btns) {
            btn.show();
        }
    }

    update(data) {
        push();
        noStroke();
        fill(GUI.BLACK);
        rect(this.x, this.y, this.w, this.h);
        if (this.current === MAIN_MENU) {
            this.show(this.btns.main);
        }
        fill("yellow");
        textSize(32);
        text(`| metal: ${data.metals}`, this.x + 20, this.y + 30);
        pop();
    }
}
