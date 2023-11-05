"use strict";

class Universe {
    constructor() {
        this.resources;
        this.factory;    
    }

    preload() {}

    setup(factory) {
        this.factory=factory;
        this.resources = new Group();
        for (let i = 0; i < 100; i++) {
            let x = random(5000);
            let y = random(5000);
            this.resources.push(this.factory.createResource(x, y, Math.round(random(4,12))));
        }
        this.resources.comets = new Group();
        let comet = this.factory.createResource(random(-100,0), 
                random(900,1000), 
                Math.round(random(20,35))); //Comet POC
        comet.vel.x = random(1,15);
        comet.vel.y = -5; //random(-5,0);
        this.resources.push(comet);
    }

    update() {}

    damage(resource) {
        resource.metal--;
        resource.text = resource.mass = resource.metal;
        if (resource.metal <= 0) {
            resource.remove();
        } else if (resource.metal <= resource.startingMetal/4) {
            resource.ani.frame = 3;
        } else if (resource.metal <= resource.startingMetal/2) {
            resource.ani.frame = 2;
        } else if (resource.metal <= resource.startingMetal/4*3) {
            resource.ani.frame = 1;
        }
    }
}