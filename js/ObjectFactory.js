const MIN_RANGE=300;
const MED_RANGE=500;
const LONG_RANGE=700;

class ObjectFactory {
    constructor() {
        this.images = new Array();
        this.anims = new Array();
    }

    preload() {
        this.images.push({id: "refinery", path: "assets/img/refinery.png"})
        this.images.push({id: "drone", path: "assets/img/drone_smallest.png"})
        this.images.push({id: "laser", path: "assets/img/laser.png"})
        this.images.push({id: "torpedo", path: "assets/img/torpedo.png"})
        this.images.push({id: "gun", path: "assets/img/destroyer.png"})

        this.anims.push({id: "rock", path: [
            "assets/img/rock_asteroid1.png",
            "assets/img/rock_asteroid2.png",
            "assets/img/rock_asteroid3.png",
            "assets/img/rock_asteroid4.png"
        ]})

        for(let img of this.images) {
            img.image = loadImage(img.path);
        }
        for(let ani of this.anims) {
            ani.image = loadAnimation(ani.path);
        }
    }

    /**
     * searches through given array for the asset we want
     * @param {int} id 
     * @param {array} images 
     * @returns img or animation or null
     */
    getByID(id,images) {
        for(let img of images) {
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

    createResource(x, y, amount=4) {
        let obj = this.createObject(x, y);
        console.log(this.getByID("rock",this.anims));
        obj.addAni("rock",this.getByID("rock",this.anims));
        obj.ani.stop();
        obj.scale = 2
        obj.metal=amount;
        obj.textSize=34;
        obj.text = obj.metal;
        return obj;
    }

    createRefinery(x, y) {
        let obj = this.createShip(x, y, "refinery");
        obj.image = this.getByID("refinery",this.images);
        obj.vel.x = 0.2;
        obj.range=LONG_RANGE;
        // obj.scale=2
        return obj;
    }

    createShip(x, y, type) {
        let obj = this.createObject(x, y);
        obj.originalPosition = {x: x, y: y};
        obj.targetPos = obj.originalPosition;
        obj.type = type;
        return obj;
    }

    createDrone(x, y) {
        let obj = this.createShip(x, y, "drone");
        obj.image = this.getByID("drone",this.images);
        obj.targetResource = null;
        obj.moveTimer = 0;
        obj.metal=0;
        return obj;
    }

    createLaser(x,y){
        let obj = this.createShip(x, y, "laser");
        obj.image = this.getByID("laser",this.images);
        // obj.scale = 1.5;
        obj.selected = false;
        obj.range=MIN_RANGE;
        
        return obj
    }

    createTorpedo(x,y){
        let obj = this.createShip(x, y, "torpedo");
        obj.image = this.getByID("torpedo",this.images);
        obj.diameter=obj.image.h-10;
        // obj.scale = 2;
        obj.range=LONG_RANGE;
        obj.selected = false;
        return obj
    }

    createGun(x,y){
        let obj = this.createShip(x, y, "gun");
        obj.image = this.getByID("gun",this.images);
        // obj.scale = 2;
        obj.selected = false;
        obj.range=MED_RANGE;
        return obj
    }
}