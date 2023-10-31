const MAIN_MENU = 0;
const SIDE_MENU = 1;
const OTHER_SIDE_MENU = 2;

class Menu {
    constructor(x = 0, y = 0, w = 200, h = 400) {
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

    // makeControlButtons() {
    //     let offset_x = this.x + 10;
    //     let offset_y = this.y + 0;
    //     this.btns.control.main = this.makeButton(
    //         offset_x,
    //         offset_y,
    //         "Main ",
    //         () => {
    //             this.current = 0;
    //         }
    //     );
    //     offset_x += 50;
    // }

    makeMainButtons() {
        //main buttons
        let offset_y = this.y + 40;
        this.btns.main.push(
            this.makeButton(this.x, offset_y, "drone", () => {
                data.drones.push(
                    data.factory.createDrone(
                        900 + random(-180, 180),
                        450 + random(-180, 180)
                    )
                );
            })
        );
        offset_y += 40;

        this.btns.main.push(
            this.makeButton(this.x, offset_y, "laser", () => {
                data.laser.push(
                    data.factory.createLaser(
                        900 + random(-180, 180),
                        450 + random(-180, 180)
                    )
                );
            })
        );
        offset_y += 40;
        this.btns.main.push(
            this.makeButton(this.x, offset_y, "torpedo", () => {
                data.torpedo.push(
                    data.factory.createTorpedo(
                        900 + random(-180, 180),
                        450 + random(-180, 180)
                    )
                );
            })
        );
        offset_y += 40;
        this.btns.main.push(
            this.makeButton(this.x, offset_y, "gun", () => {
                data.gun.push(
                    data.factory.createGun(
                        900 + random(-180, 180),
                        450 + random(-180, 180)
                    )
                );
            })
        );
        offset_y += 40;
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

    draw(data) {
        push();
        noStroke();
        fill(50 + 77 * this.current);
        rect(this.x, this.y, this.w, this.h);
        if (this.current === MAIN_MENU) {
            this.show(this.btns.main);
        }
        fill("black");
        textSize(32);
        text(`🪨${data.metals}`, this.x + 20, this.y + 300);
        pop();
    }
}
