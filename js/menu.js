const COST = {
    DRONE: 1,
    LASER: 3,
    TORPEDO: 4,
    GUN: 3,
};

class Menu {
    static ICO_SIZE = 50;
    static BTN = {
        h: 50,
    };

    constructor(x = 0, y = 0, w = 200, h = 240) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        //prep the properties
        this.btns = {
            // control: {
            //     main: null,
            // },
            main: [],
        };
        this.visuals = {};
    }

    preload() {
        this.visuals.drone = loadAnimation(
            "./3d/drone/output/0000.png",
            "./3d/drone/output/0001.png",
            "./3d/drone/output/0002.png",
            "./3d/drone/output/0003.png",
            "./3d/drone/output/0004.png",
            "./3d/drone/output/0005.png",
            "./3d/drone/output/0006.png",
            "./3d/drone/output/0007.png"
        );
        this.visuals.torpedo = loadAnimation(
            "./3d/torpedo/output/0004.png",
            "./3d/torpedo/output/0005.png",
            "./3d/torpedo/output/0006.png",
            "./3d/torpedo/output/0007.png",
            "./3d/torpedo/output/0000.png",
            "./3d/torpedo/output/0001.png",
            "./3d/torpedo/output/0002.png",
            "./3d/torpedo/output/0003.png"
        );
        this.visuals.laser = loadAnimation(
            "./3d/laser/output/0000.png",
            "./3d/laser/output/0001.png",
            "./3d/laser/output/0002.png",
            "./3d/laser/output/0003.png",
            "./3d/laser/output/0004.png",
            "./3d/laser/output/0005.png",
            "./3d/laser/output/0006.png",
            "./3d/laser/output/0007.png"
        );
        this.visuals.gun = loadAnimation(
            "./3d/gun/output/0000.png",
            "./3d/gun/output/0001.png",
            "./3d/gun/output/0002.png",
            "./3d/gun/output/0003.png",
            "./3d/gun/output/0004.png",
            "./3d/gun/output/0005.png",
            "./3d/gun/output/0006.png",
            "./3d/gun/output/0007.png"
        );
        Menu.ICO_SIZE = 75;
        this.visuals.topFrame = loadImage("./assets/img/topFrame.png");
    }

    setup(data) {
        // this.makeControlButtons();
        this.makeMainButtons(data);
        this.shipAnimSetup(this.visuals.drone);
        this.shipAnimSetup(this.visuals.laser);
        this.shipAnimSetup(this.visuals.torpedo);
        this.shipAnimSetup(this.visuals.gun);
    }

    shipAnimSetup(shipAnim) {
        shipAnim.scale = 0.2;
        shipAnim.frameDelay = 12;
        shipAnim.stop();
    }
    costCheck(res, cost) {
        const debug = false;
        if (debug) {
            return true;
        }
        if (res >= cost) {
            return true;
        }
        return false;
    }

    makeMainButtons() {
        //main buttons
        let offset_y = this.y + 40;
        this.btns.main.push(
            this.makeButton(
                this.x + Menu.ICO_SIZE,
                offset_y,
                `> drone ${COST.DRONE}`,
                () => {
                    if (this.costCheck(data.metals[0], COST.DRONE) === false) {
                        return false;
                    }
                    data.metals[0] -= COST.DRONE;
                    data.drones.push(
                        data.factory.createDrone(
                            data.refinery.x + random(-180, 180),
                            data.refinery.y + random(-180, 180),
                            data.refinery
                        )
                    );
                }
            )
        );
        offset_y += Menu.BTN.h;

        this.btns.main.push(
            this.makeButton(
                this.x + Menu.ICO_SIZE,
                offset_y,
                `> laser ${COST.LASER}`,
                () => {
                    if (this.costCheck(data.metals[0], COST.LASER) === false) {
                        return false;
                    }
                    data.metals[0] -= COST.LASER;
                    data.laser.push(
                        data.factory.createLaser(
                            data.refinery.x + random(-180, 180),
                            data.refinery.y + random(-180, 180),
                            0
                        )
                    );
                }
            )
        );
        offset_y += Menu.BTN.h;
        this.btns.main.push(
            this.makeButton(
                this.x + Menu.ICO_SIZE,
                offset_y,
                `> torpedo ${COST.TORPEDO}`,
                () => {
                    if (
                        this.costCheck(data.metals[0], COST.TORPEDO) === false
                    ) {
                        return false;
                    }
                    data.metals[0] -= COST.TORPEDO;
                    data.torpedo.push(
                        data.factory.createTorpedo(
                            data.refinery.x + random(-180, 180),
                            data.refinery.y + random(-180, 180),
                            0
                        )
                    );
                }
            )
        );
        offset_y += Menu.BTN.h;
        this.btns.main.push(
            this.makeButton(
                this.x + Menu.ICO_SIZE,
                offset_y,
                `> gun ${COST.GUN}`,
                () => {
                    if (this.costCheck(data.metals[0], COST.GUN) === false) {
                        return false;
                    }
                    data.metals[0] -= COST.GUN;
                    data.gun.push(
                        data.factory.createGun(
                            data.refinery.x + random(-180, 180),
                            data.refinery.y + random(-180, 180),
                            0
                        )
                    );
                }
            )
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

    buttonIsHovered(button, x, y) {
        let buttonX = button.position().x;
        let buttonY = button.position().y;
        let buttonWidth = button.size().width;
        let buttonHeight = button.size().height;

        if (
            x > buttonX &&
            x < buttonX + buttonWidth &&
            y > buttonY &&
            y < buttonY + buttonHeight
        ) {
            return true;
        }

        return false;
    }

    fancyButton(button,anim){
        if(this.buttonIsHovered(button,mouseX,mouseY)){
            anim.loop();
        } else {
            anim.frame=0;
            anim.stop();
        }
    }

    update(data) {
        push();
        noStroke();
        fill(GUI.BLACK);
        rect(this.x, this.y, this.w + 100, this.h);
        fill("yellow");
        textSize(32);
        text(
            `| metal: ${Math.floor(data.metals[0])}`,
            this.x + 20,
            this.y + 30
        );

        //console.log(this.btns.main[0]);
        //drone button
        this.fancyButton(this.btns.main[0],this.visuals.drone);
        this.fancyButton(this.btns.main[1],this.visuals.laser);
        this.fancyButton(this.btns.main[2],this.visuals.torpedo);
        this.fancyButton(this.btns.main[3],this.visuals.gun);

        animation(
            this.visuals.drone,
            this.btns.main[0].x - 30,
            this.btns.main[0].y + 25
        );
        animation(
            this.visuals.laser,
            this.btns.main[1].x - 30,
            this.btns.main[1].y + 25
        );
        animation(
            this.visuals.torpedo,
            this.btns.main[2].x - 30,
            this.btns.main[2].y + 25
        );
        animation(
            this.visuals.gun,
            this.btns.main[3].x - 30,
            this.btns.main[3].y + 25
        );
        image(this.visuals.topFrame, gui.minimap.width - 80, -8);
        pop();
    }
}
