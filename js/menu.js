const COST = {
    DRONE: 1,
    GUN: 3,
    TORPEDO: 4,
    LASER: 5,
};

class Menu {
    static ICO_SIZE = 50;
    static BTN = {
        h: 50,
    };

    static DRONE_ACTIVE=true;
    static TORPEDO_ACTIVE=false;
    static GUN_ACTIVE=false;
    static LASER_ACTIVE=false;

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
        this.visuals.drone = {
            active: loadAnimation(
                "./3d/drone/output/0000.png",
                "./3d/drone/output/0001.png",
                "./3d/drone/output/0002.png",
                "./3d/drone/output/0003.png",
                "./3d/drone/output/0004.png",
                "./3d/drone/output/0005.png",
                "./3d/drone/output/0006.png",
                "./3d/drone/output/0007.png"
            ),
            inactive: loadAnimation("./assets/img/gray_drone.png"),
        };

        this.visuals.laser = {
            active: loadAnimation(
                "./3d/laser/output/0000.png",
                "./3d/laser/output/0001.png",
                "./3d/laser/output/0002.png",
                "./3d/laser/output/0003.png",
                "./3d/laser/output/0004.png",
                "./3d/laser/output/0005.png",
                "./3d/laser/output/0006.png",
                "./3d/laser/output/0007.png"
            ),
            inactive: loadAnimation("./assets/img/gray_laser.png"),
        };

        this.visuals.gun = {
            active: loadAnimation(
                "./3d/gun/output/0000.png",
                "./3d/gun/output/0001.png",
                "./3d/gun/output/0002.png",
                "./3d/gun/output/0003.png",
                "./3d/gun/output/0004.png",
                "./3d/gun/output/0005.png",
                "./3d/gun/output/0006.png",
                "./3d/gun/output/0007.png"
            ),
            inactive: loadAnimation("./assets/img/gray_gun.png"),
        };

        this.visuals.torpedo = {
            active: loadAnimation(
                "./3d/torpedo/output/0004.png",
                "./3d/torpedo/output/0005.png",
                "./3d/torpedo/output/0006.png",
                "./3d/torpedo/output/0007.png",
                "./3d/torpedo/output/0000.png",
                "./3d/torpedo/output/0001.png",
                "./3d/torpedo/output/0002.png",
                "./3d/torpedo/output/0003.png"
            ),
            inactive: loadAnimation("./assets/img/gray_torpedo.png"),
        };
        this.visuals.topFrame = loadImage("./assets/img/topFrame.png");
    }

    setup(data) {
        Menu.ICO_SIZE = 75;
        // this.makeControlButtons();
        this.makeMainButtons(data);
        this.shipAnimSetup(this.visuals.drone);
        this.shipAnimSetup(this.visuals.laser);
        this.shipAnimSetup(this.visuals.torpedo);
        this.shipAnimSetup(this.visuals.gun);
    }

    shipAnimSetup(shipAnim) {
        shipAnim.active.scale = 0.2;
        shipAnim.active.frameDelay = 12;
        shipAnim.active.stop();
        shipAnim.inactive.scale = 0.2;
        shipAnim.inactive.frameDelay = 12;
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
                `> ${COST.DRONE} drone `,
                () => {
                    if (data.factory.ship_counter[0] >= data.POP_CAP[0]) {
                        return false;
                    }
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
                `> ${COST.GUN} gun `,
                () => {
                    if (data.factory.ship_counter[0] >= data.POP_CAP[0]) {
                        return false;
                    }
                    if (this.costCheck(data.metals[0], COST.GUN) === false) {
                        return false;
                    }
                    data.metals[0] -= COST.GUN;
                    data.gun.push(
                        data.factory.createGun(
                            data.refinery.x + random(-180, 180),
                            data.refinery.y + random(-180, 180),
                            0,
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
                `> ${COST.TORPEDO} torpedo`,
                () => {
                    if (data.factory.ship_counter[0] >= data.POP_CAP[0]) {
                        return false;
                    }
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
                            0,
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
                `> ${COST.LASER} laser `,
                () => {
                    if (data.factory.ship_counter[0] >= data.POP_CAP[0]) {
                        return false;
                    }
                    if (this.costCheck(data.metals[0], COST.LASER) === false) {
                        return false;
                    }
                    data.metals[0] -= COST.LASER;
                    data.laser.push(
                        data.factory.createLaser(
                            data.refinery.x + random(-180, 180),
                            data.refinery.y + random(-180, 180),
                            0,
                            data.refinery
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
        tempButton.startX = x;
        tempButton.startY = y;
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

    fancyButton(button, anim, isActive,progress=23) {
        const OFFSET = 10000;

        if (isActive) {
            button.position(button.startX, button.startY);
            if (this.buttonIsHovered(button, mouseX, mouseY)) {
                anim.active.loop();
            } else {
                anim.active.frame = 0;
                anim.active.stop();
            }
            animation(anim.active, button.x - 30, button.y + 25);
        } else {
            button.position(-OFFSET, -OFFSET);
            fill(GUI.BLACK);
            rect(
                button.startX - Menu.ICO_SIZE,
                button.startY,
                button.width + Menu.ICO_SIZE,
                button.height
            );
            fill(GUI.YELLOW)
            let progressWidth=map(progress,0,100,0,button.width);
            rect(
                button.startX,
                button.startY,
                progressWidth,
                button.height
                )
            fill(GUI.BLACK);
            textSize(20);
            textAlign(CENTER,CENTER);
            text(`${progress}%`,button.startX,button.startY,button.width,button.height);
            animation(anim.inactive, button.startX - 30, button.startY + 25);
        }
    }

    update(data) {
        push();

        //process tech
        if(data.tech[0]>3){
            Menu.GUN_ACTIVE=true;
        }
        if(data.tech[0]>6){
            Menu.TORPEDO_ACTIVE=true;
        }
        if(data.tech[0]>9){
            Menu.LASER_ACTIVE=true;
        }

        //process metal
        noStroke();
        fill(GUI.BLACK);
        rect(this.x, this.y, this.w + 100, this.h);
        fill("yellow");
        textSize(32);
        text(
            `metal ${Math.floor(data.metals[0])}`,
            this.x + 20,
            this.y + 30
        );

        //process popcap
        textAlign(RIGHT,CENTER);
        textSize(24);
        text(
            `ships ${data.factory.ship_counter[0]}/${data.POP_CAP[0]}`,
            this.x + 20,
            this.y+18,
            this.w+40
        );

        //process buttons
        this.fancyButton(this.btns.main[0], this.visuals.drone, Menu.DRONE_ACTIVE);
        this.fancyButton(this.btns.main[1], this.visuals.gun, Menu.GUN_ACTIVE,23);
        this.fancyButton(this.btns.main[2], this.visuals.torpedo, Menu.TORPEDO_ACTIVE,54);
        this.fancyButton(this.btns.main[3], this.visuals.laser, Menu.LASER_ACTIVE,33);

        
        image(this.visuals.topFrame, gui.minimap.width - 80, -8);
        pop();
    }
}
