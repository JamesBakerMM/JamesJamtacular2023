class ObjectFactory {
    constructor() {
        this.images = new Array();
    }

    preload() {
        this.images.push({id: "crystal", path: "assets/img/crystal.png"})
        this.images.push({id: "refinery", path: "assets/img/refinery.png"})
        this.images.push({id: "drone", path: "assets/img/drone.png"})
        this.images.push({id: "laser", path: "assets/img/laser.png"})
        this.images.push({id: "torpedo", path: "assets/img/torpedo.png"})
        this.images.push({id: "gun", path: "assets/img/destroyer.png"})

        for(let img of this.images) {
            img.image = loadImage(img.path);
        }
    }

    getImageByID(id) {
        for(let img of this.images) {
            if (img.id === id) {
                return img.image;
            }
        }
        return null;
    }

    createObject(x, y) {
        let obj = new Sprite(x, y);
        // obj.debug = true;
        return obj;
    }

    createResource(x, y, amount) {
        let obj = this.createObject(x, y);
        obj.image = this.getImageByID("crystal");
        obj.scale = 0.35;
        obj.metal=5;
        obj.textSize=34;
        obj.text = obj.metal;
        return obj;
    }

    createRefinery(x, y) {
        let obj = this.createObject(x, y);
        obj.image = this.getImageByID("refinery");
        obj.vel.x = 0.2;
        obj.scale=1.2
        return obj;
    }

    createShip(x, y, type) {
        let obj = this.createObject(x, y);
        obj.type = type;
        return obj;
    }

    createDrone(x, y) {
        let obj = this.createShip(x, y, "drone");
        obj.image = this.getImageByID("drone");
        obj.originalPosition = {x: x, y: y};
        obj.targetResource = null;
        obj.moveTimer = 0;
        obj.metal=0;
        return obj;
    }

    createLaser(x,y){
        let obj = this.createShip(x, y, "laser");
        obj.image = this.getImageByID("laser");
        obj.scale = 1.5;
        obj.selected = false;
        obj.originalPosition = {x: x, y: y};
        return obj
    }

    createTorpedo(x,y){
        let obj = this.createShip(x, y, "torpedo");
        obj.image = this.getImageByID("torpedo");
        obj.diameter=obj.image.h-10;
        obj.scale = 2;
        obj.selected = false;
        obj.originalPosition = {x: x, y: y};
        return obj
    }

    createGun(x,y){
        let obj = this.createShip(x, y, "gun");
        obj.image = this.getImageByID("gun");
        obj.scale = 2;
        obj.selected = false;
        obj.originalPosition = {x: x, y: y};
        return obj
    }
}