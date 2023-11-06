class Shooting {

    constructor(delay, range) {
        this.timer = delay;
        this.delay = delay;
        this.range = range;
        this.target = null;
        this.constantFire = 0;
        this.target = null;
    }

    update(timepassed) {
        if (this.timer > 0) {
            this.timer -= timepassed;
        }
    }

    canShoot() {
        if (this.timer <= 0) {
            return true;
        } else {
            return false;
        }
    }

    getRange() {
        return this.range;
    }

    reset() {
        this.timer = this.delay;
    }

}