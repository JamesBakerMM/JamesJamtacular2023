class Health {

    constructor(maxHealth) {
        this.current = maxHealth;
        this.max = maxHealth;
        this.lastDamage = 0;
    }

    setHealth(maxHealth) {
        this.current = maxHealth;
        this.max = maxHealth;
    }

    getHealth() {
        return this.current;
    }

    getHealthPercent() {
        return (this.current / this.max);
    }

    getMaxHealth() {
        return this.max;
    }

    doDamage(amountOfDamage) {
        this.current = this.current - amountOfDamage;
        this.lastDamage = amountOfDamage;
        return this.current;
    }

    doHeal(amountOfHeal) {
        this.current = this.current + amountOfHeal;
        if (this.current > this.max) {
            this.current = this.max;
        }
        return this.current;
    }

    isDead() {
        if (this.current <= 0) {
            return true;
        } else {
            return false;
        }
    }
}