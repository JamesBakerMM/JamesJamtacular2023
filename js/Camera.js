class Camera {

    static MAX_SHAKE_TIME = 500;
    static MAX_SHAKE_X = 2;
    static MAX_SHAKE_Y = 2;
    static SCROLL_SPEED = 0.2;
    static SCROLL_EDGE_SIZE = 0.02;

    constructor() {
        this.x = 0;
        this.y = 0;

        this.shakeX = 0;
        this.shakeY = 0;
        this.shakeTime = 0;
    }

    update(timepassed) {

        //Camera Controls
        
        let edgeW = width * Camera.SCROLL_EDGE_SIZE;
        let edgeH = height * Camera.SCROLL_EDGE_SIZE;
        if (kb.pressing('arrowUp')) {
            cameraGood.y -= timepassed * Camera.SCROLL_SPEED;
        }
        if (kb.pressing('arrowDown')) {
            cameraGood.y += timepassed * Camera.SCROLL_SPEED;
        }
        if (kb.pressing('arrowLeft')) {
            cameraGood.x -= timepassed * Camera.SCROLL_SPEED;
        }
        if (kb.pressing('arrowRight')) {
            cameraGood.x += timepassed * Camera.SCROLL_SPEED;
        }

        /*
        if (mouseY < edgeH) {
            cameraGood.y -= timepassed * Camera.SCROLL_SPEED;
        }
        if (mouseY > (height - edgeH)) {
            cameraGood.y += timepassed * Camera.SCROLL_SPEED;
        }
        if (mouseX < edgeW) {
            cameraGood.x -= timepassed * Camera.SCROLL_SPEED;
        }
        if (mouseX > (width - edgeW)) {
            cameraGood.x += timepassed * Camera.SCROLL_SPEED;
        }
        */
        //Do shake code each frame. tapers off linearly
        if (this.shakeTime > 0) {
            this.shakeTime -= timepassed;
            if (this.shakeTime < 0) {
                this.shakeTime = 0;
            }
            let percent = 1-(timepassed / Camera.MAX_SHAKE_TIME);
            let curveX = this.shakeTime / 4;
            let curveY = this.shakeTime / 3;
            this.shakeX = Camera.MAX_SHAKE_X * Math.cos(curveX) * percent;
            this.shakeY = Camera.MAX_SHAKE_Y * Math.sin(curveY) * percent;
        } else {
            this.shakeX = 0;
            this.shakeY = 0;
        }
    }

    addScreenShake() {
        this.shakeTime += Camera.MAX_SHAKE_TIME;
    }

    getX() {
        return this.x + this.shakeX;
    }

    getY() {
        return this.y + this.shakeY;
    }
}

const cameraGood = new Camera();

function ex(value) {
    return value -= cameraGood.getX();
}

function why(value) {
    return value -= cameraGood.getY();
}

function exReverse(value) {
    return value += cameraGood.getX();
}

function whyReverse(value) {
    return value += cameraGood.getY();
}