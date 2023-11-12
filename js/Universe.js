"use strict";

class Universe {
    static SIZE = 5000;

    constructor() {
        this.resources;
        this.factory;   
    }

    preload() {}

    setup(factory) {
        this.factory=factory;
        this.resources = new Group();
        for (let i = 0; i < 99; i++) {
            let x = random(5000);
            let y = random(5000);
            this.resources.push(this.factory.createResource(x, y, Math.round(random(4,12))));
        }
        let x = 1000;
        let y = 170;
        let faction = random([0, 1, 2, 3]);
        this.resources.push(this.factory.createWreckage(x, y, faction));
        if (random([true,false])) {
            x += random(-50,50);
            y += random(-50,50);
            this.resources.push(this.factory.createWreckage(x, y, faction));
        }
        if (random([true,false])) {
            x += random(-40,40);
            y += random(-40,40);
            this.resources.push(this.factory.createWreckage(x, y, faction));
        }
        

        for (let i = 0; i < 10; i++) {
            let x = random(Universe.SIZE/6, Universe.SIZE);
            let y = random(Universe.SIZE/6, Universe.SIZE);
            faction = random([0, 1, 2, 3]);

            this.resources.push(this.factory.createWreckage(x, y, faction));
            if (random([true,false])) {
                x += random(-50,50);
                y += random(-50,50);
                this.resources.push(this.factory.createWreckage(x, y, faction));
            }
            if (random([true,false])) {
                x += random(-40,40);
                y += random(-40,40);
                this.resources.push(this.factory.createWreckage(x, y, faction));
            }
        }
    }

    update() {
        if (this.resources.length === 0) {
            // Game over: You win! code goes here
        }
    }

    damage(resource, damage=1) {
        let preMetal = resource.metal;
        resource.metal -= damage;
        resource.mass = Math.floor(resource.metal);
        if (resource.metal <= 0) {
            resource.remove();
        }
        if (resource.type === "metal") {
            if (resource.metal <= resource.startingMetal/4) {
                resource.ani.frame = 3;
            } else if (resource.metal <= resource.startingMetal/2) {
                resource.ani.frame = 2;
            } else if (resource.metal <= resource.startingMetal/4*3) {
                resource.ani.frame = 1;
            }
        } else if (resource.type === "wreckage") {
            if (Math.floor(preMetal) != Math.floor(resource.metal)) {
                if (resource.ani.frame < resource.ani.length-1) {
                    resource.ani.nextFrame();
                }
            }
        }
    }
}