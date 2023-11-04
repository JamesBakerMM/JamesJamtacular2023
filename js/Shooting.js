class Shooting {

    constructor(delay, range) {
        this.timer = delay;
        this.delay = delay;
        this.range = range;
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

    reset(newTarget) {
        this.timer = this.delay;
    }

}